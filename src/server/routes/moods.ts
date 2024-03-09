import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { moodTable } from '@/db/schema';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { format } from 'date-fns';

export const moodRouter = router({
  addOrUpdateMood: publicProcedure
    .input(
      z.object({
        mood: z.number().min(1).max(5),
        date: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      const formattedDate = format(input.date, 'yyyy-MM-dd');
      const updateResult = await db
        .update(moodTable)
        .set({ mood: input.mood })
        .where(eq(moodTable.date, formattedDate))
        .run();

      if (updateResult.changes === 0) {
        return await db
          .insert(moodTable)
          .values({ mood: input.mood, date: formattedDate })
          .run();
      }

      return updateResult;
    }),
  getAllMoods: publicProcedure.query(async () => {
    return await db.select().from(moodTable).all();
  }),
  getMoodByDate: publicProcedure.input(z.string()).query(async ({ input }) => {
    const result = await db
      .select()
      .from(moodTable)
      .where(eq(moodTable.date, input));
    return result;
  }),
});
