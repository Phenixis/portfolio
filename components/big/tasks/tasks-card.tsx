"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
const TaskModal = dynamic(() => import("@/components/big/tasks/task-modal"), { ssr: false })
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Task, TaskWithRelations } from "@/lib/db/schema"
import { useState, useCallback, useTransition, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Filter, Square, SquareMinus, FolderTree, Calendar } from "lucide-react"
import TaskDisplay from "./task-display"
import { useTasks } from "@/hooks/use-tasks"
import { Checkbox } from "@/components/ui/checkbox"
import { useProjects } from "@/hooks/use-projects"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"

function generateTitle(
	completed?: boolean,
	orderBy?: keyof Task,
	orderingDirection?: "asc" | "desc",
	limit?: number,
	groupedByProject?: boolean,
	projectTitles?: string[],
	dueBeforeDate?: Date,
) {
	let title = limit ? `The top ${limit} ` : "All "

	if (completed === true) {
		title += "completed "
	} else if (completed === false) {
		title += "uncompleted "
	}

	title += "Tasks"

	if (groupedByProject && projectTitles && projectTitles.length > 0) {
		if (projectTitles.length === 1) {
			title += ` in ${projectTitles[0]}`
		} else if (projectTitles.length === 2) {
			title += ` in ${projectTitles[0]} and ${projectTitles[1]}`
		} else {
			const lastProject = projectTitles[projectTitles.length - 1]
			title += ` in ${projectTitles.slice(0, projectTitles.length - 1).join(", ")}, and ${lastProject}`
		}
	}

	if (dueBeforeDate) {
		title += ` due before ${format(dueBeforeDate, "MMM d, yyyy")}`
	}

	return title.trim()
}

export function TasksCard({
	className,
	initialCompleted = false,
	limit: initialLimit,
	orderBy: initialOrderBy = "score",
	orderingDirection: initialOrderingDirection = "desc",
	withProject = true,
}: {
	className?: string
	initialCompleted?: boolean
	limit?: number
	orderBy?: keyof Task
	orderingDirection?: "asc" | "desc"
	withProject?: boolean
}) {
	const router = useRouter()
	const searchParams = useSearchParams()

	// Use isPending to prevent multiple clicks during transitions
	const [isPending, startTransition] = useTransition()

	// State for filter controls
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [completed, setCompleted] = useState<boolean | undefined>(
		searchParams.has("completed")
			? searchParams.get("completed") === "true"
				? true
				: searchParams.get("completed") === "false"
					? false
					: undefined
			: initialCompleted,
	)
	const [limit, setLimit] = useState<number | undefined>(
		searchParams.has("limit") ? Number.parseInt(searchParams.get("limit") || "") || initialLimit : initialLimit,
	)
	const [orderBy, setOrderBy] = useState<keyof Task | undefined>(
		(searchParams.get("orderBy") as keyof Task) || initialOrderBy,
	)
	const [orderingDirection, setOrderingDirection] = useState<"asc" | "desc" | undefined>(
		(searchParams.get("orderingDirection") as "asc" | "desc") || initialOrderingDirection,
	)
	const [selectedProjects, setSelectedProjects] = useState<string[]>(
		searchParams.has("projects") ? searchParams.get("projects")?.split(",") || [] : [],
	)
	const [dueBeforeDate, setDueBeforeDate] = useState<Date | undefined>(
		searchParams.has("dueBefore") ? new Date(searchParams.get("dueBefore") || "") : undefined,
	)
	const { projects, isLoading: projectsLoading, mutate: mutateProject } = useProjects({
		completed: false,
		taskCompleted: completed,
		taskDueDate: dueBeforeDate,
		taskDeleted: false,
	})

	// Add a new state variable for grouping by project after the other state variables
	const [groupByProject, setGroupByProject] = useState(searchParams.get("groupByProject") === "true")

	useEffect(() => {
		mutateProject()
		selectedProjects.forEach((projectTitle) => {
			if (!projects?.some((project) => project.title === projectTitle)) {
				setSelectedProjects((prev) => prev.filter((title) => title !== projectTitle))
			}
		})
	}, [completed, dueBeforeDate])

	// Function to update URL parameters
	const updateUrlParams = useCallback(() => {
		const params = new URLSearchParams()

		if (completed !== undefined) {
			params.set("completed", completed.toString())
		}

		if (limit) {
			params.set("limit", limit.toString())
		}

		if (orderBy) {
			params.set("orderBy", orderBy as string)
		}

		if (orderingDirection) {
			params.set("orderingDirection", orderingDirection)
		}

		if (selectedProjects.length > 0) {
			params.set("projects", selectedProjects.join(","))
		}

		if (dueBeforeDate) {
			params.set("dueBefore", dueBeforeDate.toISOString())
		}

		if (groupByProject) {
			params.set("groupByProject", "true")
		}

		// Update the URL without refreshing the page
		router.push(`?${params.toString()}`, { scroll: false })
	}, [completed, limit, orderBy, orderingDirection, selectedProjects, dueBeforeDate, groupByProject, router])

	// Update URL when filters change
	useEffect(() => {
		updateUrlParams()
	}, [completed, limit, orderBy, orderingDirection, selectedProjects, dueBeforeDate, groupByProject, updateUrlParams])

	// Use our custom hook to fetch tasks
	const { tasks, isLoading } = useTasks({
		completed,
		orderBy,
		limit,
		orderingDirection,
		withProject,
		projectTitles: groupByProject && selectedProjects.length > 0 ? selectedProjects : undefined,
		dueBefore: dueBeforeDate,
	})

	// Memoize the cycleCompletedFilter function to prevent unnecessary re-renders
	const cycleCompletedFilter = useCallback(() => {
		startTransition(() => {
			if (completed === true) {
				setCompleted(undefined) // First click: show uncompleted
			} else if (completed === false) {
				setCompleted(true) // Second click: show completed
			} else {
				setCompleted(false) // Third click: show all
			}
		})
	}, [completed])

	const toggleProject = useCallback((projectTitle: string) => {
		startTransition(() => {
			setSelectedProjects((prev) =>
				prev.includes(projectTitle) ? prev.filter((id) => id !== projectTitle) : [...prev, projectTitle],
			)
		})
	}, [])

	const clearDueBeforeFilter = useCallback(() => {
		startTransition(() => {
			setDueBeforeDate(undefined)
		})
	}, [])

	const groupedTodos = useMemo(() => {
		if (!tasks) return {}

		return tasks.slice(0, limit).reduce(
			(acc, task) => {
				const projectId = task.project_title || "no-project"
				const projectName = projects?.find((p) => p.title === task.project_title)?.title || "No Project"

				if (!acc[projectId]) {
					acc[projectId] = {
						name: projectName,
						tasks: [],
					}
				}

				acc[projectId].tasks.push(task)
				return acc
			},
			{} as Record<
				string,
				{
					name: string
					tasks: TaskWithRelations[]
				}
			>,
		)
	}, [tasks, projects])

	return (
		<Card
			className={cn(`w-full md:max-w-xl group/TodoCard h-fit max-h-screen overflow-y-auto scrollbar-hide`, className)}
		>
			<CardHeader className="flex flex-col sticky top-0 bg-background z-10">
				<div className="flex flex-row items-center justify-between w-full gap-2">
					<Link href={`/my/tasks`}>
						<CardTitle>
							{generateTitle(completed, orderBy, orderingDirection, limit, groupByProject, selectedProjects, dueBeforeDate)}
						</CardTitle>
					</Link>
					<div className="flex gap-2 xl:opacity-0 duration-300 xl:group-hover/TodoCard:opacity-100">
						<Button
							variant={isFilterOpen ? "default" : "outline"}
							size="sm"
							onClick={() => setIsFilterOpen((prev) => !prev)}
							disabled={isPending || isLoading}
							tooltip="Filter/group the tasks"
							className="h-10 py-2 flex items-center border-none"
						>
							<Filter className="h-4 w-4" />
						</Button>
						<TaskModal />
					</div>
				</div>
				<div className={`${!isFilterOpen && "hidden"} flex flex-col gap-2`}>
					<div className="flex flex-row justify-between items-center gap-6 flex-wrap">
						{/* Due Before Date Filter */}
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={dueBeforeDate ? "default" : "outline"}
									size="sm"
									disabled={isPending || isLoading}
									tooltip="Filter by due date"
									className="flex items-center gap-1"
								>
									<Calendar className="h-4 w-4" />
									{dueBeforeDate ? format(dueBeforeDate, "MMM d") : "Due Before"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<CalendarComponent
									mode="single"
									selected={dueBeforeDate}
									onSelect={(date) => {
										setDueBeforeDate(date)
									}}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						<div className="flex flex-row items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={cycleCompletedFilter}
								disabled={isPending || isLoading}
								className={cn("flex items-center gap-1")}
								tooltip={`
                  ${completed === true ? "Completed" : completed === false ? "Uncompleted" : "All"} tasks
                `}
							>
								{completed === true ? (
									<Square className="rounded-sm bg-card-foreground h-4 w-4" />
								) : completed === false ? (
									<Square className="h-4 w-4" />
								) : (
									<SquareMinus className="h-4 w-4" />
								)}
							</Button>
						</div>
						<div className="flex flex-row items-center gap-2">
							<Button
								variant={limit === 5 ? "default" : "outline"}
								size="sm"
								onClick={() => setLimit(5)}
								disabled={isPending || isLoading}
								tooltip="Limit to 5 tasks"
							>
								5
							</Button>
							<Button
								variant={limit === 10 ? "default" : "outline"}
								size="sm"
								onClick={() => setLimit(10)}
								disabled={isPending || isLoading}
								tooltip="Limit to 10 tasks"
							>
								10
							</Button>
							<Button
								variant={limit === 25 ? "default" : "outline"}
								size="sm"
								onClick={() => setLimit(25)}
								disabled={isPending || isLoading}
								tooltip="Limit to 25 tasks"
							>
								25
							</Button>
							<Button
								variant={limit === 50 ? "default" : "outline"}
								size="sm"
								onClick={() => setLimit(50)}
								disabled={isPending || isLoading}
								tooltip="Limit to 50 tasks"
							>
								50
							</Button>
						</div>
						<Button
							variant={groupByProject ? "default" : "outline"}
							size="sm"
							onClick={() => setGroupByProject(!groupByProject)}
							disabled={isPending || isLoading}
							tooltip="Group by project"
						>
							<FolderTree className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex items-center justify-between w-full">
						{groupByProject && (
							<div className="w-full flex flex-col space-x-2">
								<div className="w-full mt-2 border rounded-md p-2 grid grid-cols-2 gap-2">
									{projectsLoading ? (
										<div className="w-full text-sm text-center text-muted-foreground col-span-2">Loading projects...</div>
									) : projects?.length > 0 ? (
										projects.map((project) => (
											<div key={project.title} className="flex items-center space-x-2">
												<Checkbox
													id={`project-${project.title}`}
													checked={selectedProjects.includes(project.title)}
													onCheckedChange={() => toggleProject(project.title)}
												/>
												<label htmlFor={`project-${project.title}`} className="text-sm cursor-pointer">
													{project.title}
												</label>
											</div>
										))
									) : (
										<div className="w-full text-sm text-center text-muted-foreground col-span-2">No projects found</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					// Show loading state
					Array(5)
						.fill(null)
						.map((_, i) => <TaskDisplay key={i} />)
				) : tasks?.length > 0 ? (
					// Show tasks, grouped or ungrouped based on the groupByProject state
					groupByProject ? (
						// Grouped by project
						Object.entries(groupedTodos).sort(([, a], [, b]) => a.name.localeCompare(b.name)).map(([projectId, { name, tasks }]) => (
							<div key={projectId} className="mb-4">
								<h3 className="font-medium text-sm p-2 rounded-md">{name}</h3>
								<div className="pl-2">
									{tasks.map(
										(
											task: TaskWithRelations,
										) => (
											<TaskDisplay
												key={task.id}
												task={task}
												orderedBy={orderBy}
												className="mt-1"
												currentLimit={limit}
												currentDueBefore={dueBeforeDate}
												currentProjects={selectedProjects}
											/>
										),
									)}
								</div>
							</div>
						))
					) : (
						// Not grouped
						tasks
							.slice(0, limit)
							.map(
								(
									task: TaskWithRelations
								) => (
									<TaskDisplay key={task.id} task={task} orderedBy={orderBy} className="mt-1" currentLimit={limit} currentDueBefore={dueBeforeDate} currentProjects={selectedProjects} />
								),
							)
					)
				) : (
					// Show empty state
					<div className="text-center py-4">No tasks found</div>
				)}
			</CardContent>
		</Card>
	)
}
