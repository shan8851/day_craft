import { moodRouter } from './routes/moods';
import { notesRouter } from './routes/notes';
import { todoRouter } from './routes/todos';
import { router } from './trpc';
import { bookmarksRouter } from './routes/bookmarks';

export const appRouter = router({
  todos: todoRouter,
  notes: notesRouter,
  moods: moodRouter,
  bookmarks: bookmarksRouter,
});

export type AppRouter = typeof appRouter;
