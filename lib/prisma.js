// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;
const prismaClient = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;

// export as a named export
export const prisma = prismaClient;
