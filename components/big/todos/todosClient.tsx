"use client"

import type { Todo } from "@/lib/db/schema"
import TodoDisplay from "./todoDisplay"
import useSWR from "swr"
import { useEffect, useRef } from "react"

export default function TodosClient({
  swrKey,
  limit,
  completed,
  orderBy,
  orderingDirection,
}: {
  swrKey: string
  limit?: number
  completed?: boolean
  orderBy?: keyof Todo
  orderingDirection?: "asc" | "desc"
}) {
  // Use a ref to track if this is the initial render
  const isInitialMount = useRef(true)

  // Use SWR to fetch data with the same key as provided by the server
  const { data: todos, mutate } = useSWR(
    swrKey,
    async () => {
      // Skip the fetch on initial render since we already have the data from the server
      if (isInitialMount.current) {
        return undefined
      }

      const params = new URLSearchParams()
      if (completed !== undefined) params.append("completed", completed.toString())
      if (orderBy) params.append("orderBy", orderBy.toString())
      if (limit) params.append("limit", limit.toString())
      if (orderingDirection) params.append("orderingDirection", orderingDirection)

      const res = await fetch(`/api/todos?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch todos")
      return res.json()
    },
    {
      revalidateOnFocus: false, // Prevent revalidation on window focus
      dedupingInterval: 5000, // Deduplicate requests within 5 seconds
    },
  )

  // Set isInitialMount to false after the first render
  useEffect(() => {
    isInitialMount.current = false
  }, [])

  // If todos is undefined (during the initial skip), don't render anything
  if (!todos) return null

  return (
    <>
      {todos.map((todo: Todo) => (
        <TodoDisplay key={todo.id} todo={todo} />
      ))}
    </>
  )
}