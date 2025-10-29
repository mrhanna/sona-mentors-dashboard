import { PrismaClient } from '@prisma/client';

declare global {
  // allow global prisma during development to avoid multiple clients
  // eslint-disable-next-line vars-on-top, no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
