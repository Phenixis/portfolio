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

export const todo = pgTable('todo', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 255}).notNull(),
    importance: integer('importance').notNull().default(0),
    urgency: integer('urgency').notNull().default(0),
    duration: integer('duration').notNull().default(0),
    score: integer('score').notNull().default(0),
    due: timestamp('due').notNull(),
    completed_at: timestamp('completed_at'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});

export const meteo = pgTable('meteo', {
    day: varchar('day', {length: 10}).primaryKey(),
    temperature: integer('temperature').notNull(),
    summary: varchar('summary', {length: 255}).notNull(),
    icon: varchar('icon', {length: 255}).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});

export type Todo = typeof todo.$inferSelect;
export type NewTodo = typeof todo.$inferInsert;
export type Meteo = typeof meteo.$inferSelect;
export type NewMeteo = typeof meteo.$inferInsert;