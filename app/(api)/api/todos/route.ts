import { getCompletedTodos, getUncompletedTodos, getTodos } from "@/lib/db/queries"
import type { Todo } from "@/lib/db/schema"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const completedParam = searchParams.get("completed")
  const orderBy = searchParams.get("orderBy") as keyof Todo | null
  const limitParam = searchParams.get("limit")

  const limit = limitParam ? Number.parseInt(limitParam) : undefined
  let completed: boolean | undefined = undefined

  if (completedParam === "true") completed = true
  else if (completedParam === "false") completed = false

  try {
    const todos =
      completed === true
        ? await getCompletedTodos(orderBy || undefined, limit)
        : completed === false
          ? await getUncompletedTodos(orderBy || undefined, limit)
          : await getTodos(orderBy || undefined, limit)

    return NextResponse.json(todos)
  } catch (error) {
    console.error("Error fetching todos:", error)
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 })
  }
}