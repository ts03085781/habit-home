import { NextRequest } from 'next/server';
import { createValidationSchemas } from '@/lib/validations';
import { hashPassword, generateTokens } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

// Translation messages
const messages = {
  en: {
    emailExists: 'This email is already registered',
    registerFailed: 'Registration failed, please try again later'
  },
  zh: {
    emailExists: '此電子郵件已被註冊',
    registerFailed: '註冊失敗，請稍後再試'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = (body.locale || 'en') as 'en' | 'zh';
    const t = messages[locale];
    
    // Validate input data
    const { RegisterSchema } = createValidationSchemas(locale);
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { email, password, name } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return errorResponse(t.emailExists, 409);
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true
      }
    });

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user);

    return successResponse({
      user,
      token: accessToken,
      refreshToken
    }, 201);

  } catch (error) {
    console.error('Registration error:', error);
    const locale = 'en'; // Default fallback
    const t = messages[locale];
    return errorResponse(t.registerFailed);
  }
}