import { NextRequest } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { createValidationSchemas } from '@/lib/validations';
import { z } from 'zod';

// Extended update schema with status field
function createExtendedUpdateTaskSchema(locale: 'en' | 'zh' = 'en') {
  const { UpdateTaskSchema } = createValidationSchemas(locale);
  return UpdateTaskSchema.extend({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    assignedToId: z.string().optional().nullable(),
    dueDate: z.string().optional().transform((val) => val ? new Date(val) : undefined).nullable()
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyTokenFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;
    const body = await request.json();
    const locale = (body.locale || 'en') as 'en' | 'zh';
    
    const UpdateTaskSchema = createExtendedUpdateTaskSchema(locale);
    const validation = UpdateTaskSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        family: {
          include: {
            members: true
          }
        }
      }
    });

    if (!existingTask) {
      return errorResponse('Task not found', 404);
    }

    // Check if user is a member of this family
    const isFamilyMember = existingTask.family.members.some(
      member => member.userId === user.id
    );

    if (!isFamilyMember) {
      return errorResponse('You are not a member of this family', 403);
    }

    const updateData = validation.data;

    // If updating status to completed, set completion time and point record
    if (updateData.status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      // Create point record (if task has points and is assigned to a user)
      if (existingTask.points > 0 && existingTask.assignedToId) {
        await prisma.pointRecord.create({
          data: {
            userId: existingTask.assignedToId,
            familyId: existingTask.familyId,
            taskId: existingTask.id,
            points: existingTask.points,
            type: 'EARNED',
            description: `Task completed: ${existingTask.title}`
          }
        });
      }

      // Completion time will be handled in the update below
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...updateData,
        completedAt: updateData.status === 'COMPLETED' ? new Date() : 
                     updateData.status === 'PENDING' || updateData.status === 'IN_PROGRESS' ? null : 
                     existingTask.completedAt
      },
      include: {
        family: {
          select: {
            id: true,
            name: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    return successResponse(updatedTask);
  } catch (error) {
    console.error('Failed to update task:', error);
    return errorResponse('Failed to update task');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyTokenFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        family: {
          include: {
            members: true
          }
        }
      }
    });

    if (!existingTask) {
      return errorResponse('Task not found', 404);
    }

    // Check if user is a family member and is the task creator or admin
    const familyMember = existingTask.family.members.find(
      member => member.userId === user.id
    );

    if (!familyMember) {
      return errorResponse('You are not a member of this family', 403);
    }

    // Only task creator or family admin can delete task
    if (existingTask.createdById !== user.id && familyMember.role !== 'ADMIN') {
      return errorResponse('No permission to delete this task', 403);
    }

    // Delete related point records
    await prisma.pointRecord.deleteMany({
      where: { taskId: id }
    });

    // Delete task
    await prisma.task.delete({
      where: { id }
    });

    return successResponse({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return errorResponse('Failed to delete task');
  }
}