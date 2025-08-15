import { NextRequest } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { createValidationSchemas } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get('familyId');

    let whereCondition: any = {};

    if (familyId) {
      // Check if user is a member of this family
      const familyMember = await prisma.familyMember.findUnique({
        where: {
          userId_familyId: {
            userId: user.id,
            familyId: familyId
          }
        }
      });

      if (!familyMember) {
        return errorResponse('You are not a member of this family', 403);
      }

      whereCondition.familyId = familyId;
    } else {
      // Get tasks from all user's families
      const userFamilies = await prisma.familyMember.findMany({
        where: { userId: user.id },
        select: { familyId: true }
      });

      whereCondition.familyId = {
        in: userFamilies.map(f => f.familyId)
      };
    }

    const tasks = await prisma.task.findMany({
      where: whereCondition,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return successResponse(tasks);
  } catch (error) {
    console.error('Failed to fetch task list:', error);
    return errorResponse('Failed to fetch task list');
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const locale = (body.locale || 'en') as 'en' | 'zh';
    const { CreateTaskSchema } = createValidationSchemas(locale);
    const validation = CreateTaskSchema.safeParse(body);
    
    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { title, description, points, category, priority, familyId, assignedToId, dueDate } = validation.data;

    // 檢查用戶是否為該家庭成員
    const familyMember = await prisma.familyMember.findUnique({
      where: {
        userId_familyId: {
          userId: user.id,
          familyId: familyId
        }
      }
    });

    if (!familyMember) {
      return errorResponse('您不是該家庭的成員', 403);
    }

    // If assigned user is specified, check if they are a family member
    if (assignedToId) {
      const assignedMember = await prisma.familyMember.findUnique({
        where: {
          userId_familyId: {
            userId: assignedToId,
            familyId: familyId
          }
        }
      });

      if (!assignedMember) {
        return errorResponse('The assigned user is not a member of this family', 400);
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        points,
        category,
        priority,
        familyId,
        assignedToId,
        createdById: user.id,
        dueDate
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

    return successResponse(task, 201);
  } catch (error) {
    console.error('Failed to create task:', error);
    return errorResponse('Failed to create task');
  }
}