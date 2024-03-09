// Import necessary libraries and modules
import { publicProcedure, router } from '../trpc'
import { z } from 'zod'
import { todoTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '@/db/db';

// Define the todo router using the tRPC router function
export const todoRouter = router({
  getTodos: publicProcedure.query(async () => {
    return await db.select().from(todoTable).all();
  }),
  addTodo: publicProcedure.input(z.string()).mutation(async (opts) => {
    return await db.insert(todoTable).values({ text: opts.input, done: 0, archived: 0 }).run();
  }),
  toggleTodo: publicProcedure.input(z.object({
    id: z.number(),
    done: z.number(),
  })).mutation(async (opts) => {
    return await db
      .update(todoTable)
      .set({ done: opts.input.done })
      .where(eq(todoTable.id, opts.input.id))
      .run();
  }),
  deleteTodo: publicProcedure.input(z.number()).mutation(async (opts) => {
    return await db
      .delete(todoTable)
      .where(eq(todoTable.id, opts.input))
      .run();
  }),
  archiveTodo: publicProcedure.input(z.object({
    id: z.number(),
    archived: z.number(),
  })).mutation(async (opts) => {
    return await db
      .update(todoTable)
      .set({ archived: opts.input.archived })
      .where(eq(todoTable.id, opts.input.id))
      .run();
  }),
});

