import {
	getCompletedTasks,
	getUncompletedTasks,
	getTaskById,
	getTasks,
	createTask,
	updateTask,
	markTaskAsDone,
	markTaskAsUndone,
	toggleTask,
	deleteTaskById,
	createProject,
	getProject,
	createTaskToDoAfter,
	getTasksToDoAfter,
	getTasksToDoBefore,
	deleteTaskToDoAfterById,
	deleteTaskToDoAfterByTodoId,
	deleteTaskToDoAfterByAfterId,
} from "@/lib/db/queries"
import type { Task } from "@/lib/db/schema"
import { type NextRequest, NextResponse } from "next/server"

// GET - Récupérer les tasks
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const completedParam = searchParams.get("completed")
	const orderBy = searchParams.get("orderBy") as keyof Task | null
	const limitParam = searchParams.get("limit")
	const orderingDirection = searchParams.get("orderingDirection") as "asc" | "desc" | undefined
	const projectTitles = searchParams.get("projectTitles")
		? searchParams.get("projectTitles")?.split(",")
		: undefined
	const dueBefore = searchParams.get("dueBefore")
		? new Date(searchParams.get("dueBefore") as string)
		: undefined
	const limit = limitParam ? Number.parseInt(limitParam) : undefined
	let completed: boolean | undefined = undefined

	if (completedParam === "true") completed = true
	else if (completedParam === "false") completed = false

	try {
		const tasks =
			completed === true
				? await getCompletedTasks(orderBy || undefined, orderingDirection, limit, projectTitles, dueBefore)
				: completed === false
					? await getUncompletedTasks(orderBy || undefined, orderingDirection, limit, projectTitles, dueBefore)
					: await getTasks(orderBy || undefined, orderingDirection, limit, projectTitles, dueBefore)

		return NextResponse.json(tasks)
	} catch (error) {
		console.error("Error fetching tasks:", error)
		return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
	}
}

// POST - Créer un nouveau task
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { title, importance, dueDate, duration, projectTitle, toDoAfterId } = body

		// Validation
		if (!title || importance === undefined || dueDate === undefined || duration === undefined) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
		}

		const project = projectTitle && await getProject(projectTitle)
		if (!project && projectTitle != "") {
			await createProject(projectTitle)
		}

		const toDoAfter = toDoAfterId && await getTaskById(Number(toDoAfterId))
		if (!toDoAfter && toDoAfterId != "-1") {
			return NextResponse.json({ error: "Invalid toDoAfterId" }, { status: 400 })
		}

		const dueDateAtMidnight = new Date(dueDate)

		const taskId = await createTask(title, Number(importance), dueDateAtMidnight, Number(duration), projectTitle != "" ? projectTitle : undefined)

		if (toDoAfterId && toDoAfterId != "-1") {
			await createTaskToDoAfter(taskId, Number(toDoAfterId))
		}

		return NextResponse.json({ id: taskId }, { status: 201 })
	} catch (error) {
		console.error("Error creating task:", error)
		return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
	}
}

// PUT - Mettre à jour un task existant
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		const { id, title, importance, dueDate, duration, projectTitle, toDoAfterId } = body

		// Validation
		if (!id || !title || importance === undefined || dueDate === undefined || duration === undefined) {
			console.log("Missing required fields:", { id, title, importance, dueDate, duration })
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
		}

		const project = projectTitle && await getProject(projectTitle)
		if (!project && projectTitle) {
			await createProject(projectTitle)
		}

		// Validate toDoAfterId if provided
		if (toDoAfterId !== undefined) {
			// Check if the referenced task exists
			if (toDoAfterId !== -1) {
				const toDoAfter = toDoAfterId && await getTaskById(Number(toDoAfterId))
				if (!toDoAfter) {
					console.log("Invalid toDoAfterId:", toDoAfterId)
					return NextResponse.json({ error: "Invalid toDoAfterId" }, { status: 400 })
				}
				
				// Get existing toDoAfter relations for this task
				const existingRelations = await getTasksToDoAfter(Number(id))
				
				const filteredRelations = existingRelations.filter(
					(relation) => relation.deleted_at === null
				)
				
				// Create new relation if there isn't already one, toDoAfterId is provided and not -1
				if (filteredRelations.length === 0 && toDoAfterId && toDoAfterId !== "-1") {
					await createTaskToDoAfter(Number(id), Number(toDoAfterId))
				}
			}
		}

		const taskId = await updateTask(Number(id), title, Number(importance), new Date(dueDate), Number(duration), projectTitle)

		return NextResponse.json({ id: taskId })
	} catch (error) {
		console.error("Error updating task:", error)
		return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
	}
}

// PATCH - Marquer un task comme terminé/non terminé
export async function PATCH(request: NextRequest) {
	try {
		const body = await request.json()
		const { id, completed } = body

		// Validation
		if (!id || completed === undefined) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
		}

		let taskId
		if (completed === true) {
			taskId = await markTaskAsDone(Number(id))
		} else if (completed === false) {
			taskId = await markTaskAsUndone(Number(id))
		} else {
			// Si completed est un booléen indiquant l'état actuel, on utilise toggleTask
			taskId = await toggleTask(Number(id), completed)
		}

		const task = await getTaskById(Number(taskId))

		if (task) {
			// Si le task a une relation toDoAfter, on la supprime
			const existingToDoAfterRelations = await getTasksToDoAfter(Number(taskId))

			const filteredToDoAfterRelations = existingToDoAfterRelations.filter(
				(relation) => relation.deleted_at === null
			)

			if (filteredToDoAfterRelations.length > 0) {
				filteredToDoAfterRelations.forEach(async (relation) => {
					deleteTaskToDoAfterById(relation.id)
				})
			}

			const existiingToDoBeforeRelations = await getTasksToDoBefore(Number(taskId))

			const filteredToDoBeforeRelations = existiingToDoBeforeRelations.filter(
				(relation) => relation.deleted_at === null
			)

			if (filteredToDoBeforeRelations.length > 0) {
				filteredToDoBeforeRelations.forEach(async (relation) => {
					deleteTaskToDoAfterById(relation.id)
				})
			}
		}

		return NextResponse.json({ id: taskId })
	} catch (error) {
		console.error("Error toggling task completion:", error)
		return NextResponse.json({ error: "Failed to update task status" }, { status: 500 })
	}
}

// DELETE - Supprimer un task
export async function DELETE(request: NextRequest) {
	try {
		const url = new URL(request.url)
		const idParam = url.searchParams.get("id")

		if (!idParam) {
			return NextResponse.json({ error: "Missing task ID" }, { status: 400 })
		}

		const id = Number(idParam)

		// Delete any task dependency relationships
		// 1. Where this task depends on another task
		await deleteTaskToDoAfterByTodoId(id)
		// 2. Where other tasks depend on this task
		await deleteTaskToDoAfterByAfterId(id)

		const taskId = await deleteTaskById(id)

		return NextResponse.json({ id: taskId })
	} catch (error) {
		console.error("Error deleting task:", error)
		return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
	}
}