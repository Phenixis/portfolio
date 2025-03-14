"use server"

import {
  desc,
  asc,
  eq,
  isNull,
  isNotNull,
  sql,
  and
} from "drizzle-orm"
import { db } from "./drizzle"
import {
  todo,
  type Todo,
  type NewTodo,
  meteo,
  type Meteo,
  type NewMeteo
} from "./schema"
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
    } as NewTodo)
    .returning({ id: todo.id })

  // Revalidate all pages that might show todos
  revalidatePath("/")

  return result[0].id
}

// ## Read
export async function getTodoById(id: number) {
  return await db
    .select()
    .from(todo)
    .where(and(eq(todo.id, id), isNull(todo.deleted_at))) as Todo[]
}

export async function getTodos(orderBy: keyof Todo = "score", orderingDirection?: "asc" | "desc", limit = 50) {
  return await db.select()
    .from(todo)
    .where(isNull(todo.deleted_at))
    .orderBy(
      orderingDirection === "asc" ? asc(todo[orderBy]) : desc(todo[orderBy])
    )
    .limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Todo[];
}

export async function getCompletedTodos(orderBy: keyof Todo = "completed_at", orderingDirection?: "asc" | "desc", limit = 50) {
  return await db.select()
    .from(todo)
    .where(and(isNotNull(todo.completed_at), isNull(todo.deleted_at)))
    .orderBy(
      orderingDirection === "asc" ? asc(todo[orderBy]) : desc(todo[orderBy])
    )
    .limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Todo[];
}

export async function getUncompletedTodos(orderBy: keyof Todo = "score", orderingDirection?: "asc" | "desc", limit = 50) {
  return await db.select()
    .from(todo)
    .where(and(isNull(todo.completed_at), isNull(todo.deleted_at)))
    .orderBy(
      orderingDirection === "asc" ? asc(todo[orderBy]) : desc(todo[orderBy])
    )
    .limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Todo[];
}

export async function searchTodosByTitle(title: string, limit = 50) {
  if (limit === -1) {
    return await db
      .select()
      .from(todo)
      .where(and(
        sql`${todo.title} LIKE ${`%${title}%`}`,
        isNull(todo.deleted_at)
      )) as Todo[]
  }
  return await db
    .select()
    .from(todo)
    .where(and(
      sql`${todo.title} LIKE ${`%${title}%`}`,
      isNull(todo.deleted_at)
    ))
    .limit(limit) as Todo[]
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

  if (!result) {
    return null
  }

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

  if (!result) {
    return null
  }

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
  return currentState ? await markTodoAsUndone(id) : await markTodoAsDone(id);
}

// ## Delete
export async function deleteTodoById(id: number) {
  const result = await db.update(todo)
    .set({ deleted_at: sql`CURRENT_TIMESTAMP`, updated_at: sql`CURRENT_TIMESTAMP` })
    .where(eq(todo.id, id))
    .returning({ id: todo.id })

  // Revalidate all pages that might show todos
  revalidatePath("/")

  if (result) {
    return result[0].id
  }

  return null
}

// # Meteo

// ## Create

export async function createMeteo(dayOrMeteo: string | NewMeteo, temperature?: number, summary?: string, icon?: string) {
  let newMeteo: NewMeteo;

  if (typeof dayOrMeteo === "string") {
    newMeteo = {
      day: dayOrMeteo,
      temperature: temperature!,
      summary: summary!,
      icon: icon!,
    };
  } else {
    newMeteo = dayOrMeteo;
  }

  const result = await db
    .insert(meteo)
    .values(newMeteo)
    .returning({ day: meteo.day });

  // Revalidate all pages that might show meteo
  revalidatePath("/");

  return result[0].day;
}

// ## Read

export async function getMeteoByDay(day: string) {
  return await db
    .select()
    .from(meteo)
    .where(eq(meteo.day, day)) as Meteo[]
}

export async function getMeteo() {
  return await db
    .select()
    .from(meteo) as Meteo[]
};

// ## Update

export async function updateMeteo(dayOrMeteo: string | NewMeteo, temperature?: number, summary?: string, icon?: string) {
  let updatedMeteo: Partial<NewMeteo>;

  if (typeof dayOrMeteo === "string") {
    updatedMeteo = {
      day: dayOrMeteo,
      temperature: temperature!,
      summary: summary!,
      icon: icon!,
      updated_at: new Date(),
    };
  } else {
    updatedMeteo = {
      ...dayOrMeteo,
      updated_at: new Date(),
    };
  }

  const result = await db
    .update(meteo)
    .set(updatedMeteo)
    .where(eq(meteo.day, typeof dayOrMeteo === "string" ? dayOrMeteo : dayOrMeteo.day))
    .returning({ day: meteo.day });

  // Revalidate all pages that might show meteo
  revalidatePath("/");

  if (!result) {
    return null;
  }

  return result[0].day;
}

// ## Delete

export async function deleteMeteoByDay(day: string) {
  const result = await db.update(meteo)
    .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
    .where(eq(meteo.day, day))
    .returning({ day: meteo.day })

  // Revalidate all pages that might show meteo
  revalidatePath("/")

  if (result) {
    return result[0].day
  }

  return null
}