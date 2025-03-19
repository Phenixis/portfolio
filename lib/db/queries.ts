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
import * as Schema from "./schema"
import { revalidatePath } from "next/cache"
import { calculateUrgency } from "@/lib/utils"

// # TODO

// ## Create
export async function createTodo(title: string, importance: number, dueDate: Date, duration: number) {
	const urgency = calculateUrgency(dueDate)

	const result = await db
		.insert(Schema.todo)
		.values({
			title: title,
			importance: importance,
			urgency: urgency,
			duration: duration,
			score: importance * urgency - duration,
		} as Schema.NewTodo)
		.returning({ id: Schema.todo.id })

	// Revalidate all pages that might show todos
	revalidatePath("/")

	return result[0].id
}

// ## Read
export async function getTodoById(id: number) {
	const dbresult = await db
		.select()
		.from(Schema.todo)
		.where(and(eq(Schema.todo.id, id), isNull(Schema.todo.deleted_at))) as Schema.Todo[]

	if (!dbresult) {
		throw new Error("Todo not found")
	}

	return dbresult[0];
}

export async function getTodos(orderBy: keyof Schema.Todo = "score", orderingDirection?: "asc" | "desc", limit = 50) {
	return await db.select()
		.from(Schema.todo)
		.where(isNull(Schema.todo.deleted_at))
		.orderBy(
			orderingDirection === "asc" ? asc(Schema.todo[orderBy]) : desc(Schema.todo[orderBy])
		)
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Schema.Todo[];
}

export async function getCompletedTodos(orderBy: keyof Schema.Todo = "completed_at", orderingDirection?: "asc" | "desc", limit = 50) {
	return await db.select()
		.from(Schema.todo)
		.where(and(isNotNull(Schema.todo.completed_at), isNull(Schema.todo.deleted_at)))
		.orderBy(
			orderingDirection === "asc" ? asc(Schema.todo[orderBy]) : desc(Schema.todo[orderBy])
		)
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Schema.Todo[];
}

export async function getUncompletedTodos(orderBy: keyof Schema.Todo = "score", orderingDirection?: "asc" | "desc", limit = 50) {
	return await db.select()
		.from(Schema.todo)
		.where(and(isNull(Schema.todo.completed_at), isNull(Schema.todo.deleted_at)))
		.orderBy(
			orderingDirection === "asc" ? asc(Schema.todo[orderBy]) : desc(Schema.todo[orderBy])
		)
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Schema.Todo[];
}

export async function searchTodosByTitle(title: string, limit = 50) {
	return await db
		.select()
		.from(Schema.todo)
		.where(and(
			sql`${Schema.todo.title} LIKE ${`%${title}%`}`,
			isNull(Schema.todo.deleted_at)
		))
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Schema.Todo[]
}

// ## Update
export async function updateTodo(id: number, title: string, importance: number, dueDate: Date, duration: number) {
	const urgency = calculateUrgency(dueDate)

	const result = await db
		.update(Schema.todo)
		.set({
			title: title,
			importance: importance,
			urgency: urgency,
			duration: duration,
			due: dueDate,
			score: importance * urgency - duration,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.todo.id, id))
		.returning({ id: Schema.todo.id })

	// Revalidate all pages that might show todos
	revalidatePath("/")

	if (!result) {
		return null
	}

	return result[0].id
}

export async function updateTodoUrgency(id: number) {
	const todoData = await getTodoById(id)
	if (!todoData) {
		return null
	}

	const urgency = calculateUrgency(todoData.due)

	const result = await db
		.update(Schema.todo)
		.set({
			urgency: urgency,
			score: todoData.importance * urgency - todoData.duration,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.todo.id, id))
		.returning({ id: Schema.todo.id })

	// Revalidate all pages that might show todos
	revalidatePath("/")

	if (!result) {
		return null
	}

	return result[0].id
}

export async function markTodoAsDone(id: number) {
	const result = await db
		.update(Schema.todo)
		.set({
			completed_at: sql`CURRENT_TIMESTAMP`,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.todo.id, id))
		.returning({ id: Schema.todo.id })

	// Revalidate all pages that might show todos
	revalidatePath("/")

	if (!result) {
		return null
	}

	return result[0].id
}

export async function markTodoAsUndone(id: number) {
	const result = await db
		.update(Schema.todo)
		.set({
			completed_at: null,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.todo.id, id))
		.returning({ id: Schema.todo.id })

	// Revalidate all pages that might show todos
	revalidatePath("/")

	return result[0].id
}

export async function toggleTodo(id: number, currentState: boolean) {
	return currentState ? await markTodoAsUndone(id) : await markTodoAsDone(id);
}

// ## Delete
export async function deleteTodoById(id: number) {
	const result = await db.update(Schema.todo)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP`, updated_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.todo.id, id))
		.returning({ id: Schema.todo.id })

	// Revalidate all pages that might show todos
	revalidatePath("/")

	if (result) {
		return result[0].id
	}

	return null
}

// # Meteo

// ## Create

export async function createMeteo(dayOrMeteo: string | Schema.NewMeteo, temperature?: number, summary?: string, icon?: string) {
	let newMeteo: Schema.NewMeteo;

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
		.insert(Schema.meteo)
		.values(newMeteo)
		.returning({ day: Schema.meteo.day });

	// Revalidate all pages that might show meteo
	revalidatePath("/");

	return result[0].day;
}

// ## Read

export async function getMeteoByDay(day: string) {
	return await db
		.select()
		.from(Schema.meteo)
		.where(eq(Schema.meteo.day, day)) as Schema.Meteo[]
}

export async function getMeteo() {
	return await db
		.select()
		.from(Schema.meteo) as Schema.Meteo[]
};

// ## Update

export async function updateMeteo(dayOrMeteo: string | Schema.NewMeteo, temperature?: number, summary?: string, icon?: string) {
	let updatedMeteo: Partial<Schema.NewMeteo>;

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
		.update(Schema.meteo)
		.set(updatedMeteo)
		.where(eq(Schema.meteo.day, typeof dayOrMeteo === "string" ? dayOrMeteo : dayOrMeteo.day))
		.returning({ day: Schema.meteo.day });

	// Revalidate all pages that might show meteo
	revalidatePath("/");

	if (!result) {
		return null;
	}

	return result[0].day;
}

// ## Delete

export async function deleteMeteoByDay(day: string) {
	const result = await db.update(Schema.meteo)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.meteo.day, day))
		.returning({ day: Schema.meteo.day })

	// Revalidate all pages that might show meteo
	revalidatePath("/")

	if (result) {
		return result[0].day
	}

	return null
}

// # Project

// ## Create

export async function createProject(title: string, description?: string) {
	const result = await db
		.insert(Schema.project)
		.values({
			title: title,
			description: description,
		} as Schema.NewProject)
		.returning({ id: Schema.project.id })

	// Revalidate all pages that might show projects
	revalidatePath("/")

	return result[0].id
}

// ## Read

export async function getProjectById(id: number) {
	const dbresult = await db
		.select()
		.from(Schema.project)
		.where(and(eq(Schema.project.id, id), isNull(Schema.project.deleted_at))) as Schema.Project[]

	if (!dbresult) {
		throw new Error("Project not found")
	}

	return dbresult[0];
}

export async function getProjects() {
	return await db
		.select()
		.from(Schema.project)
		.where(isNull(Schema.project.deleted_at)) as Schema.Project[]
}

export async function getCompletedProjects() {
	return await db
		.select()
		.from(Schema.project)
		.where(and(eq(Schema.project.completed, true), isNull(Schema.project.deleted_at))) as Schema.Project[]
}

export async function getUncompletedProjects() {
	return await db
		.select()
		.from(Schema.project)
		.where(and(eq(Schema.project.completed, false), isNull(Schema.project.deleted_at))) as Schema.Project[]
}

// ## Update

export async function updateProject(id: number, title: string, description?: string) {
	const result = await db
		.update(Schema.project)
		.set({
			title: title,
			description: description,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.project.id, id))
		.returning({ id: Schema.project.id })

	// Revalidate all pages that might show projects
	revalidatePath("/")

	if (!result) {
		return null
	}

	return result[0].id
}

export async function completeProject(id: number) {
	const result = await db
		.update(Schema.project)
		.set({
			completed: true,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.project.id, id))
		.returning({ id: Schema.project.id })

	// Revalidate all pages that might show projects
	revalidatePath("/")

	if (!result) {
		return null
	}

	return result[0].id
}

export async function uncompleteProject(id: number) {
	const result = await db
		.update(Schema.project)
		.set({
			completed: false,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.project.id, id))
		.returning({ id: Schema.project.id })

	// Revalidate all pages that might show projects
	revalidatePath("/")

	if (!result) {
		return null
	}

	return result[0].id
}

// ## Delete

export async function deleteProjectById(id: number) {
	const result = await db.update(Schema.project)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP`, updated_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.project.id, id))
		.returning({ id: Schema.project.id })

	// Revalidate all pages that might show projects
	revalidatePath("/")

	if (result) {
		return result[0].id
	}

	return null
}