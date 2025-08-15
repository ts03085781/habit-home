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

    const families = await prisma.family.findMany({
      where: {
        members: {
          some: {
            userId: user.id
          }
        }
      },
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

    return successResponse(families);
  } catch (error) {
    console.error('Failed to fetch family list:', error);
    return errorResponse('Failed to fetch family list');
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
    const { CreateFamilySchema } = createValidationSchemas(locale);
    const validation = CreateFamilySchema.safeParse(body);
    
    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { name, description } = validation.data;

    // Generate invite code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const family = await prisma.family.create({
      data: {
        name,
        description,
        inviteCode,
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN'
          }
        }
      },
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
        }
      }
    });

    return successResponse(family, 201);
  } catch (error) {
    console.error('Failed to create family:', error);
    return errorResponse('Failed to create family');
  }
}