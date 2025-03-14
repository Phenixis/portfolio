"use client"

import { useState } from "react"
import type { Todo } from "@/lib/db/schema"
import { TodosContainer } from "./todosContainer"
import Todos from "./todos"

export function TodosFilterClient({
  className,
  initialCompleted,
  limit,
  orderBy,
  orderingDirection,
}: {
  className?: string
  initialCompleted?: boolean
  limit?: number
  orderBy?: keyof Todo
  orderingDirection?: "asc" | "desc"
}) {
  const [completed, setCompleted] = useState<boolean | undefined>(initialCompleted)

  // This is a client component that renders the server component
  // based on the current filter state
  return (
    <TodosContainer className={className} initialCompleted={initialCompleted} onFilterChange={setCompleted}>
      <Todos limit={limit} completed={completed} orderBy={orderBy} orderingDirection={orderingDirection} />
    </TodosContainer>
  )
}

