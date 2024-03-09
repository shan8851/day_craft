import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { bookmarksTable } from '@/db/schema';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';

export const bookmarksRouter = router({
  getBookmarks: publicProcedure.query(async () => {
    return await db.select().from(bookmarksTable).all();
  }),
  addBookmark: publicProcedure
    .input(
      z.object({
        url: z.string(),
        title: z.string(),
        description: z.string().optional(),
        type: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db
        .insert(bookmarksTable)
        .values({
          url: input.url,
          title: input.title,
          description: input.description,
          type: input.type,
        })
        .run();
    }),
  deleteBookmark: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await db
        .delete(bookmarksTable)
        .where(eq(bookmarksTable.id, input))
        .run();
    }),
  updateBookmark: publicProcedure
    .input(
      z.object({
        id: z.number(),
        url: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateFields = Object.fromEntries(
        Object.entries(input).filter(
          ([key, value]) => key !== 'id' && value !== undefined
        )
      );

      return await db
        .update(bookmarksTable)
        .set(updateFields)
        .where(eq(bookmarksTable.id, input.id))
        .run();
    }),
});
