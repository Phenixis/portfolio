import {
  getCompletedTodos,
  getUncompletedTodos,
  getTodos,
  createTodo,
  updateTodo,
  markTodoAsDone,
  markTodoAsUndone,
  toggleTodo,
  deleteTodoById,
  createProject,
  getProject,
} from "@/lib/db/queries"
import type { Todo } from "@/lib/db/schema"
import { type NextRequest, NextResponse } from "next/server"

// GET - Récupérer les todos
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const completedParam = searchParams.get("completed")
  const orderBy = searchParams.get("orderBy") as keyof Todo | null
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

  console.log("Due before:", dueBefore)

  if (completedParam === "true") completed = true
  else if (completedParam === "false") completed = false

  try {
    const todos =
      completed === true
        ? await getCompletedTodos(orderBy || undefined, orderingDirection, limit, projectTitles, dueBefore)
        : completed === false
          ? await getUncompletedTodos(orderBy || undefined, orderingDirection, limit, projectTitles, dueBefore)
          : await getTodos(orderBy || undefined, orderingDirection, limit, projectTitles, dueBefore)

    return NextResponse.json(todos)
  } catch (error) {
    console.error("Error fetching todos:", error)
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 })
  }
}

// POST - Créer un nouveau todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, importance, dueDate, duration, projectTitle } = body

    // Validation
    if (!title || importance === undefined || dueDate === undefined || duration === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const project = projectTitle && await getProject(projectTitle)
    if (!project && projectTitle != "") {
      await createProject(projectTitle)
    }

    const todoId = await createTodo(title, Number(importance), new Date(dueDate), Number(duration), projectTitle != "" ? projectTitle : undefined)

    return NextResponse.json({ id: todoId }, { status: 201 })
  } catch (error) {
    console.error("Error creating todo:", error)
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 })
  }
}

// PUT - Mettre à jour un todo existant
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, importance, dueDate, duration, projectTitle } = body

    // Validation
    if (!id || !title || importance === undefined || dueDate === undefined || duration === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const project = projectTitle && await getProject(projectTitle)
    if (!project) {
      await createProject(projectTitle)
    }

    const todoId = await updateTodo(Number(id), title, Number(importance), new Date(dueDate), Number(duration), projectTitle)

    return NextResponse.json({ id: todoId })
  } catch (error) {
    console.error("Error updating todo:", error)
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 })
  }
}

// PATCH - Marquer un todo comme terminé/non terminé
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, completed } = body

    // Validation
    if (!id || completed === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let todoId
    if (completed === true) {
      todoId = await markTodoAsDone(Number(id))
    } else if (completed === false) {
      todoId = await markTodoAsUndone(Number(id))
    } else {
      // Si completed est un booléen indiquant l'état actuel, on utilise toggleTodo
      todoId = await toggleTodo(Number(id), completed)
    }

    return NextResponse.json({ id: todoId })
  } catch (error) {
    console.error("Error toggling todo completion:", error)
    return NextResponse.json({ error: "Failed to update todo status" }, { status: 500 })
  }
}

// DELETE - Supprimer un todo
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const idParam = url.searchParams.get("id")

    if (!idParam) {
      return NextResponse.json({ error: "Missing todo ID" }, { status: 400 })
    }

    const id = Number(idParam)
    const todoId = await deleteTodoById(id)

    return NextResponse.json({ id: todoId })
  } catch (error) {
    console.error("Error deleting todo:", error)
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 })
  }
}