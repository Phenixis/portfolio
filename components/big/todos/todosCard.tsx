"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TodoModal } from "@/components/big/todos/todoModal"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Todo, Project, Importance, Duration } from "@/lib/db/schema"
import { useState, useCallback, useTransition, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Filter, SquareCheck, Square, SquareMinus, ArrowDown01, ArrowDown10, Infinity, ChevronDown, FolderTree } from "lucide-react"
import TodoDisplay from "./todoDisplay"
import { useTodos } from "@/hooks/useTodos"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useProjects } from "@/hooks/useProjects"

function generateTitle(completed?: boolean, orderBy?: keyof Todo, orderingDirection?: "asc" | "desc", limit?: number, projectTitles?: string[]) {
	let title = limit ? `The top ${limit} ` : "All "

	if (orderBy) {
		switch (orderBy) {
			case "importance":
				title += orderingDirection === "asc" ? "least important " : "most important "
				break
			case "duration":
				title += orderingDirection === "asc" ? "shortest " : "longest "
				break
			case "urgency":
				title += orderingDirection === "asc" ? "least urgent " : "most urgent "
				break
			case "score":
				title += orderingDirection === "asc" ? "lowest scoring " : "highest scoring "
				break
			case "created_at":
				title += orderingDirection === "asc" ? "oldest " : "newest "
				break
			case "completed_at":
				title += orderingDirection === "asc" ? "earliest " : "latest "
				break
			default:
				title += `${orderBy} `
				break
		}
	}

	if (completed === true) {
		title += "completed "
	} else if (completed === false) {
		title += "uncompleted "
	}

	title += "Todos"

	if (projectTitles && projectTitles.length > 0) {
		title += ` in ${projectTitles.join(", ")}`
	}

	return title.trim()
}

export function TodosCard({
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
	orderBy?: keyof Todo
	orderingDirection?: "asc" | "desc"
	withProject?: boolean
}) {
	// Use isPending to prevent multiple clicks during transitions
	const [isPending, startTransition] = useTransition()

	// State for filter controls
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [completed, setCompleted] = useState<boolean | undefined>(initialCompleted)
	const [limit, setLimit] = useState<number | undefined>(initialLimit)
	const [orderBy, setOrderBy] = useState<keyof Todo | undefined>(initialOrderBy)
	const [orderingDirection, setOrderingDirection] = useState<"asc" | "desc" | undefined>(initialOrderingDirection)
	const [selectedProjects, setSelectedProjects] = useState<string[]>([])
	const { projects } = useProjects({
		completed: false,
	})

	// Add a new state variable for grouping by project after the other state variables
	const [groupByProject, setGroupByProject] = useState(false)

	// Use our custom hook to fetch todos
	const { todos, isLoading } = useTodos({
		completed,
		orderBy,
		limit,
		orderingDirection,
		withProject,
		projectTitles: selectedProjects.length > 0 ? selectedProjects : undefined,
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

	const groupedTodos = useMemo(() => {
		if (!todos) return {}

		return todos.reduce(
			(acc, todo) => {
				const projectId = todo.project_title || "no-project"
				const projectName = projects?.find((p) => p.title === todo.project_title)?.title || "No Project"

				if (!acc[projectId]) {
					acc[projectId] = {
						name: projectName,
						todos: [],
					}
				}

				acc[projectId].todos.push(todo)
				return acc
			},
			{} as Record<string, { name: string; todos: (Todo & { project: Project | null; importanceDetails: Importance; durationDetails: Duration })[] }>,
		)
	}, [todos, projects])

	return (
		<Card className={cn(`w-full md:max-w-xl group/TodoCard h-fit max-h-screen overflow-y-auto scrollbar-hide`, className)}>
			<CardHeader className="flex flex-col sticky top-0 bg-background z-10">
				<div className="flex flex-row items-center justify-between w-full gap-2">
					<Link href={`/my/todos`}>
						<CardTitle>{generateTitle(completed, orderBy, orderingDirection, limit, selectedProjects)}</CardTitle>
					</Link>
					<div className="flex gap-2 xl:opacity-0 duration-300 xl:group-hover/TodoCard:opacity-100">
						<div className="h-10 py-2 flex items-center cursor-pointer" onClick={() => setIsFilterOpen((prev) => !prev)}>
							<Filter className="h-4 w-4" />
						</div>
						<TodoModal />
					</div>
				</div>
				<div className={`${!isFilterOpen && "hidden"} flex flex-col gap-2`}>
					<div className="flex flex-row gap-6 flex-wrap">
						<div className="flex flex-row items-center gap-2">
							<Select
								onValueChange={(newValue) => {
									setOrderBy(newValue != "none" ? (newValue as keyof Todo) : initialOrderBy)
								}}
								defaultValue={orderBy}
								disabled={isPending || isLoading}
							>
								<SelectTrigger>
									<SelectValue placeholder="Order by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="importance">Importance</SelectItem>
									<SelectItem value="duration">Duration</SelectItem>
									<SelectItem value="urgency">Urgency</SelectItem>
									<SelectItem value="score">Score</SelectItem>
								</SelectContent>
							</Select>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setOrderingDirection(orderingDirection === "asc" ? "desc" : "asc")
								}}
								disabled={isPending || isLoading}
								className={cn("flex items-center gap-1")}
								tooltip={`Order by ${orderingDirection === "asc" ? "descending" : "ascending"}`}
							>
								{orderingDirection === "asc" ? (
									<ArrowDown01 className="h-4 w-4" />
								) : (
									<ArrowDown10 className="h-4 w-4" />
								)}
							</Button>
						</div>
						<div className="flex flex-row items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={cycleCompletedFilter}
								disabled={isPending || isLoading}
								className={cn("flex items-center gap-1")}
								tooltip={`
									${completed === true ? "Completed" : completed === false ? "Uncompleted" : "All"} todos
								`}
							>
								{completed === true ? (
									<SquareCheck className="h-4 w-4" />
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
								tooltip="Limit to 5 todos"
							>
								5
							</Button>
							<Button
								variant={limit === 10 ? "default" : "outline"}
								size="sm"
								onClick={() => setLimit(10)}
								disabled={isPending || isLoading}
								tooltip="Limit to 10 todos"
							>
								10
							</Button>
							<Button
								variant={limit === 25 ? "default" : "outline"}
								size="sm"
								onClick={() => setLimit(25)}
								disabled={isPending || isLoading}
								tooltip="Limit to 25 todos"
							>
								25
							</Button>
							<Button
								variant={limit === 50 ? "default" : "outline"}
								size="sm"
								onClick={() => setLimit(50)}
								disabled={isPending || isLoading}
								tooltip="Limit to 50 todos"
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
									{projects?.length > 0 ? (
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
						.map((_, i) => <TodoDisplay key={i} />)
				) : todos?.length > 0 ? (
					// Show todos, grouped or ungrouped based on the groupByProject state
					groupByProject ? (
						// Grouped by project
						Object.entries(groupedTodos).map(([projectId, { name, todos }]) => (
							<div key={projectId} className="mb-4">
								<h3 className="font-medium text-sm p-2 rounded-md">{name}</h3>
								<div className="pl-2">
									{todos.map((todo: (Todo & { project: Project | null; importanceDetails: Importance; durationDetails: Duration })) => (
										<TodoDisplay key={todo.id} todo={todo} orderedBy={orderBy} className="mt-1" />
									))}
								</div>
							</div>
						))
					) : (
						// Not grouped
						todos.map((todo: (Todo & { project: Project | null; importanceDetails: Importance; durationDetails: Duration })) => <TodoDisplay key={todo.id} todo={todo} orderedBy={orderBy} className="mt-1" />)
					)
				) : (
					// Show empty state
					<div className="text-center py-4">No todos found</div>
				)}
			</CardContent>
		</Card>
	)
}
