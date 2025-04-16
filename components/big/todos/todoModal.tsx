"use client"

import type React from "react"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Todo, Project, Importance, Duration } from "@/lib/db/schema"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function TodoModal({
	className,
	todo,
}: {
	className?: string
	todo?: Todo & { project: Project | null; importanceDetails: Importance; durationDetails: Duration }
}) {
	const mode = todo ? "edit" : "create"
	const [open, setOpen] = useState(false)
	const [dueDate, setDueDate] = useState<Date>(todo ? new Date(todo.due) : new Date())
	const [showCalendar, setShowCalendar] = useState(false)
	const calendarRef = useRef<HTMLDivElement>(null)
	const [project, setProject] = useState<string>(todo?.project_title || "")
	const [inputValue, setInputValue] = useState<string>(todo?.project_title || "")
	const { projects, isLoading, isError } = useSearchProject({ query: project, limit: 5 })
	const { importanceData, durationData } = useImportanceAndDuration()
	const { mutate } = useSWRConfig()
	const [formChanged, setFormChanged] = useState(false)
	const [showConfirmDialog, setShowConfirmDialog] = useState(false)
	const closeDialogRef = useRef<() => void>(() => { })

	// Use refs to access field values
	const titleRef = useRef<HTMLInputElement>(null)
	const importanceRef = useRef<string>(todo?.importance?.toString() || "0")
	const durationRef = useRef<string>(todo?.duration?.toString() || "0")
	const durationTriggerRef = useRef<HTMLButtonElement>(null)

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

	// Reset form state when dialog opens
	useEffect(() => {
		if (open) {
			setFormChanged(false)
		}
	}, [open])

	// Optimized function to handle submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Avoid duplicate submissions
		if (isSubmittingRef.current) return
		isSubmittingRef.current = true

		try {
			const title = titleRef.current?.value || ""
			const importance = Number.parseInt(importanceRef.current || "0")
			const duration = Number.parseInt(durationRef.current || "0")
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
				project: {
					title: project,
					completed: false,
					created_at: new Date(),
					updated_at: new Date(),
				} as Project,
				importanceDetails: {
					level: importance,
					name: importanceData?.find((item) => item.level === importance)?.name || "",
				},
				durationDetails: {
					level: duration,
					name: durationData?.find((item) => item.level === duration)?.name || "",
				},
			} as Todo & { project: Project | null; importanceDetails: Importance; durationDetails: Duration }

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
			setFormChanged(false)
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
			setFormChanged(
				(date.getTime() !== todo?.due.getTime() && mode === "edit") || mode === "create"
			)
		}
	}

	const handleProjectChange = useDebouncedCallback((value: string) => {
		setProject(value)
	}, 200)

	// Handle dialog close attempt
	const handleCloseAttempt = () => {
		if (formChanged) {
			// Store the close function for later use
			closeDialogRef.current = () => setOpen(false)
			// Show confirmation dialog
			setShowConfirmDialog(true)
		} else {
			// No changes, close immediately
			setOpen(false)
		}
	}

	// Handle confirmation dialog result
	const handleConfirmDiscard = () => {
		// Close confirmation dialog
		setShowConfirmDialog(false)
		// Reset form state
		setFormChanged(false)
		// Execute the stored close function
		setTimeout(() => {
			closeDialogRef.current()
		}, 100)
	}

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(newOpenState) => {
					if (open && !newOpenState) {
						// Attempting to close
						handleCloseAttempt()
					} else {
						// Opening the dialog
						setOpen(newOpenState)
					}
				}}
			>
				<DialogTrigger className={cn(mode === "edit" && "h-fit", className)} asChild>
					{mode === "edit" ? (
						<PenIcon className="min-w-[16px] max-w-[16px] min-h-[24px] max-h-[24px] cursor-pointer" />
					) : (
						<Button
							variant="outline"
							size="sm"
							tooltip="Create a new todo"
							className="h-10 px-2 flex items-center border-none"
						>
							<PlusIcon className="min-w-[24px] max-w-[24px] min-h-[24px]" />
						</Button>
					)}
				</DialogTrigger>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>{mode === "edit" ? "Edit Todo" : "Create Todo"}</DialogTitle>
					</DialogHeader>
					<form id="todo-form" onSubmit={handleSubmit} className="space-y-4">
						<div>
							<Label htmlFor="title">Title</Label>
							<Input
								ref={titleRef}
								type="text"
								id="title"
								name="title"
								defaultValue={todo?.title || ""}
								autoFocus
								onChange={() => setFormChanged(
									(titleRef.current?.value !== todo?.title && mode === "edit") || mode === "create"
								)}
							/>
						</div>
						<div className="flex flex-col justify-between lg:flex-row lg:space-x-4">
							<div>
								<Label htmlFor="importance">Importance</Label>
								<Select
									name="importance"
									defaultValue={todo?.importance?.toString()}
									onValueChange={(value) => {
										importanceRef.current = value
										setFormChanged(
											(value !== todo?.importance?.toString() && mode === "edit") || mode === "create"
										)
									}}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select importance" />
									</SelectTrigger>
									<SelectContent>
										{importanceData ? (
											importanceData.map((item) => (
												<SelectItem key={item.level} value={item.level.toString()}>
													{item.name}
												</SelectItem>
											))
										) : (
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
												setFormChanged(
													(newDate.getTime() !== todo?.due.getTime() && mode === "edit") || mode === "create"
												)
											}
										}}
									>
										<Minus />
									</Button>
									<Button
										type="button"
										variant="outline"
										className="w-full"
										onClick={() => setShowCalendar(!showCalendar)}
									>
										{format(dueDate, "dd/MM/yyyy")}
									</Button>
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setDueDate(new Date(dueDate.getTime() + 24 * 60 * 60 * 1000))
											setFormChanged(
												(new Date(dueDate.getTime() + 24 * 60 * 60 * 1000).getTime() !== todo?.due.getTime() && mode === "edit") || mode === "create"
											)
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
								<Select
									name="duration"
									defaultValue={todo?.duration?.toString()}
									onValueChange={(value) => {
										durationRef.current = value
										setFormChanged(
											(value !== todo?.duration?.toString() && mode === "edit") || mode === "create"
										)
									}}
								>
									<SelectTrigger ref={durationTriggerRef} className="w-full">
										<SelectValue placeholder="Select duration" />
									</SelectTrigger>
									<SelectContent>
										{durationData ? (
											durationData.map((item) => (
												<SelectItem key={item.level} value={item.level.toString()}>
													{item.name}
												</SelectItem>
											))
										) : (
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
										setFormChanged(
											(e.target.value !== todo?.project_title && mode === "edit") || mode === "create"
										)
									}}
								/>
								{project && !(projects && projects.length == 1 && projects[0].title == project) && (
									<div className="mt-1 overflow-y-auto rounded-md border border-border bg-popover shadow-md">
										{isLoading ? (
											<div className="p-2 text-sm text-muted-foreground">Loading projects...</div>
										) : isError ? (
											<div className="p-2 text-sm text-destructive">Error loading projects</div>
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
																if (durationTriggerRef.current) {
																	durationTriggerRef.current.focus()
																}
															}, 0)
														}}
													>
														{proj.title}
													</li>
												))}
											</ul>
										) : (
											<div className="p-2 text-sm text-muted-foreground">No projects found</div>
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

			{/* Separate confirmation dialog */}
			<AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Discard changes?</AlertDialogTitle>
						<AlertDialogDescription>
							You have unsaved changes. Are you sure you want to close without saving?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmDiscard}>Discard</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
