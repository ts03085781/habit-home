import { NextRequest } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    // Get all user families
    const userFamilies = await prisma.familyMember.findMany({
      where: { userId: user.id },
      select: { familyId: true }
    });

    const familyIds = userFamilies.map(f => f.familyId);

    // Statistics for all family tasks
    const [
      pendingTasks,
      completedTasks,
      totalPoints
    ] = await Promise.all([
      // Pending tasks count
      prisma.task.count({
        where: {
          familyId: { in: familyIds },
          status: { in: ['PENDING', 'IN_PROGRESS'] }
        }
      }),
      
      // Completed tasks count
      prisma.task.count({
        where: {
          familyId: { in: familyIds },
          status: 'COMPLETED'
        }
      }),
      
      // User total points
      prisma.pointRecord.aggregate({
        where: {
          userId: user.id,
          familyId: { in: familyIds }
        },
        _sum: {
          points: true
        }
      })
    ]);

    // User personal task statistics
    const [
      userPendingTasks,
      userCompletedTasks
    ] = await Promise.all([
      // Pending tasks assigned to user
      prisma.task.count({
        where: {
          familyId: { in: familyIds },
          assignedToId: user.id,
          status: { in: ['PENDING', 'IN_PROGRESS'] }
        }
      }),
      
      // Completed tasks assigned to user
      prisma.task.count({
        where: {
          familyId: { in: familyIds },
          assignedToId: user.id,
          status: 'COMPLETED'
        }
      })
    ]);

    // Recent task activity
    const recentTasks = await prisma.task.findMany({
      where: {
        familyId: { in: familyIds },
        OR: [
          { assignedToId: user.id },
          { createdById: user.id }
        ]
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
            avatar: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5
    });

    const stats = {
      overview: {
        pendingTasks,
        completedTasks,
        totalPoints: totalPoints._sum.points || 0,
        totalTasks: pendingTasks + completedTasks
      },
      personal: {
        pendingTasks: userPendingTasks,
        completedTasks: userCompletedTasks,
        totalTasks: userPendingTasks + userCompletedTasks
      },
      recentActivity: recentTasks
    };

    return successResponse(stats);
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
    return errorResponse('Failed to fetch statistics');
  }
}