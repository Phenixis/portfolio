import { getCompletedTodos, getUncompletedTodos, getTodos } from "@/lib/db/queries"
import TodoDisplay from "./todoDisplay"
import { Suspense } from "react"
import type { Todo } from "@/lib/db/schema"
import { SWRConfig } from "swr"
import TodosClient from "./todosClient"

// This function stays as a server component
async function fetchTodosData({
  completed,
  orderBy,
  limit,
  orderingDirection,
}: {
  completed?: boolean
  orderBy?: keyof Todo
  limit?: number
  orderingDirection?: "asc" | "desc",
}) {
  return completed === true
    ? await getCompletedTodos(orderBy, orderingDirection, limit)
    : completed === false
      ? await getUncompletedTodos(orderBy, orderingDirection, limit)
      : await getTodos(orderBy, orderingDirection, limit)
}

// Server component that provides the initial data
export default async function Todos({
  limit,
  completed,
  orderBy,
  orderingDirection,
}: {
  limit?: number
  completed?: boolean
  orderBy?: keyof Todo
  orderingDirection?: "asc" | "desc",
}) {
  // Fetch the initial data on the server
  const initialData = await fetchTodosData({ completed, orderBy, limit, orderingDirection })

  // Create a unique key based on the parameters
  const swrKey = `/api/todos?${new URLSearchParams({
    completed: completed?.toString() || "",
    orderBy: orderBy?.toString() || "",
    limit: limit?.toString() || "",
    orderingDirection: orderingDirection?.toString() || "",
  }).toString()}`

  return (
    <SWRConfig
      value={{
        fallback: {
          [swrKey]: initialData,
        },
      }}
    >
      <Suspense
        fallback={Array(5)
          .fill(null)
          .map((_, i) => <TodoDisplay key={i} />)}
      >
        <TodosClient swrKey={swrKey} limit={limit} completed={completed} orderBy={orderBy} orderingDirection={orderingDirection} />
      </Suspense>
    </SWRConfig>
  )
}