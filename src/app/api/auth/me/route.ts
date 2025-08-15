import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    
    if (auth.error) {
      return unauthorizedResponse(auth.error);
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: auth.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        familyMembers: {
          include: {
            family: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse(user);

  } catch (error) {
    console.error('Get user info error:', error);
    return errorResponse('Failed to get user information');
  }
}