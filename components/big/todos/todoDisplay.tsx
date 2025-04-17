"use client"

import type React from "react"

import { useState, useOptimistic, startTransition, useRef, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Todo, Project, Importance, Duration } from "@/lib/db/schema"
import dynamic from 'next/dynamic';
const TodoModal = dynamic(() => import('@/components/big/todos/todoModal'), {ssr: false});
import { ChevronsDownUp, ChevronsUpDown, TrashIcon } from "lucide-react"
import { useSWRConfig } from "swr"
import { cn } from "@/lib/utils"

export default function TodoDisplay({
	todo,
	orderedBy,
	className,
}: { todo?: (Todo & { project: Project | null; importanceDetails: Importance; durationDetails: Duration }); orderedBy?: keyof Todo; className?: string }) {
	const [isToggled, setIsToggled] = useState(todo ? todo.completed_at !== null : false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isHovering, setIsHovering] = useState(false)
	const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)
	const [optimisticState, toggleOptimistic] = useOptimistic(isToggled, (prev) => !prev)
	const containerRef = useRef<HTMLDivElement>(null)
	const { mutate } = useSWRConfig()
	const skeleton = todo !== undefined && orderedBy !== undefined
	const daysBeforeDue = todo ? Math.ceil((new Date(todo.due).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 4

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
				`flex flex-col group/todo p-1 duration-300 text-xs xl:text-base ${daysBeforeDue < 0 ? "bg-red-500/10 dark:bg-red-500/15 lg:hover:bg-red-500/25" : daysBeforeDue <= 3 ? "bg-orange-500/10 dark:bg-orange-500/15 lg:hover:bg-orange-500/25" : "lg:hover:bg-primary/10"} space-y-2 ${isDeleting ? "opacity-50" : ""}`,
				className,
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{skeleton ? (
				<>
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center w-full">
							<div
								className={cn(
									"overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center ",
									isHovering
										? "w-fit xl:w-full xl:max-w-[18px] xl:opacity-100 mx-1"
										: "w-fit xl:w-0 xl:max-w-0 xl:opacity-0",
								)}
							>
								{/* Only this div is clickable for toggling */}
								<div
									className={`relative p-2 ml-1 lg:ml-0 mr-2 lg:mr-0 size-1 border border-neutral-400 dark:border-neutral-600 rounded-300 cursor-pointer group/Clickable ${optimisticState ? "bg-primary" : ""}`}
									onClick={() => toggle()}
									role="checkbox"
									aria-checked={optimisticState}
									tabIndex={0}
								>
									<div
										className={`absolute inset-0 w-1/2 h-1/2 z-20 m-auto duration-300 ${optimisticState ? "xl:group-hover/Clickable:bg-background" : "xl:group-hover/Clickable:bg-primary"}`}
									/>
								</div>
							</div>
							<p className={`w-full text-base hyphens-auto ${optimisticState ? "line-through text-muted-foreground" : ""}`} lang="en">
								{todo.title}
							</p>
						</div>
						<div
							className={cn(
								"overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center",
								isHovering
									? "w-fit xl:w-full xl:max-w-[16px] xl:opacity-100 ml-1"
									: "w-fit xl:w-0 xl:max-w-0 xl:opacity-0",
							)}
						>
							{
								isCollapsibleOpen ? (
									<ChevronsDownUp
										className="min-w-[16px] max-w-[16px] min-h-[24px] max-h-[24px] text-black dark:text-white cursor-pointer duration-300"
										onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
									/>

								) : (
									<ChevronsUpDown
										className="min-w-[16px] max-w-[16px] min-h-[24px] max-h-[24px] text-black dark:text-white cursor-pointer duration-300"
										onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
									/>
								)
							}
						</div>
					</div>
					<div className={`flex space-x-4 justify-between ${!isCollapsibleOpen && "hidden"}`}>
						<div className="space-y-1">
							{todo.project_title && (
								<p className="text-sm text-muted-foreground">
									Project: <span className="text-black dark:text-white">{todo.project_title}</span>
								</p>
							)}
							{todo.importance && (
								<p className="text-sm text-muted-foreground">
									Importance: <span className="text-black dark:text-white">{todo.importanceDetails.name}</span>
								</p>
							)}
							{todo.due && (
								<p className="text-sm text-muted-foreground">
									Due:{" "}
									<span className="text-black dark:text-white">
										{(() => {
											const daysDifference = Math.ceil((new Date(todo.due).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
											const formatter = new Intl.RelativeTimeFormat(navigator.language || "fr-FR", { numeric: "auto" });
											return formatter.format(daysDifference, "day");
										})()}
									</span>
								</p>
							)}
							{todo.duration !== undefined && (
								<p className="text-sm text-muted-foreground">
									Duration: <span className="text-black dark:text-white">{todo.durationDetails.name}</span>
								</p>
							)}
						</div>
						<div className="flex flex-col justify-between">
							<TodoModal className="duration-300" todo={todo} />

							<TrashIcon
								className="min-w-[16px] max-w-[16px] min-h-[24px] max-h-[24px] text-destructive cursor-pointer lg:hover:text-destructive/80 duration-300"
								onClick={deleteTodo}
							/>
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

