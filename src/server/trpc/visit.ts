import { z } from 'zod';
import { router, publicProcedure } from './index';

export const visitRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.visit.findMany({
      include: { mentor: true, school: true },
      orderBy: { date: 'asc' },
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        mentorId: z.string(),
        schoolId: z.string(),
        date: z.coerce.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.visit.create({
        data: {
          mentorId: input.mentorId,
          schoolId: input.schoolId,
          date: input.date,
        },
      });
    }),
});
