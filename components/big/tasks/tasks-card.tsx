"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
const TaskModal = dynamic(() => import("@/components/big/tasks/task-modal"), { ssr: false })
import { cn } from "@/lib/utils"
import type { Task, TaskWithRelations } from "@/lib/db/schema"
import { useState, useCallback, useTransition, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Filter, Square, SquareMinus, FolderTree, Calendar, CircleHelp } from "lucide-react"
import TaskDisplay from "./task-display"
import { useTasks } from "@/hooks/use-tasks"
import { Checkbox } from "@/components/ui/checkbox"
import { useProjects } from "@/hooks/use-projects"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { updateTaskFilterCookieFromClient } from "./task-actions"
import type { TaskFilterCookie } from "@/lib/flags"
import { useNumberOfTasks } from "@/hooks/use-number-of-tasks"

// Constants for URL parameters
export const TASK_PARAMS = {
	COMPLETED: 'task_completed',
	LIMIT: 'task_limit',
	ORDER_BY: 'task_orderBy',
	ORDERING_DIRECTION: 'task_orderingDirection',
	PROJECTS: 'task_projects',
	REMOVED_PROJECTS: 'task_removedProjects',
	DUE_BEFORE: 'task_dueBefore',
	GROUP_BY_PROJECT: 'task_groupByProject',
} as const;

// Type for URL parameters
export type TaskUrlParams = {
	[TASK_PARAMS.COMPLETED]?: string;
	[TASK_PARAMS.LIMIT]?: string;
	[TASK_PARAMS.ORDER_BY]?: keyof Task;
	[TASK_PARAMS.ORDERING_DIRECTION]?: 'asc' | 'desc';
	[TASK_PARAMS.PROJECTS]?: string;
	[TASK_PARAMS.REMOVED_PROJECTS]?: string;
	[TASK_PARAMS.DUE_BEFORE]?: string;
	[TASK_PARAMS.GROUP_BY_PROJECT]?: string;
};

export function TasksCard({
	className,
	initialCompleted = false,
	limit: initialLimit,
	orderBy: initialOrderBy = "score",
	orderingDirection: initialOrderingDirection = "desc",
	withProject = true,
	initialTaskFilterCookie,
}: {
	className?: string
	initialCompleted?: boolean
	limit?: number
	orderBy?: keyof Task
	orderingDirection?: "asc" | "desc"
	withProject?: boolean
	initialTaskFilterCookie?: TaskFilterCookie
}) {
	// -------------------- Imports & Hooks --------------------
	const router = useRouter()
	const searchParams = useSearchParams()
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)
	tomorrow.setHours(0, 0, 0, 0)
	const [isPending, startTransition] = useTransition()

	// -------------------- State --------------------
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	// Priority: URL params > Cookie > Props
	const [completed, setCompleted] = useState<boolean | undefined>(
		searchParams.has(TASK_PARAMS.COMPLETED)
			? searchParams.get(TASK_PARAMS.COMPLETED) === "true"
				? true
				: searchParams.get(TASK_PARAMS.COMPLETED) === "false"
					? false
					: undefined
			: initialTaskFilterCookie?.completed !== undefined
				? initialTaskFilterCookie.completed
				: initialCompleted
	)

	const [limit, setLimit] = useState<number | undefined>(
		searchParams.has(TASK_PARAMS.LIMIT)
			? Number.parseInt(searchParams.get(TASK_PARAMS.LIMIT) || "") || initialLimit
			: initialTaskFilterCookie?.limit !== undefined
				? initialTaskFilterCookie.limit
				: initialLimit
	)

	const [orderBy] = useState<keyof Task | undefined>(
		(searchParams.get(TASK_PARAMS.ORDER_BY) as keyof Task) ||
		initialTaskFilterCookie?.orderBy ||
		initialOrderBy
	)

	const [orderingDirection] = useState<"asc" | "desc" | undefined>(
		(searchParams.get(TASK_PARAMS.ORDERING_DIRECTION) as "asc" | "desc") ||
		initialTaskFilterCookie?.orderingDirection ||
		initialOrderingDirection
	)

	const [selectedProjects, setSelectedProjects] = useState<string[]>(
		searchParams.has(TASK_PARAMS.PROJECTS)
			? searchParams.get(TASK_PARAMS.PROJECTS)?.split(",") || []
			: initialTaskFilterCookie?.projects || []
	)

	const [removedProjects, setRemovedProjects] = useState<string[]>(
		searchParams.has(TASK_PARAMS.REMOVED_PROJECTS)
			? searchParams.get(TASK_PARAMS.REMOVED_PROJECTS)?.split(",") || []
			: initialTaskFilterCookie?.removedProjects || []
	)

	const [dueBeforeDate, setDueBeforeDate] = useState<Date | undefined>(
		searchParams.has(TASK_PARAMS.DUE_BEFORE)
			? new Date(searchParams.get(TASK_PARAMS.DUE_BEFORE) || "")
			: initialTaskFilterCookie?.dueBeforeDate
				? new Date(initialTaskFilterCookie.dueBeforeDate)
				: undefined
	)

	const [groupByProject, setGroupByProject] = useState(
		searchParams.get(TASK_PARAMS.GROUP_BY_PROJECT) === "true" ||
		(searchParams.get(TASK_PARAMS.GROUP_BY_PROJECT) !== "false" &&
			initialTaskFilterCookie?.groupByProject === true)
	)

	const [tasksCompleted, setTasksCompleted] = useState(0)
	const [tasksUncompleted, setTasksUncompleted] = useState(0)
	const [tasksTotal, setTasksTotal] = useState(0)
	const [progression, setProgression] = useState(0)

	// Add a ref to track if this is the first render
	const isFirstRender = useRef(true);

	// Add a ref to hold previous removedProjects to compare changes
	const prevRemovedProjectsRef = useRef<string[]>([]);

	// -------------------- Data Fetching --------------------
	const { projects, isLoading: projectsLoading } = useProjects({
		completed: false,
		taskCompleted: completed,
		taskDueDate: dueBeforeDate,
		taskDeleted: false,
	})

	const { tasks, isLoading } = useTasks({
		completed,
		orderBy,
		limit,
		orderingDirection,
		withProject,
		projectTitles: groupByProject && selectedProjects.length > 0 ? selectedProjects : undefined,
		excludedProjectTitles: groupByProject && removedProjects.length > 0 ? removedProjects : undefined,
		dueBefore: dueBeforeDate,
	})

	// Memoize the numberOfTasks parameters to prevent unnecessary re-renders
	const numberOfTasksParams = useMemo(() => ({
		projectTitles: groupByProject && selectedProjects.length > 0 ? selectedProjects : undefined,
		excludedProjectTitles: groupByProject && removedProjects.length > 0 ? removedProjects : undefined,
		dueAfter: today,
		dueBefore: dueBeforeDate !== undefined ? dueBeforeDate : tomorrow,
	}), [groupByProject, selectedProjects, removedProjects, dueBeforeDate, today, tomorrow])

	const { data: numberOfTasks, isLoading: isCountLoading, isError: isCountError } = useNumberOfTasks(numberOfTasksParams)

	// -------------------- Effects --------------------

	useEffect(() => {
		if (numberOfTasks && numberOfTasks.length > 0) {
			const completedCount = numberOfTasks.reduce((sum, task) => sum + Number(task.completed_count), 0)
			const uncompletedCount = numberOfTasks.reduce((sum, task) => sum + Number(task.uncompleted_count), 0)
			const totalCount = completedCount + uncompletedCount

			setTasksCompleted(completedCount)
			setTasksUncompleted(uncompletedCount)
			setTasksTotal(totalCount)
			setProgression(Math.round((completedCount / totalCount) * 100))
		}
	}, [numberOfTasks])

	// Fix the infinite update loop by removing removedProjects from dependencies
	// and using a more careful approach to update state
	useEffect(() => {
		// Only update if we have actual project data and it's not the first render
		if (projects && projects.length > 0) {
			// Skip the first render to avoid resetting on initial load
			if (isFirstRender.current) {
				isFirstRender.current = false;
				// Store initial removedProjects for future comparison
				prevRemovedProjectsRef.current = removedProjects;
				return;
			}

			// Filter selected projects to only include those in the current projects list
			setSelectedProjects((prev) =>
				prev.filter((title) => projects.some((project) => project.title === title))
			);

			// Get all project titles from the current projects data
			const currentProjectTitles = new Set(projects.map(project => project.title));

			// Compare current removedProjects with previous to avoid unnecessary updates
			const currentRemovedProjects = [...removedProjects];
			const prevRemovedProjects = prevRemovedProjectsRef.current;

			// Only update if there's an actual difference that needs reconciliation
			if (JSON.stringify(currentRemovedProjects.sort()) !==
				JSON.stringify(prevRemovedProjects.sort())) {

				// Preserve user's choice for projects that exist in the current projects list
				const preservedRemovedProjects = currentRemovedProjects.filter(
					title => currentProjectTitles.has(title)
				);

				// Keep track of removed projects that are not in the current projects list
				// but were previously excluded by the user
				const removedProjectsNotInCurrentList = currentRemovedProjects.filter(
					title => !currentProjectTitles.has(title)
				);

				// Only update state if there's actually a change needed
				if (preservedRemovedProjects.length !== currentRemovedProjects.length ||
					removedProjectsNotInCurrentList.length > 0) {
					const newRemovedProjects = [...preservedRemovedProjects, ...removedProjectsNotInCurrentList];

					// Update the ref before setting state to avoid comparison issues
					prevRemovedProjectsRef.current = newRemovedProjects;

					setRemovedProjects(newRemovedProjects);
				}
			}
		}
		// Importantly, we removed removedProjects from dependencies to avoid the loop
	}, [completed, dueBeforeDate, projects, selectedProjects]);

	// Update cookie when filters change
	useEffect(() => {
		const updateCookie = async () => {
			await updateTaskFilterCookieFromClient({
				completed,
				limit,
				orderBy,
				orderingDirection,
				projects: selectedProjects,
				removedProjects,
				dueBeforeDate: dueBeforeDate?.toISOString(),
				groupByProject
			});
		};

		updateCookie();
	}, [completed, limit, orderBy, orderingDirection, selectedProjects, removedProjects, dueBeforeDate, groupByProject]);

	// -------------------- Callbacks --------------------
	const updateUrlParams = useCallback(() => {
		const params = new URLSearchParams()

		if (completed !== undefined) params.set(TASK_PARAMS.COMPLETED, completed.toString())
		if (limit) params.set(TASK_PARAMS.LIMIT, limit.toString())
		if (orderBy) params.set(TASK_PARAMS.ORDER_BY, orderBy as string)
		if (orderingDirection) params.set(TASK_PARAMS.ORDERING_DIRECTION, orderingDirection)
		if (selectedProjects.length > 0) params.set(TASK_PARAMS.PROJECTS, selectedProjects.join(","))
		if (removedProjects.length > 0) params.set(TASK_PARAMS.REMOVED_PROJECTS, removedProjects.join(","))
		if (dueBeforeDate) params.set(TASK_PARAMS.DUE_BEFORE, dueBeforeDate.toISOString())
		if (groupByProject) params.set(TASK_PARAMS.GROUP_BY_PROJECT, "true")

		router.push(`?${params.toString()}`, { scroll: false })
	}, [completed, limit, orderBy, orderingDirection, selectedProjects, removedProjects, dueBeforeDate, groupByProject, router])

	useEffect(() => {
		// Debounce URL updates to prevent excessive navigation
		const timeoutId = setTimeout(() => {
			updateUrlParams()
		}, 200)
		
		return () => clearTimeout(timeoutId)
	}, [completed, limit, orderBy, orderingDirection, selectedProjects, removedProjects, dueBeforeDate, groupByProject, updateUrlParams])

	const cycleCompletedFilter = useCallback(() => {
		startTransition(() => {
			if (completed === true) setCompleted(undefined)
			else if (completed === false) setCompleted(true)
			else setCompleted(false)
		})
	}, [completed])

	/**
	 * Toggles a project through three states:
	 * 1. Include only this project
	 * 2. Exclude this project
	 * 3. Reset to neutral state
	 * 
	 * @param projectTitle - The title of the project to toggle
	 */
	const toggleProject = useCallback((projectTitle: string) => {
		startTransition(() => {
			if (selectedProjects.includes(projectTitle)) {
				// State 1 -> 2: From "only this project" to "exclude this project" 
				setSelectedProjects(prev => prev.filter(title => title !== projectTitle));
				setRemovedProjects(prev => [...prev, projectTitle]);
			} else if (removedProjects.includes(projectTitle)) {
				// State 2 -> 3: From "exclude this project" to neutral state
				setRemovedProjects(prev => prev.filter(title => title !== projectTitle));
			} else {
				// State 3 -> 1: From neutral to "only this project"
				// If this is the first project being selected, clear excluded projects
				if (selectedProjects.length === 0) {
					setRemovedProjects(prev => prev.filter(title => title !== projectTitle));
				}
				setSelectedProjects(prev => [...prev, projectTitle]);
			}
		});
	}, [selectedProjects, removedProjects])

	// -------------------- Derived Data --------------------
	const groupedTodos = useMemo(() => {
		if (!tasks) return {}

		return tasks.slice(0, limit).reduce(
			(acc, task) => {
				const projectId = task.project_title || "no-project"
				const projectName = projects?.find((p) => p.title === task.project_title)?.title || "No Project"

				if (!acc[projectId]) {
					acc[projectId] = { name: projectName, tasks: [] }
				}

				acc[projectId].tasks.push(task)
				return acc
			},
			{} as Record<string, { name: string; tasks: TaskWithRelations[] }>
		)
	}, [tasks, projects, limit])

	return (
		<Card
			className={cn(`w-full md:max-w-xl group/TodoCard h-fit max-h-screen overflow-y-auto scrollbar-hide`, className)}
		>
			<CardHeader className="flex flex-col sticky top-0 bg-background z-10">
				<div className="absolute top-0 left-0 w-full h-1 bg-muted" title={`${tasksCompleted} task${tasksCompleted > 1 ? 's' : ''} completed out of ${tasksTotal} task${tasksTotal > 1 ? 's' : ''}`}>
					<div
						className={cn(
							"absolute top-0 left-0 h-full transition-all duration-300",
							isCountLoading ? "bg-muted animate-pulse" : "bg-primary"
						)}
						style={{ width: isCountLoading ? "100%" : `${progression}%` }}
					/>
					<div className="w-full flex justify-between items-center pt-2 px-1">
						{isCountLoading  || isCountError ? null : (
							<>
								<p className="text-muted-foreground text-xs">
									{tasksCompleted} task{tasksCompleted > 1 ? 's' : ''} completed
								</p>
								<p className="text-muted-foreground text-xs">
									{tasksUncompleted} task{tasksUncompleted > 1 ? 's' : ''} to complete
								</p>
							</>
						)}
					</div>
				</div>
				<div className="flex flex-row items-center justify-between w-full gap-2">
					<CardTitle>
						Your Tasks
					</CardTitle>
					<div className="flex gap-2 xl:opacity-0 duration-300 lg:group-hover/TodoCard:opacity-100">
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
							<div className="w-full flex flex-col space-y-2">
								{/* Legend code */}
								<div className="w-full mt-2 border rounded-md p-2">
									<div className="flex justify-between items-center mb-2">
										<h4 className="text-sm font-medium">
											Project Filters
											<Tooltip>
												<TooltipTrigger className="ml-1 hidden lg:inline-block">
													<CircleHelp className="ml-1 size-4 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<div className="text-xs text-muted-foreground p-2 max-w-[300px]">
														<div className="space-y-3">
															<div className="flex items-center gap-2">
																<div className="flex items-center gap-2 w-full max-w-1/2">
																	<Checkbox checked={true} disabled className="size-4" />
																	<span className="font-medium">Include Project</span>
																</div>
																<div className="text-muted-foreground inline-block w-full max-w-1/2">Show only tasks from this project</div>
															</div>
															<div className="flex items-center gap-2">
																<div className="flex items-center gap-2 w-full max-w-1/2">
																	<Checkbox checked={false} disabled className="size-4" />
																	<span className="font-medium line-through text-muted-foreground">Exclude Project</span>
																</div>
																<div className="text-muted-foreground inline-block w-full max-w-1/2">Hide tasks from this project</div>
															</div>
															<div className="flex justify-between items-center gap-2">
																<div className="flex items-center gap-2 w-full max-w-1/2">
																	<Checkbox checked={false} disabled className="size-4" />
																	<span className="font-medium">Neutral</span>
																</div>
																<div className="text-muted-foreground inline-block w-full max-w-1/2">Show all tasks</div	>
															</div>
														</div>
													</div>
												</TooltipContent>
											</Tooltip>
										</h4>
										{/* Reset button */}
										{(selectedProjects.length > 0 || removedProjects.length > 0) && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													startTransition(() => {
														setSelectedProjects([]);
														setRemovedProjects([]);
													});
												}}
												className="h-6 text-xs px-2"
											>
												Reset filters
											</Button>
										)}
									</div>
									<div className="grid grid-cols-2 gap-2">
										{projectsLoading ? (
											<div className="w-full text-sm text-center text-muted-foreground col-span-2">Loading projects...</div>
										) : projects?.length > 0 ? (
											projects.map((project) => (
												<div key={"task_" + project.title} className="flex items-center space-x-2">
													{/* Use different visual states for the three toggle states */}
													<Checkbox
														id={`task_project-${project.title}`}
														// Show checked only when project is selected
														checked={selectedProjects.includes(project.title)}
														onCheckedChange={() => toggleProject(project.title)}
													/>
													<label
														htmlFor={`task_project-${project.title}`}
														className={cn(
															"text-sm cursor-pointer flex items-center",
															// Apply visual styling for excluded projects
															removedProjects.includes(project.title) && "line-through text-muted-foreground"
														)}
													>
														{project.title}
													</label>
												</div>
											))
										) : (
											<div className="w-full text-sm text-center text-muted-foreground col-span-2">No projects found</div>
										)}
									</div>
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
						Object.entries(groupedTodos).sort(([, a], [, b]) => (a.name || "").localeCompare(b.name)).map(([projectId, { name, tasks }]) => (
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
					<div className="text-center py-4">Amazing! You have no tasks to do.</div>
				)}
			</CardContent>
		</Card>
	)
}
