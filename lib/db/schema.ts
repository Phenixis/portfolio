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
    completed_at: timestamp('completed_at'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});

export const session = pgTable('session', {
    token : varchar('token', {length: 255}).primaryKey(),
    validate_until : timestamp('validate_until').notNull()
});

export type Todo = typeof todo.$inferSelect;
export type NewTodo = typeof todo.$inferInsert;