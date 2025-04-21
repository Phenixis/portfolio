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
import { alias } from "drizzle-orm/pg-core"

const taskToDoAfterAlias = alias(Schema.taskToDoAfter, 'taskToDoAfter');
const taskToDoBeforeAlias = alias(Schema.taskToDoAfter, 'taskToDoBefore');

// # TASK

// ## Create
export async function createTask(title: string, importance: number, dueDate: Date, duration: number, project?: string) {
	const urgency = calculateUrgency(dueDate)

	const result = await db
		.insert(Schema.task)
		.values({
			title: title,
			importance: importance,
			urgency: urgency,
			duration: duration,
			score: importance * urgency - duration,
			due: dueDate,
			project_title: project,
		} as Schema.NewTask)
		.returning({ id: Schema.task.id })

	// Revalidate all pages that might show todos
	revalidatePath("/", 'layout')

	return result[0].id
}

// ## Read
export async function getTaskById(id: number, recursive: boolean = false) {
	const dbresult = await db
		.select({
			id: Schema.task.id,
			title: Schema.task.title,
			importance: Schema.task.importance,
			duration: Schema.task.duration,
			urgency: Schema.task.urgency,
			score: Schema.task.score,
			due: Schema.task.due,
			project_title: Schema.task.project_title,
			completed_at: Schema.task.completed_at,
			created_at: Schema.task.created_at,
			updated_at: Schema.task.updated_at,
			deleted_at: Schema.task.deleted_at,
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
			tasksToDoAfter: {
				id: taskToDoAfterAlias.id,
				task_id: taskToDoAfterAlias.task_id,
				after_task_id: taskToDoAfterAlias.after_task_id,
				created_at: taskToDoAfterAlias.created_at,
				updated_at: taskToDoAfterAlias.updated_at,
				deleted_at: taskToDoAfterAlias.deleted_at,
			},
			tasksToDoBefore: {
				id: taskToDoBeforeAlias.id,
				task_id: taskToDoBeforeAlias.task_id,
				after_task_id: taskToDoBeforeAlias.after_task_id,
				created_at: taskToDoBeforeAlias.created_at,
				updated_at: taskToDoBeforeAlias.updated_at,
				deleted_at: taskToDoBeforeAlias.deleted_at,
			},
		})
		.from(Schema.task)
		.leftJoin(Schema.project, eq(Schema.task.project_title, Schema.project.title))
		.leftJoin(Schema.importance, eq(Schema.task.importance, Schema.importance.level))
		.leftJoin(Schema.duration, eq(Schema.task.duration, Schema.duration.level))
		.leftJoin(taskToDoAfterAlias, eq(Schema.task.id, taskToDoAfterAlias.task_id)) // tasks to do after this task
		.leftJoin(taskToDoBeforeAlias, eq(Schema.task.id, taskToDoBeforeAlias.after_task_id)) // tasks to do before this task
		.where(and(
			eq(Schema.task.id, id),
		))
	
	if (recursive) {
		const result : any = {
			...dbresult[0],
			tasksToDoAfter: [],
			tasksToDoBefore: [],
			importanceDetails: dbresult[0].importanceDetails!,
			durationDetails: dbresult[0].durationDetails!,
			recursive: true,	
		}

		for (const row of dbresult) {
			const taskId = row.id;

			if (row.tasksToDoAfter?.after_task_id) {
				const afterTaskId = row.tasksToDoAfter.after_task_id;
				if (dbresult[taskId].tasksToDoAfter && dbresult[taskId].tasksToDoAfter.deleted_at === null && !(dbresult[taskId].tasksToDoAfter.id === afterTaskId)) {
					const fullTask = await getTaskById(afterTaskId);
					if (fullTask) result.tasksToDoAfter.push(fullTask);
				}
			}

			if (row.tasksToDoBefore?.task_id) {
				const beforeTaskId = row.tasksToDoBefore.task_id;
				if (dbresult[taskId].tasksToDoBefore && dbresult[taskId].tasksToDoBefore.deleted_at === null && !(dbresult[taskId].tasksToDoBefore.id === beforeTaskId)) {
					const fullTask = await getTaskById(beforeTaskId);
					if (fullTask) result.tasksToDoBefore.push(fullTask);
				}
			}
		}

		return result as Schema.TaskWithRelations;
	} else {
		return dbresult[0] ? {...dbresult[0], recursive: false} as Schema.TaskWithNonRecursiveRelations : null;
	}

}

export async function getTasks(
	orderBy: keyof Schema.Task = "score",
	orderingDirection?: "asc" | "desc",
	limit = 50,
	projectTitles?: string[],
	dueBefore?: Date,
	completed?: boolean
) {
	const rows = await db.select({
		id: Schema.task.id,
		title: Schema.task.title,
		importance: Schema.task.importance,
		urgency: Schema.task.urgency,
		duration: Schema.task.duration,
		due: Schema.task.due,
		score: Schema.task.score,
		completed_at: Schema.task.completed_at,
		created_at: Schema.task.created_at,
		updated_at: Schema.task.updated_at,
		deleted_at: Schema.task.deleted_at,
		project_title: Schema.task.project_title,
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
		tasksToDoAfter: {
			id: taskToDoAfterAlias.id,
			task_id: taskToDoAfterAlias.task_id,
			after_task_id: taskToDoAfterAlias.after_task_id,
			created_at: taskToDoAfterAlias.created_at,
			updated_at: taskToDoAfterAlias.updated_at,
			deleted_at: taskToDoAfterAlias.deleted_at,
		},
		tasksToDoBefore: {
			id: taskToDoBeforeAlias.id,
			task_id: taskToDoBeforeAlias.task_id,
			after_task_id: taskToDoBeforeAlias.after_task_id,
			created_at: taskToDoBeforeAlias.created_at,
			updated_at: taskToDoBeforeAlias.updated_at,
			deleted_at: taskToDoBeforeAlias.deleted_at,
		},
	})
		.from(Schema.task)
		.leftJoin(Schema.project, eq(Schema.task.project_title, Schema.project.title))
		.leftJoin(Schema.importance, eq(Schema.task.importance, Schema.importance.level))
		.leftJoin(Schema.duration, eq(Schema.task.duration, Schema.duration.level))
		.leftJoin(taskToDoAfterAlias, eq(Schema.task.id, taskToDoAfterAlias.task_id)) // tasks to do after this task
		.leftJoin(taskToDoBeforeAlias, eq(Schema.task.id, taskToDoBeforeAlias.after_task_id)) // tasks to do before this task
		.where(and(
			isNull(Schema.task.deleted_at),
			projectTitles ? or(
				inArray(Schema.task.project_title, projectTitles),
				sql`${isNull(Schema.task.project_title)} AND ${projectTitles.includes("No project")}`
			) : sql`1 = 1`,
			dueBefore ? lte(Schema.task.due, dueBefore) : sql`1 = 1`,
			completed !== undefined ? (completed ? isNotNull(Schema.task.completed_at) : isNull(Schema.task.completed_at)) : sql`1 = 1`
		))
		.orderBy(
			orderingDirection === "asc" ? asc(Schema.task[orderBy]) : desc(Schema.task[orderBy]),
			orderingDirection === "asc" ? asc(Schema.task.title) : desc(Schema.task.title)
		)
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit)

	const groupedTasks: Record<string, Schema.TaskWithRelations> = {};

	for (const row of rows) {
		const taskId = row.id;

		if (!groupedTasks[taskId]) {
			groupedTasks[taskId] = {
				...row,
				tasksToDoAfter: [],
				tasksToDoBefore: [],
				importanceDetails: row.importanceDetails!,
				durationDetails: row.durationDetails!,
				recursive: true,
			};
		}

		// For after tasks
		if (row.tasksToDoAfter?.after_task_id) {
			const afterTaskId = row.tasksToDoAfter.after_task_id;
			if (groupedTasks[taskId].tasksToDoAfter && row.tasksToDoAfter.deleted_at === null && !groupedTasks[taskId].tasksToDoAfter.some(t => t.id === afterTaskId && t.deleted_at === null)) {
				
				const fullTask = await getTaskById(afterTaskId);
				if (fullTask && fullTask.recursive === false) {
					groupedTasks[taskId].tasksToDoAfter.push(fullTask);
				}
			}
		}

		// For before tasks
		if (row.tasksToDoBefore?.task_id) {
			const beforeTaskId = row.tasksToDoBefore.task_id;
			if (groupedTasks[taskId].tasksToDoBefore && row.tasksToDoBefore.deleted_at === null && !groupedTasks[taskId].tasksToDoBefore.some(t => t.id === beforeTaskId)) {
				const fullTask = await getTaskById(beforeTaskId);
				if (fullTask && fullTask.recursive === false) groupedTasks[taskId].tasksToDoBefore.push(fullTask);
			}
		}
	}

	const result = Object.values(groupedTasks).sort((a, b) => {
		if ((a[orderBy] ?? 0) < (b[orderBy] ?? 0)) return orderingDirection === "asc" ? -1 : 1;
		if ((a[orderBy] ?? 0) > (b[orderBy] ?? 0)) return orderingDirection === "asc" ? 1 : -1;
		if (a.title < b.title) return -1;
		if (a.title > b.title) return 1;
		return 0;
	});	

	return result as Schema.TaskWithRelations[]
}

export async function getCompletedTasks(orderBy: keyof Schema.Task = "completed_at", orderingDirection?: "asc" | "desc", limit = 50, projectTitles?: string[], dueBefore?: Date) {
	return getTasks(orderBy, orderingDirection, limit, projectTitles, dueBefore, true);
}

export async function getUncompletedTasks(orderBy: keyof Schema.Task = "score", orderingDirection?: "asc" | "desc", limit = 50, projectTitles?: string[], dueBefore?: Date) {
	return getTasks(orderBy, orderingDirection, limit, projectTitles, dueBefore, false);
}

export async function searchTasksByTitle(title: string, limit = 50) {
	return await db
		.select()
		.from(Schema.task)
		.where(and(
			sql`${Schema.task.title} LIKE ${`%${title}%`}`,
			isNull(Schema.task.deleted_at),
			isNull(Schema.task.completed_at),
		))
		.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Schema.Task[]
}

export async function getUncompletedAndDueInTheNextThreeDaysOrLessTasks(withProject: boolean = false, orderBy: keyof Schema.Task = "score", orderingDirection?: "asc" | "desc", limit = 50) {
	const today = new Date()
	const threeDaysFromNow = new Date(today)
	threeDaysFromNow.setDate(today.getDate() + 3)

	if (withProject) {
		return await db.select({
			id: Schema.task.id,
			title: Schema.task.title,
			importance: Schema.task.importance,
			urgency: Schema.task.urgency,
			duration: Schema.task.duration,
			due: Schema.task.due,
			score: Schema.task.score,
			completed_at: Schema.task.completed_at,
			created_at: Schema.task.created_at,
			updated_at: Schema.task.updated_at,
			deleted_at: Schema.task.deleted_at,
			project_title: Schema.task.project_title,
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
			.from(Schema.task)
			.leftJoin(Schema.project, eq(Schema.task.project_title, Schema.project.title))
			.leftJoin(Schema.importance, eq(Schema.task.importance, Schema.importance.level))
			.leftJoin(Schema.duration, eq(Schema.task.duration, Schema.duration.level))
			.where(and(
				isNull(Schema.task.completed_at),
				isNull(Schema.task.deleted_at),
				lte(Schema.task.due, threeDaysFromNow),
			))
			.orderBy(
				orderingDirection === "asc" ? asc(Schema.task[orderBy]) : desc(Schema.task[orderBy])
			)
			.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as (Schema.Task & { project: Schema.Project | null; importanceDetails: Schema.Importance; durationDetails: Schema.Duration })[];
	} else {
		return await db.select()
			.from(Schema.task)
			.where(and(
				isNull(Schema.task.completed_at),
				isNull(Schema.task.deleted_at),
				lte(Schema.task.due, threeDaysFromNow),
			))
			.orderBy(
				orderingDirection === "asc" ? asc(Schema.task[orderBy]) : desc(Schema.task[orderBy])
			)
			.limit(limit === -1 ? Number.MAX_SAFE_INTEGER : limit) as Schema.Task[];
	}
}

// ## Update
export async function updateTask(id: number, title: string, importance: number, dueDate: Date, duration: number, projectTitle: string) {
	const urgency = calculateUrgency(dueDate)

	const result = await db
		.update(Schema.task)
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
		.where(eq(Schema.task.id, id))
		.returning({ id: Schema.task.id })

	// Revalidate all pages that might show todos
	revalidatePath("/", 'layout')

	if (!result) {
		return null
	}

	return result[0].id
}

export async function updateTaskUrgency(id: number) {
	const todoData = await getTaskById(id)
	if (!todoData) {
		return null
	}

	const urgency = calculateUrgency(todoData.due)

	const result = await db
		.update(Schema.task)
		.set({
			urgency: urgency,
			score: todoData.importance * urgency - todoData.duration,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.task.id, id))
		.returning({ id: Schema.task.id })

	// Revalidate all pages that might show todos
	revalidatePath("/", 'layout')

	if (!result) {
		return null
	}

	return result[0].id
}

export async function markTaskAsDone(id: number) {
	const result = await db
		.update(Schema.task)
		.set({
			completed_at: sql`CURRENT_TIMESTAMP`,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.task.id, id))
		.returning({ id: Schema.task.id })

	// Revalidate all pages that might show todos
	revalidatePath("/", 'layout')

	if (!result) {
		return null
	}

	return result[0].id
}

export async function markTaskAsUndone(id: number) {
	const result = await db
		.update(Schema.task)
		.set({
			completed_at: null,
			updated_at: sql`CURRENT_TIMESTAMP`,
		})
		.where(eq(Schema.task.id, id))
		.returning({ id: Schema.task.id })

	// Revalidate all pages that might show todos
	revalidatePath("/", 'layout')

	return result[0].id
}

export async function toggleTask(id: number, currentState: boolean) {
	return currentState ? await markTaskAsUndone(id) : await markTaskAsDone(id);
}

// ## Delete
export async function deleteTaskById(id: number) {
	const result = await db.update(Schema.task)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP`, updated_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.task.id, id))
		.returning({ id: Schema.task.id })

	// Revalidate all pages that might show todos
	revalidatePath("/", 'layout')

	if (result && result.length > 0) {
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

	if (result && result.length > 0) {
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

	if (result && result.length > 0) {
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

	if (result && result.length > 0) {
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

	if (result && result.length > 0) {
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

	if (result && result.length > 0) {
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

	if (result && result.length > 0) {
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

	if (result && result.length > 0) {
		return result[0].id
	}

	return null
}

// # TaskToDoAfter

// ## Create
export async function createTaskToDoAfter(
	todoIdOrTaskToDoAfter: number | Schema.NewTaskToDoAfter,
	after_task_id?: number
) {
	let newTaskToDoAfter: Schema.NewTaskToDoAfter

	if (typeof todoIdOrTaskToDoAfter === "number") {
		newTaskToDoAfter = {
			task_id: todoIdOrTaskToDoAfter,
			after_task_id: after_task_id!,
		}
	} else {
		newTaskToDoAfter = todoIdOrTaskToDoAfter
	}

	const result = await db
		.insert(Schema.taskToDoAfter)
		.values(newTaskToDoAfter)
		.returning({ id: Schema.taskToDoAfter.id })

	return result[0].id
}

// ## Read
export async function getTaskToDoAfterById(id: number) {
	return (await db
		.select()
		.from(Schema.taskToDoAfter)
		.where(eq(Schema.taskToDoAfter.id, id))) as Schema.TaskToDoAfter[]
}

export async function getTaskToDoAfterByTodoId(task_id: number) {
	return (await db
		.select()
		.from(Schema.taskToDoAfter)
		.where(eq(Schema.taskToDoAfter.task_id, task_id))) as Schema.TaskToDoAfter[]
}

export async function getTasksToDoAfter(task_id: number) {
	return getTaskToDoAfterByTodoId(task_id);
}

export async function getTaskToDoAfterByAfterId(after_task_id: number) {
	return (await db
		.select()
		.from(Schema.taskToDoAfter)
		.where(eq(Schema.taskToDoAfter.after_task_id, after_task_id))) as Schema.TaskToDoAfter[]
}

export async function getTasksToDoBefore(after_task_id: number) {
	return getTaskToDoAfterByAfterId(after_task_id);
}

export async function getTaskToDoAfterById1AndId2(task_id: number, after_task_id: number) {
	return (await db
		.select()
		.from(Schema.taskToDoAfter)
		.where(and(
			eq(Schema.taskToDoAfter.task_id, task_id),
			eq(Schema.taskToDoAfter.after_task_id, after_task_id)
		))) as Schema.TaskToDoAfter[]
}

// ## Update

export async function updateTaskToDoAfter(
	idOrTaskToDoAfter: number | Schema.NewTaskToDoAfter,
	task_id?: number,
	after_task_id?: number
) {
	let updatedTaskToDoAfter: Partial<Schema.NewTaskToDoAfter>

	if (typeof idOrTaskToDoAfter === "number") {
		updatedTaskToDoAfter = {
			task_id: task_id,
			after_task_id: after_task_id,
			updated_at: new Date(),
		}
	} else {
		updatedTaskToDoAfter = {
			...idOrTaskToDoAfter,
			updated_at: new Date(),
		}
	}

	const result = await db
		.update(Schema.taskToDoAfter)
		.set(updatedTaskToDoAfter)
		.where(eq(Schema.taskToDoAfter.id, typeof idOrTaskToDoAfter === "number" ? idOrTaskToDoAfter : idOrTaskToDoAfter.id!))
		.returning({ id: Schema.taskToDoAfter.id })

	return result[0].id
}

// ## Delete

export async function deleteTaskToDoAfterById(id: number) {
	const result = await db
		.update(Schema.taskToDoAfter)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP`, updated_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.taskToDoAfter.id, id))
		.returning({ id: Schema.taskToDoAfter.id })

	if (result && result.length > 0) {
		return result[0].id
	}

	return null
}

export async function deleteTaskToDoAfterByTodoId(task_id: number) {
	const result = await db
		.update(Schema.taskToDoAfter)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP`, updated_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.taskToDoAfter.task_id, task_id))
		.returning({ id: Schema.taskToDoAfter.id })

	if (result && result.length > 0) {
		return result[0].id
	}

	return null
}

export async function deleteTaskToDoAfterByAfterId(after_task_id: number) {
	const result = await db
		.update(Schema.taskToDoAfter)
		.set({ deleted_at: sql`CURRENT_TIMESTAMP`, updated_at: sql`CURRENT_TIMESTAMP` })
		.where(eq(Schema.taskToDoAfter.after_task_id, after_task_id))
		.returning({ id: Schema.taskToDoAfter.id })

	if (result && result.length > 0) {
		return result[0].id
	}

	return null
}

