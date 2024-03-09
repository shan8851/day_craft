import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { notesTable } from '@/db/schema';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';

export const notesRouter = router({
  getNotes: publicProcedure.query(async () => {
    return await db.select().from(notesTable).all();
  }),
  addNote: publicProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await db
        .insert(notesTable)
        .values({ title: input.title, content: input.content })
        .run();
    }),
  deleteNote: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await db
        .delete(notesTable)
        .where(eq(notesTable.id, input))
        .run();
    }),
  updateNote: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const updateFields = Object.fromEntries(
        Object.entries(input).filter(([key, value]) => key !== 'id' && value !== undefined)
      );

      return await db
        .update(notesTable)
        .set(updateFields)
        .where(eq(notesTable.id, input.id))
        .run();
    }),

});
