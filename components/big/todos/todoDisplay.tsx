"use client"

import type React from "react"

import { useState, useEffect, useOptimistic, startTransition, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Todo, Project
  
 } from "@/lib/db/schema"
import { TodoModal } from "./todoModal"
import { TrashIcon, Loader } from "lucide-react"
import { useSWRConfig } from "swr"
import { Badge } from "@/components/ui/badge"

export default function TodoDisplay({ todo, orderedBy }: { todo?: (Todo | Todo & { project: Project }), orderedBy?: keyof Todo }) {
  const [isToggled, setIsToggled] = useState(todo ? todo.completed_at !== null : false)
  const [isHovering, setIsHovering] = useState(false)
  const [isShifting, setIsShifting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const labelRef = useRef<HTMLLabelElement>(null)
  const { mutate } = useSWRConfig()
  const skeleton = todo !== undefined && orderedBy !== undefined

  // Fonction améliorée pour supprimer une todo avec SWR
  async function deleteTodo(e: React.MouseEvent) {
    e.stopPropagation() // Empêche le clic de se propager au label

    if (!todo) return

    try {
      setIsDeleting(true)

      // Optimistic UI update - remove the todo from all lists
      mutate(
        (key) => typeof key === "string" && key.startsWith("/api/todo"),
        async (currentData) => {
          // Filter out the todo being deleted from all cached lists
          if (Array.isArray(currentData)) {
            return currentData.filter((item) => item.id !== todo.id)
          }
          return currentData
        },
        { revalidate: false }, // Don't revalidate immediately
      )

      // Actual deletion
      await fetch(`/api/todo?id=${todo.id}`, {
        method: "DELETE",
      })

      // Revalidate after successful deletion
      mutate((key) => typeof key === "string" && key.startsWith("/api/todo"))

    } catch (error) {
      console.error("Error deleting todo:", error)

      // Revalidate to restore the correct state
      mutate((key) => typeof key === "string" && key.startsWith("/api/todo"))
    } finally {
      setIsDeleting(false)
    }
  }

  // Fonction améliorée pour basculer l'état d'une todo avec SWR
  async function toggle(todo: Todo) {
    startTransition(() => {
      toggleOptimistic(isToggled)
    })

    try {
      // Optimistic UI update for toggling
      mutate(
        (key) => typeof key === "string" && key.startsWith("/api/todo"),
        async (currentData) => {
          if (!Array.isArray(currentData)) return currentData

          return currentData.map((item) => {
            if (item.id === todo.id) {
              return {
                ...item,
                completed_at: !isToggled ? new Date().toISOString() : null,
              }
            }
            return item
          })
        },
        { revalidate: false },
      )

      // Actual API call
      await fetch("/api/todo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todo.id, completed: !isToggled }),
      })

      setIsToggled(!isToggled)

      // Revalidate after successful toggle
      mutate((key) => typeof key === "string" && key.startsWith("/api/todo"))
    } catch (error) {
      console.error("Error toggling todo:", error)

      // Revert optimistic update
      startTransition(() => {
        toggleOptimistic(isToggled)
      })

      // Revalidate to restore the correct state
      mutate((key) => typeof key === "string" && key.startsWith("/api/todo"))
    }
  }

  const [optimisticState, toggleOptimistic] = useOptimistic(isToggled, (prev) => !prev)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShifting(true)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShifting(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return (
    <>
      <input
        type="checkbox"
        className="hidden"
        name={`taskButton-${todo?.id || "skeleton"}`}
        id={`taskButton-${todo?.id || "skeleton"}`}
        checked={optimisticState}
        onChange={() => {
          if (todo) {
            toggle(todo)
          }
        }}
      />
      <label
        ref={labelRef}
        htmlFor={`taskButton-${todo?.id || "skeleton"}`}
        className={`flex justify-between items-center group/todo p-1 duration-300 hover:bg-primary/5 ${isDeleting ? "opacity-50" : ""}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        title={skeleton ? `I: ${todo.importance}, U: ${todo.urgency}, D: ${todo.duration}` : "Loading..."}
      >
        {skeleton ? (
          <>
            <div className="flex space-x-2 items-center">
              <div
                className={`relative p-2 size-1 border border-neutral rounded-300 ${optimisticState ? "bg-primary" : ""}`}
              >
                <div
                  className={`absolute inset-0 w-1/2 h-1/2 z-20 m-auto duration-300 ${optimisticState ? "lg:group-hover/todo:bg-background" : "lg:group-hover/todo:bg-primary"}`}
                />
              </div>
              <p className={`${optimisticState ? "line-through text-muted-foreground" : ""}`}>
                {todo.title}
                <span className="ml-2 text-xs text-neutral">{todo[orderedBy] as string}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {"project" in todo && todo.project && (
                <Badge className="mr-2">
                  {todo.project.title}
                </Badge>
              )}
              <TodoModal className="duration-300 opacity-0 group-hover/todo:opacity-100" todo={todo} />
              {isDeleting ? (
                <Loader className="size-4 animate-spin text-muted-foreground" />
              ) : (
                isHovering &&
                isShifting && (
                  <TrashIcon
                    className="size-4 text-destructive cursor-pointer hover:text-destructive/80"
                    onClick={deleteTodo}
                  />
                )
              )}
            </div>
          </>
        ) : (
          <div className="flex space-x-2 items-center w-full">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-full h-4" />
          </div>
        )}
      </label>
    </>
  )
}