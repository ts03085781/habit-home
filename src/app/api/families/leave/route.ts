import { NextRequest } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

const LeaveFamilySchema = z.object({
  familyId: z.string().min(1, '群組ID不能為空')
});

export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request);
    if (!user) {
      return errorResponse('未授權', 401);
    }

    const body = await request.json();
    const validation = LeaveFamilySchema.safeParse(body);
    
    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { familyId } = validation.data;

    // 檢查用戶是否為該家庭成員
    const familyMember = await prisma.familyMember.findUnique({
      where: {
        userId_familyId: {
          userId: user.id,
          familyId: familyId
        }
      },
      include: {
        family: {
          include: {
            _count: {
              select: {
                members: true
              }
            }
          }
        }
      }
    });

    if (!familyMember) {
      return errorResponse('您不是該群組的成員', 404);
    }

    // 檢查是否為群組的最後一個成員（如果是，則不能退出）
    if (familyMember.family._count.members === 1) {
      return errorResponse('您是群組的最後一個成員，無法退出群組', 400);
    }

    // 檢查是否為群組管理員且群組中還有其他成員
    if (familyMember.role === 'ADMIN') {
      const otherMembers = await prisma.familyMember.findMany({
        where: {
          familyId: familyId,
          userId: { not: user.id }
        }
      });

      if (otherMembers.length > 0) {
        // 如果有其他成員，將第一個成員提升為管理員
        await prisma.familyMember.update({
          where: {
            userId_familyId: {
              userId: otherMembers[0].userId,
              familyId: familyId
            }
          },
          data: {
            role: 'ADMIN'
          }
        });
      }
    }

    // 刪除用戶的群組成員記錄
    await prisma.familyMember.delete({
      where: {
        userId_familyId: {
          userId: user.id,
          familyId: familyId
        }
      }
    });

    return successResponse({ message: '已成功退出群組' });
  } catch (error) {
    console.error('退出群組錯誤:', error);
    return errorResponse('退出群組失敗');
  }
}
