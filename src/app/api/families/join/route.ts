import { NextRequest } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { createValidationSchemas } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const locale = (body.locale || 'en') as 'en' | 'zh';
    const { JoinFamilySchema } = createValidationSchemas(locale);
    const validation = JoinFamilySchema.safeParse(body);
    
    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { inviteCode } = validation.data;

    // Find family
    const family = await prisma.family.findUnique({
      where: { inviteCode: inviteCode.toUpperCase() }
    });

    if (!family) {
      return errorResponse('Invalid invite code', 404);
    }

    // Check if user is already a member of this family
    const existingMember = await prisma.familyMember.findUnique({
      where: {
        userId_familyId: {
          userId: user.id,
          familyId: family.id
        }
      }
    });

    if (existingMember) {
      return errorResponse('You are already a member of this family', 409);
    }

    // Join family
    const familyMember = await prisma.familyMember.create({
      data: {
        userId: user.id,
        familyId: family.id,
        role: 'MEMBER'
      }
    });

    // Return updated family information
    const updatedFamily = await prisma.family.findUnique({
      where: { id: family.id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: {
            tasks: true,
            members: true
          }
        }
      }
    });

    return successResponse(updatedFamily);
  } catch (error) {
    console.error('Failed to join family:', error);
    return errorResponse('Failed to join family');
  }
}