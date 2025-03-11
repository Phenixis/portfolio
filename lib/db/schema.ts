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

export const user = pgTable('user', {
    email: varchar("email").primaryKey(),
    firstName: varchar("first_name"),
    lastName: varchar("last_name"),
    passwordHash: text("password_hash"),
    apiKey: varchar("api_key")
})