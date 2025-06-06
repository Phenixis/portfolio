"use client"

import { useHabits } from './use-habits'
import { useFilteredData } from './use-filtered-data'
import { useMemo } from 'react'
import { Habit, HabitEntry } from '@/lib/db/schema'

/**
 * Hook to calculate today's overall daily habits completion progress
 * Returns a percentage of completed daily habits for today
 */
export function useDailyHabitsProgress() {
    const { habits } = useHabits()
    
    // Get all habit entries for today
    const today = useMemo(() => {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        return date
    }, [])
    
    const startOfDay = today.toISOString()
    const endOfDay = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()
    
    const { data: entriesResponse } = useFilteredData<{ success: boolean; data: HabitEntry[] }>({
        endpoint: '/api/habit-entries',
        params: {
            startDate: startOfDay,
            endDate: endOfDay
        }
    })
    
    const todayEntries = useMemo(() => {
        return entriesResponse?.data || []
    }, [entriesResponse])
    
    // Filter only active daily habits
    const dailyHabits = useMemo(() => {
        return habits.filter((habit: Habit) => 
            habit.is_active && habit.frequency === 'daily'
        )
    }, [habits])

    // Calculate overall progress
    const progress = useMemo(() => {
        if (dailyHabits.length === 0) {
            return {
                percentage: 0,
                completed: 0,
                total: 0,
                habits: []
            }
        }

        let completedHabits = 0
        const habitProgress = dailyHabits.map((habit: Habit) => {
            // Find today's entry for this habit
            const todayEntry = todayEntries.find((entry: HabitEntry) => 
                entry.habit_id === habit.id
            )
            
            const currentCount = todayEntry?.count || 0
            const isCompleted = currentCount >= habit.target_count
            const progressPercentage = Math.min(100, Math.round((currentCount / habit.target_count) * 100))
            
            if (isCompleted) {
                completedHabits++
            }

            return {
                habit,
                isCompleted,
                progress: progressPercentage,
                currentCount,
                targetCount: habit.target_count
            }
        })

        const percentage = Math.round((completedHabits / dailyHabits.length) * 100)

        return {
            percentage,
            completed: completedHabits,
            total: dailyHabits.length,
            habits: habitProgress
        }
    }, [dailyHabits, todayEntries])

    return progress
}

/**
 * Hook to calculate a specific habit's completion for today
 */
export function useTodayHabitCompletion(habitId: number, targetCount: number) {
    const { data: entriesResponse } = useFilteredData<{ success: boolean; data: HabitEntry[] }>({
        endpoint: '/api/habit-entries',
        params: { habit_id: habitId }
    })
    
    const entries = useMemo(() => {
        return entriesResponse?.data || []
    }, [entriesResponse])
    
    const todayCompletion = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const todayEntry = entries.find((entry: HabitEntry) => {
            const entryDate = new Date(entry.date)
            entryDate.setHours(0, 0, 0, 0)
            return entryDate.getTime() === today.getTime()
        })

        const currentCount = todayEntry?.count || 0
        const isCompleted = currentCount >= targetCount
        const percentage = Math.min(100, Math.round((currentCount / targetCount) * 100))

        return {
            currentCount,
            targetCount,
            isCompleted,
            percentage
        }
    }, [entries, targetCount])

    return todayCompletion
}
