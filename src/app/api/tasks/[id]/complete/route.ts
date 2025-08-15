import { NextRequest } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(
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

    // Check if user is a member of this family
    const isFamilyMember = existingTask.family.members.some(
      member => member.userId === user.id
    );

    if (!isFamilyMember) {
      return errorResponse('You are not a member of this family', 403);
    }

    // Check if task is already completed
    if (existingTask.status === 'COMPLETED') {
      return errorResponse('Task is already completed', 400);
    }

    // Update task status to completed
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
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

    return successResponse(updatedTask);
  } catch (error) {
    console.error('Failed to complete task:', error);
    return errorResponse('Failed to complete task');
  }
}