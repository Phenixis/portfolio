"use client"

import { useHabits } from './use-habits'
import { useFilteredData } from './use-filtered-data'
import { useMemo } from 'react'
import { Habit, HabitEntry } from '@/lib/db/schema'

/**
 * Hook to determine which daily habits are overdue
 * A habit is considered overdue if:
 * - It's a daily habit
 * - It's active
 * - It has not been completed today (current count < target count)
 */
export function useOverdueHabits() {
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

    // Calculate which habits are overdue
    const overdueHabits = useMemo(() => {
        const overdueHabitIds = new Set<number>()
        
        dailyHabits.forEach((habit: Habit) => {
            // Find today's entry for this habit
            const todayEntry = todayEntries.find((entry: HabitEntry) => 
                entry.habit_id === habit.id
            )
            
            const currentCount = todayEntry?.count || 0
            const isCompleted = currentCount >= habit.target_count
            
            // If not completed, it's overdue
            if (!isCompleted) {
                overdueHabitIds.add(habit.id)
            }
        })
        
        return overdueHabitIds
    }, [dailyHabits, todayEntries])

    return {
        overdueHabitIds: overdueHabits,
        isHabitOverdue: (habitId: number) => overdueHabits.has(habitId)
    }
}

/**
 * Hook to check if a specific habit is overdue
 */
export function useIsHabitOverdue(habitId: number, frequency: string) {
    const { isHabitOverdue } = useOverdueHabits()
    
    // Only daily habits can be overdue in this context
    if (frequency !== 'daily') {
        return false
    }
    
    return isHabitOverdue(habitId)
}
