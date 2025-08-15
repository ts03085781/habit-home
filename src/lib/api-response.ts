import { NextResponse } from 'next/server';
import { APIResponse } from './validations';

export function successResponse<T>(data: T, status: number = 200): NextResponse<APIResponse<T>> {
  return NextResponse.json({
    success: true,
    data
  }, { status });
}

export function errorResponse(
  error: string, 
  status: number = 500, 
  details?: any
): NextResponse<APIResponse> {
  return NextResponse.json({
    success: false,
    error,
    details
  }, { status });
}

export function validationErrorResponse(details: any): NextResponse<APIResponse> {
  return NextResponse.json({
    success: false,
    error: 'Validation failed',
    details
  }, { status: 400 });
}

export function unauthorizedResponse(message: string = 'Unauthorized access'): NextResponse<APIResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 401 });
}

export function forbiddenResponse(message: string = 'Access denied'): NextResponse<APIResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 403 });
}

export function notFoundResponse(message: string = 'Resource not found'): NextResponse<APIResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 404 });
}