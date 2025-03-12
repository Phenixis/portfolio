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
}: {
  completed?: boolean
  orderBy?: keyof Todo
  limit?: number
}) {
  return completed === true
    ? await getCompletedTodos(orderBy, limit)
    : completed === false
      ? await getUncompletedTodos(orderBy, limit)
      : await getTodos(orderBy, limit)
}

// Server component that provides the initial data
export default async function Todos({
  limit,
  completed,
  orderBy,
}: {
  limit?: number
  completed?: boolean
  orderBy?: keyof Todo
}) {
  // Fetch the initial data on the server
  const initialData = await fetchTodosData({ completed, orderBy, limit })

  // Create a unique key based on the parameters
  const swrKey = `/api/todos?${new URLSearchParams({
    completed: completed?.toString() || "",
    orderBy: orderBy?.toString() || "",
    limit: limit?.toString() || "",
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
        <TodosClient swrKey={swrKey} limit={limit} completed={completed} orderBy={orderBy} />
      </Suspense>
    </SWRConfig>
  )
}