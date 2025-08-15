import { z } from 'zod';
import { getValidationMessages, type Locale } from './validation-messages';

// Create validation schemas with locale support
function createValidationSchemas(locale: Locale = 'en') {
  const messages = getValidationMessages(locale);

  return {
    RegisterSchema: z.object({
      email: z.string().email(messages.email.invalid),
      password: z.string()
        .min(6, messages.password.minLength)
        .max(100, messages.password.maxLength),
      name: z.string()
        .min(1, messages.name.required)
        .max(50, messages.name.maxLength),
      confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
      message: messages.confirmPassword.mismatch,
      path: ['confirmPassword']
    }),

    LoginSchema: z.object({
      email: z.string().email(messages.email.invalid),
      password: z.string().min(1, messages.password.required)
    }),

    RefreshTokenSchema: z.object({
      refreshToken: z.string().min(1, messages.refreshToken.required)
    }),

    CreateFamilySchema: z.object({
      name: z.string().min(1, messages.family.nameRequired).max(50, messages.family.nameMaxLength),
      description: z.string().max(200, messages.family.descriptionMaxLength).optional()
    }),

    UpdateFamilySchema: z.object({
      name: z.string().min(1, messages.family.nameRequired).max(50, messages.family.nameMaxLength).optional(),
      description: z.string().max(200, messages.family.descriptionMaxLength).optional()
    }),

    JoinFamilySchema: z.object({
      inviteCode: z.string().min(1, messages.inviteCode.required)
    }),

    CreateTaskSchema: z.object({
      title: z.string().min(1, messages.task.titleRequired).max(100, messages.task.titleMaxLength),
      description: z.string().max(500, messages.task.descriptionMaxLength).optional(),
      points: z.number().min(0, messages.task.pointsMin).max(1000, messages.task.pointsMax),
      category: z.string().min(1, messages.task.categoryRequired).max(50, messages.task.categoryMaxLength),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
        message: messages.task.priorityInvalid
      }),
      dueDate: z.string().datetime().optional(),
      familyId: z.string().min(1, messages.task.familyIdRequired),
      assignedToId: z.string().optional()
    }),

    UpdateTaskSchema: z.object({
      title: z.string().min(1, messages.task.titleRequired).max(100, messages.task.titleMaxLength).optional(),
      description: z.string().max(500, messages.task.descriptionMaxLength).optional(),
      points: z.number().min(0, messages.task.pointsMin).max(1000, messages.task.pointsMax).optional(),
      category: z.string().min(1, messages.task.categoryRequired).max(50, messages.task.categoryMaxLength).optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
      dueDate: z.string().datetime().optional(),
      assignedToId: z.string().optional()
    }),

    AssignTaskSchema: z.object({
      assignedToId: z.string().min(1, messages.task.assignedToRequired)
    })
  };
}

// Default schemas (English)
const defaultSchemas = createValidationSchemas('en');

// Export default schemas for backward compatibility
export const RegisterSchema = defaultSchemas.RegisterSchema;
export const LoginSchema = defaultSchemas.LoginSchema;
export const RefreshTokenSchema = defaultSchemas.RefreshTokenSchema;
export const CreateFamilySchema = defaultSchemas.CreateFamilySchema;
export const UpdateFamilySchema = defaultSchemas.UpdateFamilySchema;
export const JoinFamilySchema = defaultSchemas.JoinFamilySchema;
export const CreateTaskSchema = defaultSchemas.CreateTaskSchema;
export const UpdateTaskSchema = defaultSchemas.UpdateTaskSchema;
export const AssignTaskSchema = defaultSchemas.AssignTaskSchema;

// Export function to create schemas with specific locale
export { createValidationSchemas };

// API響應類型 | API response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface APIError {
  message: string;
  code?: string;
  details?: any;
}