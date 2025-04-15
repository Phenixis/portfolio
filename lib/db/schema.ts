import {
    pgTable,
    serial,
    varchar,
    text,
    timestamp,
    integer,
    primaryKey,
    boolean
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const importance = pgTable('importance', {
    level: integer("level").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
})

export const duration = pgTable('duration', {
    level: integer("level").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
})

export const project = pgTable('project', {
    title: varchar('title', { length: 255 }).primaryKey(),
    description: text('description'),
    completed: boolean('completed').notNull().default(false),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});

export const todo = pgTable('todo', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    importance: integer('importance')
        .notNull()
        .default(0)
        .references(() => importance.level),
    urgency: integer('urgency').notNull().default(0),
    duration: integer('duration')
        .notNull()
        .default(0)
        .references(() => duration.level),
    score: integer('score').notNull().default(0),
    due: timestamp('due').notNull().defaultNow(),
    project_title: varchar('project_title', { length: 255 })
        .references(() => project.title),
    completed_at: timestamp('completed_at'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});

export const meteo = pgTable('meteo', {
    day: varchar('day', { length: 10 }).primaryKey(),
    temperature: integer('temperature').notNull(),
    summary: varchar('summary', { length: 255 }).notNull(),
    icon: varchar('icon', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});

export type Todo = typeof todo.$inferSelect;
export type NewTodo = typeof todo.$inferInsert;
export type Meteo = typeof meteo.$inferSelect;
export type NewMeteo = typeof meteo.$inferInsert;
export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
export type Importance = typeof importance.$inferSelect;
export type NewImportance = typeof importance.$inferInsert;
export type Duration = typeof duration.$inferSelect;
export type NewDuration = typeof duration.$inferInsert;