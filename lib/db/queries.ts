"use server";

import { desc, and, eq, isNull, or, isNotNull, count, sql } from 'drizzle-orm';
import { db } from './drizzle';
import { todo, session, type Todo } from './schema';

// # TODO

// ## Create
export async function createTodo(title: string, importance: number, urgency: number, duration: number) {
    const result = await db.insert(todo).values({ 
        title: title,
        importance: importance,
        urgency: urgency,
        duration: duration,
        score: (importance*urgency)-duration,
    }).returning({ id: todo.id });

    return result[0].id;
}

// ## Read
export async function getTodos(orderBy: keyof Todo = "score", limit: number = 50) {
    if (limit === -1) {
        return await db.select().from(todo).orderBy(desc(todo[orderBy]));
    }
    return await db.select().from(todo).orderBy(desc(todo[orderBy])).limit(limit);
}

export async function getTodoById(id: number) {
    return await db.select().from(todo).where(eq(todo.id, id));
}

export async function getCompletedTodos(orderBy: keyof Todo = "completed_at", limit: number = 50) {
    if (limit === -1) {
        return await db.select().from(todo).where(isNotNull(todo.completed_at)).orderBy(desc(todo[orderBy]));
    }
    return await db.select().from(todo).where(isNotNull(todo.completed_at)).orderBy(desc(todo[orderBy])).limit(limit);
}

export async function getUncompletedTodos(orderBy: keyof Todo = "score", limit: number = 50) {
    if (limit === -1) {
        return await db.select().from(todo).where(isNull(todo.completed_at)).orderBy(desc(todo[orderBy]));
    }
    return await db.select().from(todo).where(isNull(todo.completed_at)).orderBy(desc(todo[orderBy])).limit(limit);
}

export async function searchTodosByTitle(title: string, limit: number = 50) {
    if (limit === -1) {
        return await db.select().from(todo).where(sql`${todo.title} LIKE ${`%${title}%`}`);
    }
    return await db.select().from(todo).where(sql`${todo.title} LIKE ${`%${title}%`}`).limit(limit);
}

// ## Update
export async function updateTodo(id: number, title: string, importance: number, urgency: number, duration: number) {
    const result = await db.update(todo).set({
        title: title,
        importance: importance,
        urgency: urgency,
        duration: duration,
        score: (importance*urgency)-duration,
        updated_at: sql`CURRENT_TIMESTAMP`
    }).where(eq(todo.id, id)).returning({ id: todo.id });

    return result[0].id;
}

export async function markTodoAsDone(id: number) {
    const result = await db.update(todo).set({
        completed_at: sql`CURRENT_TIMESTAMP`,
        updated_at: sql`CURRENT_TIMESTAMP`
    }).where(eq(todo.id, id)).returning({ id: todo.id });

    return result[0].id;
}

export async function markTodoAsUndone(id: number) {
    const result = await db.update(todo).set({
        completed_at: null,
        updated_at: sql`CURRENT_TIMESTAMP`
    }).where(eq(todo.id, id)).returning({ id: todo.id });

    return result[0].id;
}

export async function toggleTodo(id: number, currentState: boolean) {
    return currentState ? await markTodoAsUndone(id) : await markTodoAsDone(id);
}

// ## Delete

export async function deleteTodoById(id: number) {
    const result = await db.delete(todo).where(eq(todo.id, id)).returning({ id: todo.id });

    return result[0].id;
}

// # SESSION

// ## Create

export async function createSession(token: string, validate_until?: Date) {
    return await db.insert(session).values({ token, validate_until: validate_until ? validate_until : sql`CURRENT_TIMESTAMP + INTERVAL '24 HOURS'` });
}

// ## Read

export async function getSessionByToken(token: string) {
    return await db.select().from(session).where(eq(session.token, token));
}

// ## Update

export async function revalidateSession(token: string) {
    return await db.update(session).set({ validate_until: sql`CURRENT_TIMESTAMP + INTERVAL '24 HOURS'` }).where(eq(session.token, token));
}

// ## Delete

export async function deleteSession(token: string) {
    return await db.delete(session).where(eq(session.token, token));
}