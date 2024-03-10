import { z } from "zod";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const todoTable = sqliteTable('todos', {
  id: integer("id").primaryKey(),
  text: text("content"),
  done: integer("done"),
  archived: integer("archived"),
});

export const moodTable = sqliteTable('moods', {
  id: integer("id").primaryKey(),
  mood: integer("mood"),
  date: text("date"),
});

export const bookmarksTable = sqliteTable('bookmarks', {
  id: integer("id").primaryKey(),
  url: text("url"),
  title: text("title"),
  description: text("description"),
  type: text("type"),
});

export const notesTable = sqliteTable('notes', {
  id: integer("id").primaryKey(),
  title: text("title"),
  content: text("content"),
});

export const pomodoroSettingsTable = sqliteTable('pomodoroSettings', {
  id: integer("id").primaryKey(),
  workDuration: integer("workDuration"),
  shortBreakDuration: integer("shortBreakDuration"),
  longBreakDuration: integer("longBreakDuration"),
  longBreakInterval: integer("longBreakInterval"),
});
