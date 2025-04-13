"use client"

import type React from "react"

import { useState, useOptimistic, startTransition, useRef, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Todo, Project } from "@/lib/db/schema"
import { TodoModal } from "./todoModal"
import { TrashIcon } from "lucide-react"
import { useSWRConfig } from "swr"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function TodoDisplay({
	todo,
	orderedBy,
	className,
}: { todo?: Todo | (Todo & { project: Project }); orderedBy?: keyof Todo; className?: string }) {
	const [isToggled, setIsToggled] = useState(todo ? todo.completed_at !== null : false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isHovering, setIsHovering] = useState(false)
	const [showTrash, setShowTrash] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const { mutate } = useSWRConfig()
	const skeleton = todo !== undefined && orderedBy !== undefined
	const daysBeforeDue = todo ? Math.ceil((new Date(todo.due).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 4

	// Handle delayed appearance of trash icon
	useEffect(() => {
		let timeoutId: NodeJS.Timeout

		if (isHovering) {
			// Set timeout to show trash icon after 1200ms
			timeoutId = setTimeout(() => {
				setShowTrash(true)
			}, 1200)
		} else {
			// Hide trash icon immediately
			setShowTrash(false)
		}

		// Cleanup timeout on component unmount or when isHovering changes
		return () => {
			clearTimeout(timeoutId)
		}
	}, [isHovering])

	// Fonction améliorée pour supprimer une todo avec SWR
	async function deleteTodo(e: React.MouseEvent) {
		e.stopPropagation() // Empêche le clic de se propager

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
	async function toggle() {
		if (!todo) return

		startTransition(() => {
			toggleOptimistic(isToggled)
		})

		try {
			// Optimistic UI update for toggling
			mutate(
				(key: unknown) => typeof key === "string" && key.startsWith("/api/todo"),
				async (currentData: unknown): Promise<unknown> => {
					if (!Array.isArray(currentData)) return currentData

					return currentData.map((item: Todo) => {
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

	function handleMouseEnter() {
		if (window.innerWidth >= 1024) {
			setIsHovering(true)
		}
	}

	function handleMouseLeave() {
		if (window.innerWidth >= 1024) {
			setIsHovering(false)
		}
	}

	return (
		<div
			ref={containerRef}
			className={cn(
				`flex flex-col xl:flex-row justify-between items-end xl:items-center group/todo p-1 duration-300 text-xs xl:text-base ${daysBeforeDue < 0 ? "bg-red-500/10 dark:bg-red-500/15 lg:hover:bg-red-500/25" : daysBeforeDue <= 3 ? "bg-orange-500/10 dark:bg-orange-500/15 lg:hover:bg-orange-500/25" : "lg:hover:bg-primary/10"} space-x-2 xl:space-x-4 ${isDeleting ? "opacity-50" : ""}`,
				className,
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{skeleton ? (
				<>
					<div className="flex space-x-2 items-center w-full">
						<div
							className={cn(
								"overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center px-1",
								isHovering
									? "w-fit xl:w-full xl:max-w-[18px] xl:opacity-100 ml-2"
									: "w-fit xl:w-0 xl:max-w-0 xl:opacity-0",
							)}
						>
							{/* Only this div is clickable for toggling */}
							<div
								className={`relative p-2 size-1 border border-neutral-300 dark:border-neutral-700 rounded-300 cursor-pointer ${optimisticState ? "bg-primary" : ""}`}
								onClick={() => toggle()}
								role="checkbox"
								aria-checked={optimisticState}
								tabIndex={0}
							>
								<div
									className={`absolute inset-0 w-1/2 h-1/2 z-20 m-auto duration-300 ${optimisticState ? "xl:group-hover/todo:bg-background" : "xl:group-hover/todo:bg-primary"}`}
								/>
							</div>
						</div>
						<p className={`w-full text-base hyphens-auto ${optimisticState ? "line-through text-muted-foreground" : ""}`} lang="en">
							{todo.title}
							<span className="ml-2 text-xs text-neutral">{todo[orderedBy] as string}</span>
						</p>
					</div>
					<div className="flex items-center">
						{todo.project_title && (
							<Badge className="text-center" variant="outline">
								{todo.project_title}
							</Badge>
						)}

						{/* TrashIcon with delayed appearance */}
						<div
							className={cn(
								"overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center",
								showTrash
									? "w-full xl:max-w-[16px] xl:opacity-100 ml-2"
									: "w-full xl:w-0 xl:max-w-0 xl:opacity-0",
							)}
						>
							<TrashIcon
								className="min-w-[16px] max-w-[16px] min-h-[24px] max-h-[24px] text-destructive cursor-pointer lg:hover:text-destructive/80 duration-300"
								onClick={deleteTodo}
							/>
						</div>

						{/* TodoModal with immediate appearance on hover */}
						<div
							className={cn(
								"overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center",
								isHovering
									? "w-full xl:max-w-[16px] xl:opacity-100 ml-2"
									: "w-full xl:w-0 xl:max-w-0 xl:opacity-0",
							)}
						>
							<TodoModal className="duration-300" todo={todo} />
						</div>
					</div>
				</>
			) : (
				<div className="flex space-x-2 items-center w-full">
					<Skeleton className="w-5 h-5" />
					<Skeleton className="w-full h-4" />
				</div>
			)}
		</div>
	)
}

