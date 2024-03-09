import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const todoTable = sqliteTable('todos', {
  id: integer("id").primaryKey(),
  text: text("content").notNull(),
  done: integer("done").notNull(),
});

export const moodTable = sqliteTable('moods', {
  id: integer("id").primaryKey(),
  mood: integer("mood").notNull(),
  date: text("date").unique().notNull(),
});

export const bookmarksTable = sqliteTable('bookmarks', {
  id: integer("id").primaryKey(),
  url: text("url").unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type"),
});

export const notesTable = sqliteTable('notes', {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

export const pomodoroSettingsTable = sqliteTable('pomodoroSettings', {
  id: integer("id").primaryKey(),
  workDuration: integer("workDuration"),
  shortBreakDuration: integer("shortBreakDuration"),
  longBreakDuration: integer("longBreakDuration"),
  longBreakInterval: integer("longBreakInterval"),
});
