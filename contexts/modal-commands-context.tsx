"use client"

import React, { createContext, useContext, ReactNode, useState } from 'react'
import { Note, Habit } from '@/lib/db/schema'

// Define the context interface
interface ModalCommandsContextType {
    taskModal: {
        isOpen: boolean
        openModal: () => void
        closeModal: () => void
    }
    noteModal: {
        isOpen: boolean
        openModal: (note?: Note, password?: string) => void
        closeModal: () => void
        note?: Note
        password?: string
    }
    dailyMoodModal: {
        isOpen: boolean
        openModal: (date?: Date) => void
        closeModal: () => void
        date?: Date
    }
    createHabitModal: {
        isOpen: boolean
        openModal: () => void
        closeModal: () => void
    }
    editHabitModal: {
        isOpen: boolean
        openModal: (habit: Habit) => void
        closeModal: () => void
        habit?: Habit
    }
}

// Create the context
const ModalCommandsContext = createContext<ModalCommandsContextType | undefined>(undefined)

// Create the provider component
export function ModalCommandsProvider({ children }: { children: ReactNode }) {
    // Task modal state
    const [taskModalOpen, setTaskModalOpen] = useState(false)
    
    // Note modal state
    const [noteModalOpen, setNoteModalOpen] = useState(false)
    const [noteModalData, setNoteModalData] = useState<{ note?: Note; password?: string }>({})
    
    // Daily mood modal state
    const [dailyMoodModalOpen, setDailyMoodModalOpen] = useState(false)
    const [dailyMoodModalDate, setDailyMoodModalDate] = useState<Date>()

    // Habit modal states
    const [createHabitModalOpen, setCreateHabitModalOpen] = useState(false)
    const [editHabitModalOpen, setEditHabitModalOpen] = useState(false)
    const [editHabitModalData, setEditHabitModalData] = useState<Habit>()

    const value: ModalCommandsContextType = {
        taskModal: {
            isOpen: taskModalOpen,
            openModal: () => setTaskModalOpen(true),
            closeModal: () => setTaskModalOpen(false),
        },
        noteModal: {
            isOpen: noteModalOpen,
            openModal: (note?: Note, password?: string) => {
                setNoteModalData({ note, password })
                setNoteModalOpen(true)
            },
            closeModal: () => {
                setNoteModalOpen(false)
                setNoteModalData({})
            },
            ...noteModalData,
        },
        dailyMoodModal: {
            isOpen: dailyMoodModalOpen,
            openModal: (date?: Date) => {
                setDailyMoodModalDate(date)
                setDailyMoodModalOpen(true)
            },
            closeModal: () => {
                setDailyMoodModalOpen(false)
                setDailyMoodModalDate(undefined)
            },
            date: dailyMoodModalDate,
        },
        createHabitModal: {
            isOpen: createHabitModalOpen,
            openModal: () => setCreateHabitModalOpen(true),
            closeModal: () => setCreateHabitModalOpen(false),
        },
        editHabitModal: {
            isOpen: editHabitModalOpen,
            openModal: (habit: Habit) => {
                setEditHabitModalData(habit)
                setEditHabitModalOpen(true)
            },
            closeModal: () => {
                setEditHabitModalOpen(false)
                setEditHabitModalData(undefined)
            },
            habit: editHabitModalData,
        },
    }

    return (
        <ModalCommandsContext.Provider value={value}>
            {children}
        </ModalCommandsContext.Provider>
    )
}

// Custom hooks to use the modal context
export const useTaskModal = () => {
    const context = useContext(ModalCommandsContext)
    if (!context) {
        throw new Error('useTaskModal must be used within a ModalCommandsProvider')
    }
    return context.taskModal
}

export const useNoteModal = () => {
    const context = useContext(ModalCommandsContext)
    if (!context) {
        throw new Error('useNoteModal must be used within a ModalCommandsProvider')
    }
    return context.noteModal
}

export const useDailyMoodModal = () => {
    const context = useContext(ModalCommandsContext)
    if (!context) {
        throw new Error('useDailyMoodModal must be used within a ModalCommandsProvider')
    }
    return context.dailyMoodModal
}

export const useCreateHabitModal = () => {
    const context = useContext(ModalCommandsContext)
    if (!context) {
        throw new Error('useCreateHabitModal must be used within a ModalCommandsProvider')
    }
    return context.createHabitModal
}

export const useEditHabitModal = () => {
    const context = useContext(ModalCommandsContext)
    if (!context) {
        throw new Error('useEditHabitModal must be used within a ModalCommandsProvider')
    }
    return context.editHabitModal
}
