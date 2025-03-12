"use server"

import { desc, eq, isNull, isNotNull, sql, and } from "drizzle-orm"
import { db } from "./drizzle"
import { todo, type Todo } from "./schema"
import { revalidatePath } from "next/cache"

// ## Create
export async function createTodo(title: string, importance: number, urgency: number, duration: number) {
  const result = await db
    .insert(todo)
    .values({
      title: title,
      importance: importance,
      urgency: urgency,
      duration: duration,
      score: importance * urgency - duration,
    })
    .returning({ id: todo.id })

  // Revalidate all pages that might show todos
  revalidatePath("/")

  return result[0].id
}

// ## Read
export async function getTodos(orderBy: keyof Todo = "score", limit = 50) {
  if (limit === -1) {
    return await db.select().from(todo).where(isNull(todo.deleted_at)).orderBy(desc(todo[orderBy]))
  }
  return await db.select().from(todo).where(isNull(todo.deleted_at)).orderBy(desc(todo[orderBy])).limit(limit)
}

export async function getTodoById(id: number) {
  return await db.select().from(todo).where(and(eq(todo.id, id), isNull(todo.deleted_at)))
}

export async function getCompletedTodos(orderBy: keyof Todo = "completed_at", limit = 50) {
  if (limit === -1) {
    return await db.select().from(todo).where(and(isNotNull(todo.completed_at), isNull(todo.deleted_at))).orderBy(desc(todo[orderBy]))
  }
  return await db.select().from(todo).where(and(isNotNull(todo.completed_at), isNull(todo.deleted_at))).orderBy(desc(todo[orderBy])).limit(limit)
}

export async function getUncompletedTodos(orderBy: keyof Todo = "score", limit = 50) {
  if (limit === -1) {
    return await db.select().from(todo).where(and(isNull(todo.completed_at), isNull(todo.deleted_at))).orderBy(desc(todo[orderBy]))
  }
  return await db.select().from(todo).where(and(isNull(todo.completed_at), isNull(todo.deleted_at))).orderBy(desc(todo[orderBy])).limit(limit)
}

export async function searchTodosByTitle(title: string, limit = 50) {
  if (limit === -1) {
    return await db
      .select()
      .from(todo)
      .where(and(
        sql`${todo.title} LIKE ${`%${title}%`}`,
        isNull(todo.deleted_at)
      ))
  }
  return await db
    .select()
    .from(todo)
    .where(and(
      sql`${todo.title} LIKE ${`%${title}%`}`,
      isNull(todo.deleted_at)
    ))
    .limit(limit)
}

// ## Update
export async function updateTodo(id: number, title: string, importance: number, urgency: number, duration: number) {
  const result = await db
    .update(todo)
    .set({
      title: title,
      importance: importance,
      urgency: urgency,
      duration: duration,
      score: importance * urgency - duration,
      updated_at: sql`CURRENT_TIMESTAMP`,
    })
    .where(eq(todo.id, id))
    .returning({ id: todo.id })

  // Revalidate all pages that might show todos
  revalidatePath("/")

  return result[0].id
}

export async function markTodoAsDone(id: number) {
  const result = await db
    .update(todo)
    .set({
      completed_at: sql`CURRENT_TIMESTAMP`,
      updated_at: sql`CURRENT_TIMESTAMP`,
    })
    .where(eq(todo.id, id))
    .returning({ id: todo.id })

  // Revalidate all pages that might show todos
  revalidatePath("/")

  return result[0].id
}

export async function markTodoAsUndone(id: number) {
  const result = await db
    .update(todo)
    .set({
      completed_at: null,
      updated_at: sql`CURRENT_TIMESTAMP`,
    })
    .where(eq(todo.id, id))
    .returning({ id: todo.id })

  // Revalidate all pages that might show todos
  revalidatePath("/")

  return result[0].id
}

export async function toggleTodo(id: number, currentState: boolean) {
  const result = currentState ? await markTodoAsUndone(id) : await markTodoAsDone(id)

  // No need to revalidate here as markTodoAsDone/markTodoAsUndone already do it

  return result
}

// ## Delete
export async function deleteTodoById(id: number) {
  const result = await db.update(todo).set({ deleted_at: sql`CURRENT_TIMESTAMP`, updated_at: sql`CURRENT_TIMESTAMP` }).where(eq(todo.id, id)).returning({ id: todo.id })

  // Revalidate all pages that might show todos
  revalidatePath("/")

  if (result) { 
    return result[0].id
  }

  return null
}