"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TodoModal } from "@/components/big/todos/todoModal"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Todo } from "@/lib/db/schema"
import { useState, useCallback, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Filter, Scroll, SquareCheck, Square, SquareMinus, ArrowDown01, ArrowDown10, Infinity } from "lucide-react"
import TodoDisplay from "./todoDisplay"
import { useTodos } from "@/hooks/useTodos"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"


function generateTitle(completed?: boolean, orderBy?: keyof Todo, orderingDirection?: "asc" | "desc", limit?: number) {
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
	return title.trim()
}

export function TodosCard({
	className,
	initialCompleted = false,
	limit: initialLimit,
	orderBy: initialOrderBy = "score",
	orderingDirection: initialOrderingDirection = "desc",
}: {
	className?: string
	initialCompleted?: boolean
	limit?: number
	orderBy?: keyof Todo
	orderingDirection?: "asc" | "desc"
}) {
	// Use isPending to prevent multiple clicks during transitions
	const [isPending, startTransition] = useTransition()

	// State for filter controls
	const [completed, setCompleted] = useState<boolean | undefined>(initialCompleted)
	const [limit, setLimit] = useState<number | undefined>(initialLimit)
	const [orderBy, setOrderBy] = useState<keyof Todo | undefined>(initialOrderBy)
	const [orderingDirection, setOrderingDirection] = useState<"asc" | "desc" | undefined>(initialOrderingDirection)

	// Use our custom hook to fetch todos
	const { todos, isLoading } = useTodos({
		completed,
		orderBy,
		limit,
		orderingDirection,
	})

	// Memoize the cycleCompletedFilter function to prevent unnecessary re-renders
	const cycleCompletedFilter = useCallback(() => {
		startTransition(() => {
			if (completed === undefined) {
				setCompleted(true) // First click: show completed
			} else if (completed === true) {
				setCompleted(false) // Second click: show uncompleted
			} else {
				setCompleted(undefined) // Third click: show all
			}
		})
	}, [completed])

	return (
		<Card className={cn(`w-full max-w-2xl group/TodoCard overflow-y-auto`, className)}>
			<CardHeader className="flex flex-col sticky top-0 bg-background z-10">
				<div className="flex flex-row items-center justify-between w-full gap-2">
					<Link href={`/my/todos`}>
						<CardTitle>{generateTitle(completed, orderBy, orderingDirection, limit)}</CardTitle>
					</Link>
					<TodoModal className="opacity-0 duration-300 group-hover/TodoCard:opacity-100" />
				</div>
				<Collapsible className="flex space-x-4">
					<CollapsibleTrigger>
						<div className="h-10 py-2 flex items-center ">
							<Filter className="h-4 w-4" />
						</div>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="flex flex-row gap-6">
							<div className="flex flex-row items-center gap-2">
								<Select onValueChange={(newValue) => {
									setOrderBy(newValue != "none" ? newValue as keyof Todo : initialOrderBy)
								}} defaultValue={orderBy} disabled={isPending || isLoading}>
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
									className={cn(
										"flex items-center gap-1"
									)}
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
									className={cn(
										"flex items-center gap-1"
									)}
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
									variant={limit === undefined ? "default" : "outline"}
									size="sm"
									onClick={() => setLimit(undefined)}
									disabled={isPending || isLoading}
								>
									<Infinity className="h-4 w-4" />
								</Button>
								<Button
									variant={limit === 5 ? "default" : "outline"}
									size="sm"
									onClick={() => setLimit(5)}
									disabled={isPending || isLoading}
								>
									5
								</Button>
								<Button
									variant={limit === 10 ? "default" : "outline"}
									size="sm"
									onClick={() => setLimit(10)}
									disabled={isPending || isLoading}
								>
									10
								</Button>
								<Button
									variant={limit === 25 ? "default" : "outline"}
									size="sm"
									onClick={() => setLimit(25)}
									disabled={isPending || isLoading}
								>
									25
								</Button>
								<Button
									variant={limit === 50 ? "default" : "outline"}
									size="sm"
									onClick={() => setLimit(50)}
									disabled={isPending || isLoading}
								>
									50
								</Button>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
				<div className="flex gap-2">
				</div>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-full">
					{isLoading ? (
						// Show loading state
						Array(5)
							.fill(null)
							.map((_, i) => <TodoDisplay key={i} />)
					) : todos?.length > 0 ? (
						// Show todos
						todos.map((todo: Todo) => <TodoDisplay key={todo.id} todo={todo} />)
					) : (
						// Show empty state
						<div className="text-center py-4">No todos found</div>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	)
}