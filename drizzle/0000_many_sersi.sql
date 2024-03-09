CREATE TABLE `bookmarks` (
	`id` integer PRIMARY KEY NOT NULL,
	`url` text,
	`title` text,
	`description` text,
	`type` text
);
--> statement-breakpoint
CREATE TABLE `moods` (
	`id` integer PRIMARY KEY NOT NULL,
	`mood` integer,
	`date` text
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`content` text
);
--> statement-breakpoint
CREATE TABLE `pomodoroSettings` (
	`id` integer PRIMARY KEY NOT NULL,
	`workDuration` integer,
	`shortBreakDuration` integer,
	`longBreakDuration` integer,
	`longBreakInterval` integer
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`content` text,
	`done` integer
);
