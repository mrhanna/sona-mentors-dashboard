import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { prisma } from '../db';

export const createContext = () => ({ prisma });

const t = initTRPC.context<ReturnType<typeof createContext>>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
