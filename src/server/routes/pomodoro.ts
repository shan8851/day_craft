import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { pomodoroSettingsTable } from '@/db/schema';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';

export const pomodoroSettingsRouter = router({
getSettings: publicProcedure.query(async () => {
  // Fetch all settings records and manually select the first one
  const settings = await db.select().from(pomodoroSettingsTable).all();
  return settings.length > 0 ? settings[0] : null;
}),
upsertSettings: publicProcedure
  .input(z.object({
    workDuration: z.number().min(1),
    shortBreakDuration: z.number().min(1),
    longBreakDuration: z.number().min(1),
    longBreakInterval: z.number().min(1),
  }))
  .mutation(async ({ input }) => {
    const settings = await db.select().from(pomodoroSettingsTable).all();
    const existingSettings = settings.length > 0 ? settings[0] : null;
    let result;
    if (existingSettings) {
      // Update the existing settings
      result = await db
        .update(pomodoroSettingsTable)
        .set(input)
        .where(eq(pomodoroSettingsTable.id, existingSettings.id))
        .run();
    } else {
      result = await db
        .insert(pomodoroSettingsTable)
        .values(input)
        .run();
    }
    return result;
  }),

});
