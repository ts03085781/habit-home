import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateTokens(user: { id: string; email: string; name: string }) {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    name: user.name
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '15m'
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d'
  });

  return { accessToken, refreshToken };
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', status: 401 };
  }

  const token = authHeader.substring(7);
  const decoded = await verifyToken(token);

  if (!decoded) {
    return { error: 'Invalid or expired token', status: 401 };
  }

  // 驗證用戶是否仍然存在 | Verify if user still exists
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, name: true }
  });

  if (!user) {
    return { error: 'User not found', status: 401 };
  }

  return { user };
}

// 從 NextRequest 中驗證用戶的便捷函數 | Convenience function to verify user from NextRequest
export async function verifyTokenFromRequest(request: NextRequest): Promise<{ id: string; email: string; name: string } | null> {
  const authResult = await authenticateRequest(request);
  if ('error' in authResult) {
    return null;
  }
  return authResult.user;
}