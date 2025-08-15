import { PrismaClient } from '@prisma/client'

//建立全域變數 | Create global variable
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

//建立全域變數 | Create global variable
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

//將全域變數設為prisma | Set global variable to prisma
globalForPrisma.prisma = prisma