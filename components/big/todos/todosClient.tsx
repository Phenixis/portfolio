"use client"

import type { Todo } from "@/lib/db/schema"
import TodoDisplay from "./todoDisplay"
import useSWR from "swr"

export default function TodosClient({
  swrKey,
  limit,
  completed,
  orderBy,
}: {
  swrKey: string
  limit?: number
  completed?: boolean
  orderBy?: keyof Todo
}) {
  // Use SWR to fetch data with the same key as provided by the server
  const { data: todos } = useSWR(swrKey, async () => {
    const params = new URLSearchParams()
    if (completed !== undefined) params.append("completed", completed.toString())
    if (orderBy) params.append("orderBy", orderBy.toString())
    if (limit) params.append("limit", limit.toString())

    const res = await fetch(`/api/todos?${params.toString()}`)
    if (!res.ok) throw new Error("Failed to fetch todos")
    return res.json()
  })

  return (
    <>
      {todos?.map((todo: Todo) => (
        <TodoDisplay key={todo.id} todo={todo} />
      ))}
    </>
  )
}