import { desc, and, eq, isNull, or, isNotNull, count, sql } from 'drizzle-orm';
import { db } from './drizzle';
import { todo, session } from './schema';

// # TODO

// ## Create
export async function createTodo(title: string) {
    return await db.insert(todo).values({ title });
}

// ## Read
export async function getTodos() {
    return await db.select().from(todo).orderBy(desc(todo.created_at));
}

export async function getTodoById(id: number) {
    return await db.select().from(todo).where(eq(todo.id, id));
}

export async function getCompletedTodos() {
    return await db.select().from(todo).where(isNotNull(todo.completed_at)).orderBy(desc(todo.completed_at));
}

export async function getUncompletedTodos() {
    return await db.select().from(todo).where(isNull(todo.completed_at)).orderBy(desc(todo.created_at));
}

export async function searchTodosByTitle(title: string) {
    return await db.select().from(todo).where(sql`${todo.title} LIKE ${`%${title}%`}`);
}

// ## Update

export async function updateTodo(id: number, title: string, done: boolean) {
    const already_done = await db.select({
        done: count().as('done')
    }).from(todo).where(and(eq(todo.id, id), isNotNull(todo.completed_at)));

    return await db.update(todo).set({
        title: title,
        completed_at: done ? (already_done[0].done > 0 ? todo.completed_at : sql`CURRENT_TIMESTAMP`) : null,
        updated_at: sql`CURRENT_TIMESTAMP`
    }).where(eq(todo.id, id));
}

export async function updateTodoTitle(id: number, title: string) {
    return await db.update(todo).set({
        title: title,
        updated_at: sql`CURRENT_TIMESTAMP`
    }).where(eq(todo.id, id));
}

export async function markTodoAsDone(id: number) {
    const already_done = await db.select({
        done: count().as('done')
    }).from(todo).where(and(eq(todo.id, id), isNotNull(todo.completed_at)));

    return await db.update(todo).set({
        completed_at: already_done[0].done > 0 ? todo.completed_at : sql`CURRENT_TIMESTAMP`,
        updated_at: sql`CURRENT_TIMESTAMP`
    }).where(eq(todo.id, id));
}

export async function markTodoAsUndone(id: number) {
    return await db.update(todo).set({
        completed_at: null,
        updated_at: sql`CURRENT_TIMESTAMP`
    }).where(eq(todo.id, id));
}

// ## Delete

export async function deleteTodoById(id: number) {
    return await db.delete(todo).where(eq(todo.id, id));
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