"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TodoModal } from "@/components/big/todos/todoModal"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState, useCallback, useTransition, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Filter } from "lucide-react"

type FilterState = boolean | undefined

export function TodosContainer({
  className,
  initialCompleted,
  children,
  onFilterChange,
}: {
  className?: string
  initialCompleted?: boolean
  children: ReactNode
  onFilterChange: (completed: FilterState) => void
}) {
  // Use isPending to prevent multiple clicks during transitions
  const [isPending, startTransition] = useTransition()

  // State for filter controls
  const [completed, setCompleted] = useState<FilterState>(initialCompleted)

  // Memoize the cycleCompletedFilter function to prevent unnecessary re-renders
  const cycleCompletedFilter = useCallback(() => {
    startTransition(() => {
      let newState: FilterState
      if (completed === undefined) {
        newState = true // First click: show completed
      } else if (completed === true) {
        newState = false // Second click: show uncompleted
      } else {
        newState = undefined // Third click: show all
      }
      setCompleted(newState)
      onFilterChange(newState)
    })
  }, [completed, onFilterChange])

  function generateTitle(completed?: boolean) {
    let title = "All "

    if (completed === true) {
      title = "Completed "
    } else if (completed === false) {
      title = "Uncompleted "
    }

    title += "Todos"
    return title.trim()
  }

  return (
    <Card className={cn(`w-full max-w-xl group/TodoCard`, className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <Link href={`/my/todos`}>
            <CardTitle>{generateTitle(completed)}</CardTitle>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={cycleCompletedFilter}
              disabled={isPending}
              className={cn(
                "flex items-center gap-1",
                completed === true && "bg-green-100 hover:bg-green-200 border-green-300",
                completed === false && "bg-red-100 hover:bg-red-200 border-red-300",
              )}
            >
              {completed === true ? (
                <>
                  <CheckCircle className="h-4 w-4" /> Completed
                </>
              ) : completed === false ? (
                <>
                  <XCircle className="h-4 w-4" /> Uncompleted
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4" /> All
                </>
              )}
            </Button>
          </div>
        </div>
        <TodoModal className="opacity-0 duration-300 group-hover/TodoCard:opacity-100" />
      </CardHeader>
      <CardContent>
        <CardDescription>{children}</CardDescription>
      </CardContent>
    </Card>
  )
}