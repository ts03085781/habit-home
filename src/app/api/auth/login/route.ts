import { NextRequest } from 'next/server';
import { createValidationSchemas } from '@/lib/validations';
import { verifyPassword, generateTokens } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

// Translation messages
const messages = {
  en: {
    invalidCredentials: 'Invalid email or password',
    loginFailed: 'Login failed, please try again later'
  },
  zh: {
    invalidCredentials: '電子郵件或密碼不正確',
    loginFailed: '登入失敗，請稍後再試'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = (body.locale || 'en') as 'en' | 'zh';
    const t = messages[locale];
    
    // Validate input data
    const { LoginSchema } = createValidationSchemas(locale);
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!user) {
      return errorResponse(t.invalidCredentials, 401);
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(t.invalidCredentials, 401);
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      name: user.name
    });

    // Remove password field
    const { password: _, ...userWithoutPassword } = user;

    return successResponse({
      user: userWithoutPassword,
      token: accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    const locale = 'en'; // Default fallback
    const t = messages[locale];
    return errorResponse(t.loginFailed);
  }
}