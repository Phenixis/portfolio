"use client"

import type React from "react"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Todo } from "@/lib/db/schema"
import { PlusIcon, PenIcon, Minus, Plus } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { useSWRConfig } from "swr"
import { Calendar } from "@/components/ui/calendar"
import { calculateUrgency } from "@/lib/utils"
import { fr } from "date-fns/locale"
import { format } from "date-fns"
import { useDebouncedCallback } from "use-debounce"
import { useSearchProject } from "@/hooks/useSearchProject"
import { useImportanceAndDuration } from "@/hooks/useImportanceAndDuration"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"


export function TodoModal({ className, todo }: { className?: string; todo?: Todo }) {
	const mode = todo ? "edit" : "create"
	const [open, setOpen] = useState(false)
	const [dueDate, setDueDate] = useState<Date>(todo ? new Date(todo.due) : new Date())
	const [showCalendar, setShowCalendar] = useState(false)
	const calendarRef = useRef<HTMLDivElement>(null)
	const [project, setProject] = useState<string>(todo?.project_title || "")
	const [inputValue, setInputValue] = useState<string>(todo?.project_title || "")
	const { projects, isLoading, isError } = useSearchProject({ query: project, limit: 5 })
	const { importanceData, durationData } = useImportanceAndDuration();
	const { mutate } = useSWRConfig()

	// Use refs to access field values
	const titleRef = useRef<HTMLInputElement>(null)
	const importanceRef = useRef<HTMLInputElement>(null)
	const durationRef = useRef<HTMLInputElement>(null)

	// Track if a submission is in progress (to prevent duplicates)
	const isSubmittingRef = useRef(false)

	// Close calendar when clicking outside
	useEffect(() => {
		if (!showCalendar) return

		const handleClickOutside = (event: MouseEvent) => {
			if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
				setShowCalendar(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [showCalendar])

	// Optimized function to handle submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Avoid duplicate submissions
		if (isSubmittingRef.current) return
		isSubmittingRef.current = true

		try {
			const title = titleRef.current?.value || ""
			const importance = Number.parseInt(importanceRef.current?.value || "0")
			const duration = Number.parseInt(durationRef.current?.value || "0")
			const id = todo?.id

			if (!title.trim()) {
				isSubmittingRef.current = false
				return
			}

			const urgency = calculateUrgency(dueDate)
			const score = importance * urgency - duration
			const todoData = {
				id: mode === "edit" ? id : -1,
				title,
				importance,
				urgency,
				duration,
				score,
				due: dueDate,
				project_title: project,
				created_at: mode === "create" ? new Date() : todo?.created_at,
				updated_at: new Date(),
				deleted_at: todo?.deleted_at || null,
				completed_at: todo?.completed_at || null,
			} as Todo

			setOpen(false)

			mutate(
				(key) => typeof key === "string" && key.startsWith("/api/todo"),
				async (currentData) => {
					if (!Array.isArray(currentData)) return currentData

					let updatedData
					if (mode === "edit") {
						updatedData = currentData.map((item) => (item.id === id ? todoData : item))
					} else {
						updatedData = [todoData, ...currentData]
					}

					return updatedData.sort((a, b) => b.score - a.score)
				},
				{ revalidate: false },
			)

			fetch("/api/todo", {
				method: mode === "edit" ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: mode === "edit" ? id : undefined,
					title,
					importance,
					dueDate: dueDate.toISOString(),
					duration,
					projectTitle: project,
				}),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Erreur HTTP: ${response.status}`)
					}
					return response.json()
				})
				.then(() => {
					mutate((key) => typeof key === "string" && key.startsWith("/api/todo"))
				})
				.catch((error) => {
					console.error("Erreur lors de l'opération:", error)
					mutate((key) => typeof key === "string" && key.startsWith("/api/todo"))
				})

			setDueDate(new Date())
			setInputValue("")
			setProject("")
		} catch (error) {
			console.error("Erreur lors de la soumission:", error)
			isSubmittingRef.current = false
		}
	}

	// Keyboard shortcut handler to submit with Ctrl+Enter
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "Enter" && open) {
				const form = document.getElementById("todo-form") as HTMLFormElement
				if (form) {
					form.requestSubmit()
				}
			}
		}

		document.addEventListener("keydown", handleKeyPress)
		return () => {
			document.removeEventListener("keydown", handleKeyPress)
		}
	}, [open])

	// Reset submission state when modal opens/closes
	useEffect(() => {
		isSubmittingRef.current = false
	}, [open])

	const handleDateChange = (date: Date | undefined) => {
		if (date) {
			setDueDate(date)
			setShowCalendar(false)
		}
	}

	const handleProjectChange = useDebouncedCallback((value: string) => {
		setProject(value)
	}, 200)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className={cn("h-fit",  className)}>
				{mode === "edit" ? <PenIcon className="min-w-[16px] max-w-[16px] min-h-[24px] max-h-[24px]" /> : <PlusIcon className="size-6" />}
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{mode === "edit" ? "Edit Todo" : "Create Todo"}</DialogTitle>
				</DialogHeader>
				<form id="todo-form" onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="title">Title</Label>
						<Input ref={titleRef} type="text" id="title" name="title" defaultValue={todo?.title || ""} autoFocus />
					</div>
					<div className="flex flex-col justify-between lg:flex-row lg:space-x-4">
						<div>
							<Label htmlFor="importance">Importance</Label>
							<Select defaultValue={todo?.importance?.toString()}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select importance" />
								</SelectTrigger>
								<SelectContent>
									{importanceData ? importanceData.map((item) => (
										<SelectItem key={item.level} value={item.level.toString()}>
											{item.name}
										</SelectItem>
									)) : (
										<SelectItem value="-1" disabled>
											Loading...
										</SelectItem>
									)}
								</SelectContent>
							</Select>
						</div>
						<div className="relative">
							<Label htmlFor="dueDate">Due date</Label>
							<div className="flex gap-1">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										const newDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000)
										const today = new Date()
										today.setHours(0, 0, 0, 0)
										if (newDate >= today) {
											setDueDate(newDate)
										}
									}}
								>
									<Minus />
								</Button>
								<Button type="button" variant="outline" className="w-full" onClick={() => setShowCalendar(!showCalendar)}>
									{format(dueDate, "dd/MM/yyyy")}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setDueDate(new Date(dueDate.getTime() + 24 * 60 * 60 * 1000))
									}}
								>
									<Plus />
								</Button>
							</div>

							{showCalendar && (
								<div
									ref={calendarRef}
									className="absolute z-50 mt-1 bg-popover p-3 rounded-md shadow-md border border-border"
								>
									<Calendar
										mode="single"
										selected={dueDate}
										onSelect={handleDateChange}
										disabled={(date) => {
											const today = new Date()
											today.setHours(0, 0, 0, 0)
											return date < today
										}}
										locale={fr}
									/>
								</div>
							)}
						</div>
						<div>
							<Label htmlFor="duration">Duration</Label>
							<Select defaultValue={todo?.duration?.toString()}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select duration" />
								</SelectTrigger>
								<SelectContent>
									{durationData ? durationData.map((item) => (
										<SelectItem key={item.level} value={item.level.toString()}>
											{item.name}
										</SelectItem>
									)) : (
										<SelectItem value="-1" disabled>
											Loading...
										</SelectItem>
									)}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex space-x-4">
						<div className="w-full">
							<Label htmlFor="project">Project</Label>
							<Input
								type="text"
								id="project"
								name="project"
								value={inputValue}
								onChange={(e) => {
									setInputValue(e.target.value)
									handleProjectChange(e.target.value)
								}}
							/>
							{project && !(projects && projects.length == 1 && projects[0].title == project) && (
								<div className="mt-1 overflow-y-auto rounded-md border border-border bg-popover shadow-md">
									{isLoading ? (
										<div className="p-2 text-sm text-muted-foreground">
											Loading projects...
										</div>
									) : isError ? (
										<div className="p-2 text-sm text-destructive">
											Error loading projects
										</div>
									) : projects && projects.length > 0 ? (
										<ul className="py-1">
											{projects.map((proj, index) => (
												<li
													key={index}
													className="cursor-pointer px-3 py-2 text-sm lg:hover:bg-accent"
													onClick={() => {
														const selectedProject = proj.title
														setInputValue(selectedProject)
														setProject(selectedProject)
														setTimeout(() => {
															if (durationRef.current) {
																durationRef.current.focus()
															}
														}, 0)
													}}
												>
													{proj.title}
												</li>
											))}
										</ul>
									) : (
										<div className="p-2 text-sm text-muted-foreground">
											No projects found
										</div>
									)}
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">{mode === "edit" ? "Save" : "Create"}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
