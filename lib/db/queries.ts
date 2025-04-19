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

export async function getTodos(orderBy: keyof Schema.Todo = "score", orderingDirection?: "asc" | "desc", limit = 50, projectTitles?: string[], dueBefore?: Date) {
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
			) : sql`1 = 1`,
			dueBefore ? lte(Schema.todo.due, dueBefore) : sql`1 = 1`
		))
		.orderBy(
			orderingDirection === "asc" ? asc(Schema.todo[orderBy]) : desc(Schema.todo[orderBy])
		)
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as (Schema.Todo & { project: Schema.Project | null; importanceDetails: Schema.Importance; durationDetails: Schema.Duration })[];
}

export async function getCompletedTodos(orderBy: keyof Schema.Todo = "completed_at", orderingDirection?: "asc" | "desc", limit = 50, projectTitles?: string[], dueBefore?: Date) {
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
			) : sql`1 = 1`,
			dueBefore ? lte(Schema.todo.due, dueBefore) : sql`1 = 1`
		))
		.orderBy(
			orderingDirection === "asc" ? asc(Schema.todo[orderBy]) : desc(Schema.todo[orderBy])
		)
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as (Schema.Todo & { project: Schema.Project | null; importanceDetails: Schema.Importance; durationDetails: Schema.Duration })[];
}

export async function getUncompletedTodos(orderBy: keyof Schema.Todo = "score", orderingDirection?: "asc" | "desc", limit = 50, projectTitles?: string[], dueBefore?: Date) {
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
			) : sql`1 = 1`,
			dueBefore ? lte(Schema.todo.due, dueBefore) : sql`1 = 1`
		))
		.orderBy(
			orderingDirection === "asc" ? asc(Schema.todo[orderBy]) : desc(Schema.todo[orderBy]),
			asc(Schema.todo.title)
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

export async function createMeteo(dayOrMeteo: string | Schema.NewMeteo, temperature?: number, summary?: string, icon?: string, latitude?: string, longitude?: string) {
	let newMeteo: Schema.NewMeteo;

	if (typeof dayOrMeteo === "string") {
		newMeteo = {
			day: dayOrMeteo,
			latitude: latitude!,
			longitude: longitude!,
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

export async function updateMeteo(dayOrMeteo: string | Schema.NewMeteo, temperature?: number, summary?: string, icon?: string, latitude?: string, longitude?: string) {
	let updatedMeteo: Partial<Schema.NewMeteo>;

	if (typeof dayOrMeteo === "string") {
		updatedMeteo = {
			day: dayOrMeteo,
			latitude: latitude!,
			longitude: longitude!,
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

//=============================================================================
// # Exercice
//=============================================================================

// ## Create

export async function createExercice(nameOrExercice: string | Schema.NewExercice, name?: string) {
	let newExercice: Schema.NewExercice

	if (typeof nameOrExercice === "string") {
		newExercice = {
			name: nameOrExercice,
		}
	} else {
		newExercice = nameOrExercice
	}

	const result = await db.insert(Schema.exercice).values(newExercice).returning({ id: Schema.exercice.id })

	// Revalidate all pages that might show exercices
	revalidatePath("/", "layout")

	return result[0].id
}

// ## Read

export async function getExerciceById(id: number) {
	return (await db.select().from(Schema.exercice).where(eq(Schema.exercice.id, id))) as Schema.Exercice[]
}

export async function getExercices() {
	return (await db.select().from(Schema.exercice).where(isNull(Schema.exercice.deleted_at))) as Schema.Exercice[]
}

// ## Update

export async function updateExercice(idOrExercice: number | Schema.NewExercice, name?: string) {
	let updatedExercice: Partial<Schema.NewExercice>

	if (typeof idOrExercice === "number") {
		updatedExercice = {
			name: name!,
			updated_at: new Date(),
		}
	} else {
		updatedExercice = {
			...idOrExercice,
			updated_at: new Date(),
		}
	}

	const result = await db
		.update(Schema.exercice)
		.set(updatedExercice)
		.where(eq(Schema.exercice.id, typeof idOrExercice === "number" ? idOrExercice : idOrExercice.id!))
		.returning({ id: Schema.exercice.id })

	// Revalidate all pages that might show exercices
	revalidatePath("/", "layout")

	if (!result) {
		return null
	}

	return result[0].id
}

// ## Delete

export async function deleteExerciceById(id: number) {
	const result = await db
		.update(Schema.exercice)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.exercice.id, id))
		.returning({ id: Schema.exercice.id })

	// Revalidate all pages that might show exercices
	revalidatePath("/", "layout")

	if (result) {
		return result[0].id
	}

	return null
}

//=============================================================================
// # Seance
//=============================================================================

// ## Create

export async function createSeance(nameOrSeance: string | Schema.NewSeance, name?: string) {
	let newSeance: Schema.NewSeance

	if (typeof nameOrSeance === "string") {
		newSeance = {
			name: nameOrSeance,
		}
	} else {
		newSeance = nameOrSeance
	}

	const result = await db.insert(Schema.seance).values(newSeance).returning({ id: Schema.seance.id })

	// Revalidate all pages that might show seances
	revalidatePath("/", "layout")

	return result[0].id
}

// ## Read

export async function getSeanceById(id: number) {
	return (await db.select().from(Schema.seance).where(eq(Schema.seance.id, id))) as Schema.Seance[]
}

export async function getSeances() {
	return (await db.select().from(Schema.seance).where(isNull(Schema.seance.deleted_at))) as Schema.Seance[]
}

// ## Update

export async function updateSeance(idOrSeance: number | Schema.NewSeance, name?: string) {
	let updatedSeance: Partial<Schema.NewSeance>

	if (typeof idOrSeance === "number") {
		updatedSeance = {
			name: name!,
			updated_at: new Date(),
		}
	} else {
		updatedSeance = {
			...idOrSeance,
			updated_at: new Date(),
		}
	}

	const result = await db
		.update(Schema.seance)
		.set(updatedSeance)
		.where(eq(Schema.seance.id, typeof idOrSeance === "number" ? idOrSeance : idOrSeance.id!))
		.returning({ id: Schema.seance.id })

	// Revalidate all pages that might show seances
	revalidatePath("/", "layout")

	if (!result) {
		return null
	}

	return result[0].id
}

// ## Delete

export async function deleteSeanceById(id: number) {
	const result = await db
		.update(Schema.seance)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.seance.id, id))
		.returning({ id: Schema.seance.id })

	// Revalidate all pages that might show seances
	revalidatePath("/", "layout")

	if (result) {
		return result[0].id
	}

	return null
}

//=============================================================================
// # SeanceExercice
//=============================================================================

// ## Create

export async function createSeanceExercice(
	seanceIdOrSeanceExercice: number | Schema.NewSeanceExercice,
	exercice_id?: number,
	position?: number,
	nb_series?: number,
) {
	let newSeanceExercice: Schema.NewSeanceExercice

	if (typeof seanceIdOrSeanceExercice === "number") {
		newSeanceExercice = {
			seance_id: seanceIdOrSeanceExercice,
			exercice_id: exercice_id!,
			position: position!,
			nb_series: nb_series!,
		}
	} else {
		newSeanceExercice = seanceIdOrSeanceExercice
	}

	const result = await db
		.insert(Schema.seanceExercice)
		.values(newSeanceExercice)
		.returning({ id: Schema.seanceExercice.id })

	// Revalidate all pages that might show seance exercices
	revalidatePath("/", "layout")

	return result[0].id
}

// ## Read

export async function getSeanceExerciceById(id: number) {
	return (await db
		.select()
		.from(Schema.seanceExercice)
		.where(eq(Schema.seanceExercice.id, id))) as Schema.SeanceExercice[]
}

export async function getSeanceExercicesBySeanceId(seance_id: number) {
	return (await db
		.select()
		.from(Schema.seanceExercice)
		.where(and(eq(Schema.seanceExercice.seance_id, seance_id), isNull(Schema.seanceExercice.deleted_at)))
		.orderBy(asc(Schema.seanceExercice.position))) as Schema.SeanceExercice[]
}

export async function getSeanceExercices() {
	return (await db
		.select()
		.from(Schema.seanceExercice)
		.where(isNull(Schema.seanceExercice.deleted_at))) as Schema.SeanceExercice[]
}

// ## Update

export async function updateSeanceExercice(
	idOrSeanceExercice: number | Schema.NewSeanceExercice,
	seance_id?: number,
	exercice_id?: number,
	position?: number,
	nb_series?: number,
) {
	let updatedSeanceExercice: Partial<Schema.NewSeanceExercice>

	if (typeof idOrSeanceExercice === "number") {
		updatedSeanceExercice = {
			seance_id: seance_id,
			exercice_id: exercice_id,
			position: position,
			nb_series: nb_series,
			updated_at: new Date(),
		}
	} else {
		updatedSeanceExercice = {
			...idOrSeanceExercice,
			updated_at: new Date(),
		}
	}

	const result = await db
		.update(Schema.seanceExercice)
		.set(updatedSeanceExercice)
		.where(
			eq(
				Schema.seanceExercice.id,
				typeof idOrSeanceExercice === "number" ? idOrSeanceExercice : idOrSeanceExercice.id!,
			),
		)
		.returning({ id: Schema.seanceExercice.id })

	// Revalidate all pages that might show seance exercices
	revalidatePath("/", "layout")

	if (!result) {
		return null
	}

	return result[0].id
}

// ## Delete

export async function deleteSeanceExerciceById(id: number) {
	const result = await db
		.update(Schema.seanceExercice)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.seanceExercice.id, id))
		.returning({ id: Schema.seanceExercice.id })

	// Revalidate all pages that might show seance exercices
	revalidatePath("/", "layout")

	if (result) {
		return result[0].id
	}

	return null
}

//=============================================================================
// # Workout
//=============================================================================

// ## Create

export async function createWorkout(
	dateOrWorkout: Date | Schema.NewWorkout,
	note?: number,
	comment?: string,
	seance_id?: number,
) {
	let newWorkout: Schema.NewWorkout

	if (dateOrWorkout instanceof Date) {
		newWorkout = {
			date: dateOrWorkout,
			note: note,
			comment: comment,
			seance_id: seance_id,
		}
	} else {
		newWorkout = dateOrWorkout
	}

	const result = await db.insert(Schema.workout).values(newWorkout).returning({ id: Schema.workout.id })

	// Revalidate all pages that might show workouts
	revalidatePath("/", "layout")

	return result[0].id
}

// ## Read

export async function getWorkoutById(id: number) {
	return (await db.select().from(Schema.workout).where(eq(Schema.workout.id, id))) as Schema.Workout[]
}

export async function getAllWorkouts() {
	return (await db
		.select()
		.from(Schema.workout)
		.where(isNull(Schema.workout.deleted_at))
		.orderBy(desc(Schema.workout.date))) as Schema.Workout[]
}

export async function getRecentWorkouts(limit = 5) {
	return (await db
		.select()
		.from(Schema.workout)
		.where(isNull(Schema.workout.deleted_at))
		.orderBy(desc(Schema.workout.date))
		.limit(limit)) as Schema.Workout[]
}

export async function getWorkoutsBySeanceId(seance_id: number) {
	return (await db
		.select()
		.from(Schema.workout)
		.where(and(eq(Schema.workout.seance_id, seance_id), isNull(Schema.workout.deleted_at)))
		.orderBy(desc(Schema.workout.date))) as Schema.Workout[]
}

// ## Update

export async function updateWorkout(
	idOrWorkout: number | Schema.NewWorkout,
	date?: Date,
	note?: number,
	comment?: string,
	seance_id?: number,
) {
	let updatedWorkout: Partial<Schema.NewWorkout>

	if (typeof idOrWorkout === "number") {
		updatedWorkout = {
			date: date,
			note: note,
			comment: comment,
			seance_id: seance_id,
			updated_at: new Date(),
		}
	} else {
		updatedWorkout = {
			...idOrWorkout,
			updated_at: new Date(),
		}
	}

	const result = await db
		.update(Schema.workout)
		.set(updatedWorkout)
		.where(eq(Schema.workout.id, typeof idOrWorkout === "number" ? idOrWorkout : idOrWorkout.id!))
		.returning({ id: Schema.workout.id })

	// Revalidate all pages that might show workouts
	revalidatePath("/", "layout")

	if (!result) {
		return null
	}

	return result[0].id
}

// ## Delete

export async function deleteWorkoutById(id: number) {
	const result = await db
		.update(Schema.workout)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.workout.id, id))
		.returning({ id: Schema.workout.id })

	// Revalidate all pages that might show workouts
	revalidatePath("/", "layout")

	if (result) {
		return result[0].id
	}

	return null
}

//=============================================================================
// # Serie
//=============================================================================

// ## Create

export async function createSerie(
	workoutIdOrSerie: number | Schema.NewSerie,
	exercice_id?: number,
	poids?: number,
	reps?: number,
	exercice_position?: number,
	serie_position?: number,
) {
	let newSerie: Schema.NewSerie

	if (typeof workoutIdOrSerie === "number") {
		newSerie = {
			workout_id: workoutIdOrSerie,
			exercice_id: exercice_id!,
			poids: poids,
			reps: reps,
			exercice_position: exercice_position!,
			serie_position: serie_position!,
		}
	} else {
		newSerie = workoutIdOrSerie
	}

	const result = await db.insert(Schema.serie).values(newSerie).returning({ id: Schema.serie.id })

	// Revalidate all pages that might show series
	revalidatePath("/", "layout")

	return result[0].id
}

// ## Read

export async function getSerieById(id: number) {
	return (await db.select().from(Schema.serie).where(eq(Schema.serie.id, id))) as Schema.Serie[]
}

export async function getSeriesByWorkoutId(workout_id: number) {
	return (await db
		.select()
		.from(Schema.serie)
		.where(and(eq(Schema.serie.workout_id, workout_id), isNull(Schema.serie.deleted_at)))
		.orderBy(asc(Schema.serie.exercice_position), asc(Schema.serie.serie_position))) as Schema.Serie[]
}

export async function getSeriesByExerciceId(exercice_id: number) {
	return (await db
		.select({
			id: Schema.serie.id,
			workout_id: Schema.serie.workout_id,
			exercice_id: Schema.serie.exercice_id,
			poids: Schema.serie.poids,
			reps: Schema.serie.reps,
			exercice_position: Schema.serie.exercice_position,
			serie_position: Schema.serie.serie_position,
			created_at: Schema.serie.created_at,
			updated_at: Schema.serie.updated_at,
			deleted_at: Schema.serie.deleted_at
		})
		.from(Schema.serie)
		.where(and(eq(Schema.serie.exercice_id, exercice_id), isNull(Schema.serie.deleted_at)))
		.orderBy(desc(Schema.workout.date), asc(Schema.serie.exercice_position), asc(Schema.serie.serie_position))
		.innerJoin(Schema.workout, eq(Schema.serie.workout_id, Schema.workout.id))) as Schema.Serie[]
}

export async function getSeries() {
	return (await db.select().from(Schema.serie).where(isNull(Schema.serie.deleted_at))) as Schema.Serie[]
}

export async function getSeriesByExerciceIds(exercice_ids: number[]) {
	return (await db
		.select({
			id: Schema.serie.id,
			workout_id: Schema.serie.workout_id,
			exercice_id: Schema.serie.exercice_id,
			poids: Schema.serie.poids,
			reps: Schema.serie.reps,
			exercice_position: Schema.serie.exercice_position,
			serie_position: Schema.serie.serie_position,
			created_at: Schema.serie.created_at,
			updated_at: Schema.serie.updated_at,
			deleted_at: Schema.serie.deleted_at
		})
		.from(Schema.serie)
		.where(and(inArray(Schema.serie.exercice_id, exercice_ids), isNull(Schema.serie.deleted_at)))
		.orderBy(desc(Schema.workout.date), asc(Schema.serie.exercice_position), asc(Schema.serie.serie_position))
		.innerJoin(Schema.workout, eq(Schema.serie.workout_id, Schema.workout.id))) as Schema.Serie[]
}

// ## Update

export async function updateSerie(
	idOrSerie: number | Schema.NewSerie,
	workout_id?: number,
	exercice_id?: number,
	poids?: number,
	reps?: number,
	exercice_position?: number,
	serie_position?: number,
) {
	let updatedSerie: Partial<Schema.NewSerie>

	if (typeof idOrSerie === "number") {
		updatedSerie = {
			workout_id: workout_id,
			exercice_id: exercice_id,
			poids: poids,
			reps: reps,
			exercice_position: exercice_position,
			serie_position: serie_position,
			updated_at: new Date(),
		}
	} else {
		updatedSerie = {
			...idOrSerie,
			updated_at: new Date(),
		}
	}

	const result = await db
		.update(Schema.serie)
		.set(updatedSerie)
		.where(eq(Schema.serie.id, typeof idOrSerie === "number" ? idOrSerie : idOrSerie.id!))
		.returning({ id: Schema.serie.id })

	// Revalidate all pages that might show series
	revalidatePath("/", "layout")

	if (!result) {
		return null
	}

	return result[0].id
}

// ## Delete

export async function deleteSerieById(id: number) {
	const result = await db
		.update(Schema.serie)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.serie.id, id))
		.returning({ id: Schema.serie.id })

	// Revalidate all pages that might show series
	revalidatePath("/", "layout")

	if (result) {
		return result[0].id
	}

	return null
}
