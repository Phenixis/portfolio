"use client"

import type React from "react"

import { useState, useOptimistic, startTransition, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Task, Project, Importance, Duration } from "@/lib/db/schema"
import dynamic from "next/dynamic"
const TaskModal = dynamic(() => import("@/components/big/tasks/task-modal"), { ssr: false })
import { ChevronsDownUp, ChevronsUpDown, TrashIcon } from "lucide-react"
import { useSWRConfig } from "swr"
import { cn } from "@/lib/utils"

export default function TaskDisplay({
	task,
	orderedBy,
	className,
	currentLimit,
	currentDueBefore,
	currentProjects,
}: {
	task?: Task & { project: Project | null; importanceDetails: Importance; durationDetails: Duration }
	orderedBy?: keyof Task
	className?: string
	currentLimit?: number
	currentDueBefore?: Date
	currentProjects?: string[]
}) {
	const [isToggled, setIsToggled] = useState(task ? task.completed_at !== null : false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isHovering, setIsHovering] = useState(false)
	const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)
	const [optimisticState, toggleOptimistic] = useOptimistic(isToggled, (prev) => !prev)
	const containerRef = useRef<HTMLDivElement>(null)
	const { mutate } = useSWRConfig()
	const skeleton = task !== undefined && orderedBy !== undefined
	const daysBeforeDue = task ? Math.ceil((new Date(task.due).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 4

	// Fonction améliorée pour supprimer une task avec SWR
	async function deleteTask(e: React.MouseEvent) {
		e.stopPropagation() // Empêche le clic de se propager

		if (!task) return

		try {
			setIsDeleting(true)

			// Optimistic UI update - remove the task from all lists
			mutate(
				(key) => typeof key === "string" && key.startsWith("/api/task"),
				async (currentData) => {
					// Filter out the task being deleted from all cached lists
					if (Array.isArray(currentData)) {
						return currentData
							.filter((item) => item.id !== task.id)
							.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
							.slice(0, currentLimit || Number.MAX_SAFE_INTEGER)
					}
					return currentData
				},
				{ revalidate: false }, // Don't revalidate immediately
			)

			// Actual deletion
			await fetch(`/api/task?id=${task.id}`, {
				method: "DELETE",
			})

			// Revalidate after successful deletion
			mutate((key) => typeof key === "string" && key.startsWith("/api/task"))
		} catch (error) {
			console.error("Error deleting task:", error)

			// Revalidate to restore the correct state
			mutate((key) => typeof key === "string" && key.startsWith("/api/task"))
		} finally {
			setIsDeleting(false)
		}
	}

	// Fonction améliorée pour basculer l'état d'une task avec SWR
	async function toggle() {
		if (!task) return

		// Immediately update local state
		setIsToggled(!isToggled)

		// Also update optimistic state for consistent UI
		startTransition(() => {
			toggleOptimistic(!isToggled)
		})

		try {
			// Optimistic UI update for SWR cache
			mutate(
				(key: unknown) => typeof key === "string" && key.startsWith("/api/task"),
				async (currentData: unknown): Promise<unknown> => {
					if (!Array.isArray(currentData)) return currentData

					return currentData.map((item: Task) => {
						if (item.id === task.id) {
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
			await fetch("/api/task", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: task.id, completed: !isToggled }),
			})

			// No need to set state again since we already did it optimistically
			// Revalidate after successful toggle
			mutate((key) => typeof key === "string" && key.startsWith("/api/task"))
		} catch (error) {
			console.error("Error toggling task:", error)

			// Revert both states on error
			setIsToggled(isToggled)
			startTransition(() => {
				toggleOptimistic(isToggled)
			})

			// Revalidate to restore the correct state
			mutate((key) => typeof key === "string" && key.startsWith("/api/task"))
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
				`flex flex-col group/task p-1 duration-300 text-xs xl:text-base ${daysBeforeDue < 0 ? "bg-red-500/10 dark:bg-red-500/15 lg:hover:bg-red-500/25" : daysBeforeDue <= 3 ? "bg-orange-500/10 dark:bg-orange-500/15 lg:hover:bg-orange-500/25" : "lg:hover:bg-primary/10"} space-y-2 ${isDeleting ? "opacity-50" : ""}`,
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
							<p
								className={`w-full text-base hyphens-auto ${optimisticState ? "line-through text-muted-foreground" : ""}`}
								lang="en"
							>
								{task.title}
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
							{isCollapsibleOpen ? (
								<ChevronsDownUp
									className="min-w-[16px] max-w-[16px] min-h-[24px] max-h-[24px] text-black dark:text-white cursor-pointer duration-300"
									onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
								/>
							) : (
								<ChevronsUpDown
									className="min-w-[16px] max-w-[16px] min-h-[24px] max-h-[24px] text-black dark:text-white cursor-pointer duration-300"
									onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
								/>
							)}
						</div>
					</div>
					<div className={`flex space-x-4 justify-between ${!isCollapsibleOpen && "hidden"}`}>
						<div className="space-y-1">
							{task.project_title && (
								<p className="text-sm text-muted-foreground">
									Project: <span className="text-black dark:text-white">{task.project_title}</span>
								</p>
							)}
							{task.importance && (
								<p className="text-sm text-muted-foreground">
									Importance: <span className="text-black dark:text-white">{task.importanceDetails.name}</span>
								</p>
							)}
							{task.due && (
								<p className="text-sm text-muted-foreground">
									Due:{" "}
									<span className="text-black dark:text-white">
										{(() => {
											const daysDifference = Math.ceil(
												(new Date(task.due).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
											)
											const formatter = new Intl.RelativeTimeFormat(navigator.language || "fr-FR", { numeric: "auto" })
											return formatter.format(daysDifference, "day")
										})()}
									</span>
								</p>
							)}
							{task.duration !== undefined && (
								<p className="text-sm text-muted-foreground">
									Duration: <span className="text-black dark:text-white">{task.durationDetails.name}</span>
								</p>
							)}
						</div>
						<div className="flex flex-col justify-between">
							<TaskModal className="duration-300" task={task} currentDueBefore={currentDueBefore} currentLimit={currentLimit} currentProjects={currentProjects} />

							<TrashIcon
								className="min-w-[16px] max-w-[16px] min-h-[24px] max-h-[24px] text-destructive cursor-pointer lg:hover:text-destructive/80 duration-300"
								onClick={deleteTask}
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
