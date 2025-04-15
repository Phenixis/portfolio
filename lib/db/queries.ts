"use server"

import {
	desc,
	asc,
	eq,
	isNull,
	isNotNull,
	sql,
	and,
	or,
	lte,
	inArray
} from "drizzle-orm"
import { db } from "./drizzle"
import * as Schema from "./schema"
import { revalidatePath } from "next/cache"
import { calculateUrgency } from "@/lib/utils"

// # TODO

// ## Create
export async function createTodo(title: string, importance: number, dueDate: Date, duration: number, project?: string) {
	const urgency = calculateUrgency(dueDate)

	const result = await db
		.insert(Schema.todo)
		.values({
			title: title,
			importance: importance,
			urgency: urgency,
			duration: duration,
			score: importance * urgency - duration,
			due: dueDate,
			project_title: project,
		} as Schema.NewTodo)
		.returning({ id: Schema.todo.id })

	// Revalidate all pages that might show todos
	revalidatePath("/", 'layout')

	return result[0].id
}

// ## Read
export async function getTodoById(id: number) {
	const dbresult = await db
		.select({
			id: Schema.todo.id,
			title: Schema.todo.title,
			importance: Schema.todo.importance,
			duration: Schema.todo.duration,
			urgency: Schema.todo.urgency,
			score: Schema.todo.score,
			due: Schema.todo.due,
			project_title: Schema.todo.project_title,
			completed_at: Schema.todo.completed_at,
			created_at: Schema.todo.created_at,
			updated_at: Schema.todo.updated_at,
			deleted_at: Schema.todo.deleted_at,
			project: {
				title: Schema.project.title,
				description: Schema.project.description,
				completed: Schema.project.completed,
				created_at: Schema.project.created_at,
				updated_at: Schema.project.updated_at,
				deleted_at: Schema.project.deleted_at,
			},
			importanceDetails: {
				level: Schema.importance.level,
				name: Schema.importance.name,
			},
			durationDetails: {
				level: Schema.duration.level,
				name: Schema.duration.name,
			},
		})
		.from(Schema.todo)
		.where(eq(Schema.todo.id, id))
		.leftJoin(Schema.project, eq(Schema.todo.project_title, Schema.project.title))
		.leftJoin(Schema.importance, eq(Schema.todo.importance, Schema.importance.level))
		.leftJoin(Schema.duration, eq(Schema.todo.duration, Schema.duration.level)) as (Schema.Todo & { project: Schema.Project | null; importanceDetails: Schema.Importance; durationDetails: Schema.Duration })[]

	if (!dbresult) {
		throw new Error("Todo not found")
	}

	return dbresult[0];
}

export async function getTodos(orderBy: keyof Schema.Todo = "score", orderingDirection?: "asc" | "desc", limit = 50, projectTitles?: string[]) {
	return await db.select({
		id: Schema.todo.id,
		title: Schema.todo.title,
		importance: Schema.todo.importance,
		urgency: Schema.todo.urgency,
		duration: Schema.todo.duration,
		due: Schema.todo.due,
		score: Schema.todo.score,
		completed_at: Schema.todo.completed_at,
		created_at: Schema.todo.created_at,
		updated_at: Schema.todo.updated_at,
		deleted_at: Schema.todo.deleted_at,
		project_title: Schema.todo.project_title,
		project: {
			title: Schema.project.title,
			description: Schema.project.description,
			completed: Schema.project.completed,
			created_at: Schema.project.created_at,
			updated_at: Schema.project.updated_at,
			deleted_at: Schema.project.deleted_at,
		},
		importanceDetails: {
			level: Schema.importance.level,
			name: Schema.importance.name,
		},
		durationDetails: {
			level: Schema.duration.level,
			name: Schema.duration.name,
		},
	})
		.from(Schema.todo)
		.leftJoin(Schema.project, eq(Schema.todo.project_title, Schema.project.title))
		.leftJoin(Schema.importance, eq(Schema.todo.importance, Schema.importance.level))
		.leftJoin(Schema.duration, eq(Schema.todo.duration, Schema.duration.level))
		.where(and(
			isNull(Schema.todo.deleted_at),
			projectTitles ? or(
				inArray(Schema.todo.project_title, projectTitles),
				sql`${isNull(Schema.todo.project_title)} AND ${projectTitles.includes("No project")}`
			) : sql`1 = 1`
		))
		.orderBy(
			orderingDirection === "asc" ? asc(Schema.todo[orderBy]) : desc(Schema.todo[orderBy])
		)
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as (Schema.Todo & { project: Schema.Project | null; importanceDetails: Schema.Importance; durationDetails: Schema.Duration })[];
}

export async function getCompletedTodos(orderBy: keyof Schema.Todo = "completed_at", orderingDirection?: "asc" | "desc", limit = 50, projectTitles?: string[]) {
	return await db.select({
		id: Schema.todo.id,
		title: Schema.todo.title,
		importance: Schema.todo.importance,
		urgency: Schema.todo.urgency,
		duration: Schema.todo.duration,
		due: Schema.todo.due,
		score: Schema.todo.score,
		completed_at: Schema.todo.completed_at,
		created_at: Schema.todo.created_at,
		updated_at: Schema.todo.updated_at,
		deleted_at: Schema.todo.deleted_at,
		project_title: Schema.todo.project_title,
		project: {
			title: Schema.project.title,
			description: Schema.project.description,
			completed: Schema.project.completed,
			created_at: Schema.project.created_at,
			updated_at: Schema.project.updated_at,
			deleted_at: Schema.project.deleted_at,
		},
		importanceDetails: {
			level: Schema.importance.level,
			name: Schema.importance.name,
		},
		durationDetails: {
			level: Schema.duration.level,
			name: Schema.duration.name,
		},
	})
		.from(Schema.todo)
		.leftJoin(Schema.project, eq(Schema.todo.project_title, Schema.project.title))
		.leftJoin(Schema.importance, eq(Schema.todo.importance, Schema.importance.level))
		.leftJoin(Schema.duration, eq(Schema.todo.duration, Schema.duration.level))
		.where(and(
			isNotNull(Schema.todo.completed_at),
			isNull(Schema.todo.deleted_at),
			projectTitles ? or(
				inArray(Schema.todo.project_title, projectTitles),
				sql`${isNull(Schema.todo.project_title)} AND ${projectTitles.includes("No project")}`
			) : sql`1 = 1`
		))
		.orderBy(
			orderingDirection === "asc" ? asc(Schema.todo[orderBy]) : desc(Schema.todo[orderBy])
		)
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as (Schema.Todo & { project: Schema.Project | null; importanceDetails: Schema.Importance; durationDetails: Schema.Duration })[];
}

export async function getUncompletedTodos(orderBy: keyof Schema.Todo = "score", orderingDirection?: "asc" | "desc", limit = 50, projectTitles?: string[]) {
	return await db.select({
		id: Schema.todo.id,
		title: Schema.todo.title,
		importance: Schema.todo.importance,
		urgency: Schema.todo.urgency,
		duration: Schema.todo.duration,
		due: Schema.todo.due,
		score: Schema.todo.score,
		completed_at: Schema.todo.completed_at,
		created_at: Schema.todo.created_at,
		updated_at: Schema.todo.updated_at,
		deleted_at: Schema.todo.deleted_at,
		project_title: Schema.todo.project_title,
		project: {
			title: Schema.project.title,
			description: Schema.project.description,
			completed: Schema.project.completed,
			created_at: Schema.project.created_at,
			updated_at: Schema.project.updated_at,
			deleted_at: Schema.project.deleted_at,
		},
		importanceDetails: {
			level: Schema.importance.level,
			name: Schema.importance.name,
		},
		durationDetails: {
			level: Schema.duration.level,
			name: Schema.duration.name,
		},
	})
		.from(Schema.todo)
		.leftJoin(Schema.project, eq(Schema.todo.project_title, Schema.project.title))
		.leftJoin(Schema.importance, eq(Schema.todo.importance, Schema.importance.level))
		.leftJoin(Schema.duration, eq(Schema.todo.duration, Schema.duration.level))
		.where(and(
			isNull(Schema.todo.completed_at),
			isNull(Schema.todo.deleted_at),
			projectTitles ? or(
				inArray(Schema.todo.project_title, projectTitles),
				sql`${isNull(Schema.todo.project_title)} AND ${projectTitles.includes("No project")}`
			) : sql`1 = 1`
		))
		.orderBy(
			orderingDirection === "asc" ? asc(Schema.todo[orderBy]) : desc(Schema.todo[orderBy])
		)
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as (Schema.Todo & { project: Schema.Project | null; importanceDetails: Schema.Importance; durationDetails: Schema.Duration })[];
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

export async function getUncompletedAndDueInTheNextThreeDaysOrLessTodos(withProject: boolean = false, orderBy: keyof Schema.Todo = "score", orderingDirection?: "asc" | "desc", limit = 50) {
	const today = new Date()
	const threeDaysFromNow = new Date(today)
	threeDaysFromNow.setDate(today.getDate() + 3)

	if (withProject) {
		return await db.select({
			id: Schema.todo.id,
			title: Schema.todo.title,
			importance: Schema.todo.importance,
			urgency: Schema.todo.urgency,
			duration: Schema.todo.duration,
			due: Schema.todo.due,
			score: Schema.todo.score,
			completed_at: Schema.todo.completed_at,
			created_at: Schema.todo.created_at,
			updated_at: Schema.todo.updated_at,
			deleted_at: Schema.todo.deleted_at,
			project_title: Schema.todo.project_title,
			project: {
				title: Schema.project.title,
				description: Schema.project.description,
				completed: Schema.project.completed,
				created_at: Schema.project.created_at,
				updated_at: Schema.project.updated_at,
				deleted_at: Schema.project.deleted_at,
			},
			importanceDetails: {
				level: Schema.importance.level,
				name: Schema.importance.name,
			},
			durationDetails: {
				level: Schema.duration.level,
				name: Schema.duration.name,
			},
		})
			.from(Schema.todo)
			.leftJoin(Schema.project, eq(Schema.todo.project_title, Schema.project.title))
			.leftJoin(Schema.importance, eq(Schema.todo.importance, Schema.importance.level))
			.leftJoin(Schema.duration, eq(Schema.todo.duration, Schema.duration.level))
			.where(and(
				isNull(Schema.todo.completed_at),
				isNull(Schema.todo.deleted_at),
				lte(Schema.todo.due, threeDaysFromNow),
			))
			.orderBy(
				orderingDirection === "asc" ? asc(Schema.todo[orderBy]) : desc(Schema.todo[orderBy])
			)
			.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as (Schema.Todo & { project: Schema.Project | null; importanceDetails: Schema.Importance; durationDetails: Schema.Duration })[];
	} else {
		return await db.select()
			.from(Schema.todo)
			.where(and(
				isNull(Schema.todo.completed_at),
				isNull(Schema.todo.deleted_at),
				lte(Schema.todo.due, threeDaysFromNow),
			))
			.orderBy(
				orderingDirection === "asc" ? asc(Schema.todo[orderBy]) : desc(Schema.todo[orderBy])
			)
			.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Schema.Todo[];
	}
}

// ## Update
export async function updateTodo(id: number, title: string, importance: number, dueDate: Date, duration: number, projectTitle: string) {
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
			project_title: projectTitle,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.todo.id, id))
		.returning({ id: Schema.todo.id })

	// Revalidate all pages that might show todos
	revalidatePath("/", 'layout')

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
	revalidatePath("/", 'layout')

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
	revalidatePath("/", 'layout')

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
	revalidatePath("/", 'layout')

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
	revalidatePath("/", 'layout')

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
	revalidatePath("/", 'layout');

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
	revalidatePath("/", 'layout');

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
	revalidatePath("/", 'layout')

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
		.returning({ id: Schema.project.title })

	// Revalidate all pages that might show projects
	revalidatePath("/", 'layout')

	return result[0].id
}

// ## Read

export async function searchProjects(title: string, limit = 50) {
	return await db
		.select()
		.from(Schema.project)
		.where(and(
			sql`${Schema.project.title} LIKE ${`%${title}%`}`,
			isNull(Schema.project.deleted_at)
		))
		.orderBy(asc(Schema.project.title))
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Schema.Project[]
}

export async function getProject(title: string) {
	const dbresult = await db
		.select()
		.from(Schema.project)
		.where(and(eq(Schema.project.title, title), isNull(Schema.project.deleted_at))) as Schema.Project[]

	if (!dbresult) {
		throw new Error("Project not found")
	}

	return dbresult[0];
}

export async function getProjects(limit = 50) {
	const dbresult = await db
		.select()
		.from(Schema.project)
		.where(isNull(Schema.project.deleted_at))
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Schema.Project[]

	dbresult.push(
		{
			title: "No project",
			description: null,
			completed: false,
			created_at: new Date(0),
			updated_at: new Date(0),
			deleted_at: null,
		}
	)

	return dbresult;
}

export async function getCompletedProjects(limit = 50) {
	const dbresult = await db
		.select()
		.from(Schema.project)
		.where(and(eq(Schema.project.completed, true), isNull(Schema.project.deleted_at)))
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Schema.Project[]

	dbresult.push(
		{
			title: "No project",
			description: null,
			completed: true,
			created_at: new Date(0),
			updated_at: new Date(0),
			deleted_at: null,
		}
	)

	return dbresult;
}

export async function getUncompletedProjects(limit = 50) {
	const dbresult = await db
		.select()
		.from(Schema.project)
		.where(and(eq(Schema.project.completed, false), isNull(Schema.project.deleted_at)))
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Schema.Project[]

	dbresult.push(
		{
			title: "No project",
			description: null,
			completed: false,
			created_at: new Date(0),
			updated_at: new Date(0),
			deleted_at: null,
		}
	)

	return dbresult;
}

// ## Update

export async function updateProject(title: string, new_title?: string, description?: string) {
	const result = await db
		.update(Schema.project)
		.set({
			title: new_title ? new_title : title,
			description: description,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.project.title, title))
		.returning({ title: Schema.project.title })

	// Revalidate all pages that might show projects
	revalidatePath("/", 'layout')

	if (!result) {
		return null
	}

	return result[0].title
}

export async function completeProject(title: string) {
	const result = await db
		.update(Schema.project)
		.set({
			completed: true,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.project.title, title))
		.returning({ title: Schema.project.title })

	// Revalidate all pages that might show projects
	revalidatePath("/", 'layout')

	if (!result) {
		return null
	}

	return result[0].title
}

export async function uncompleteProject(title: string) {
	const result = await db
		.update(Schema.project)
		.set({
			completed: false,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.project.title, title))
		.returning({ title: Schema.project.title })

	// Revalidate all pages that might show projects
	revalidatePath("/", 'layout')

	if (!result) {
		return null
	}

	return result[0].title
}

// ## Delete

export async function deleteProject(title: string) {
	const result = await db.update(Schema.project)
		.set({
			deleted_at: sql`CURRENT_TIMESTAMP`,
			updated_at: sql`CURRENT_TIMESTAMP`
		})
		.where(eq(Schema.project.title, title))
		.returning({ title: Schema.project.title })

	// Revalidate all pages that might show projects
	revalidatePath("/", 'layout')

	if (result) {
		return result[0].title
	}

	return null
}