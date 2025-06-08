"use server"

import {
    desc,
    eq,
    isNull,
    and,
    gte,
    lte,
    sql,
    between
} from "drizzle-orm"
import { db } from "../drizzle"
import * as Schema from "../schema"
import { revalidatePath } from "next/cache"
import type { HabitFrequency, HabitColor, HabitStats } from "@/lib/types/habits"

//=============================================================================
// # HELPER FUNCTIONS
//=============================================================================

// Helper function to get cycle boundaries for a given date and frequency
function getCycleBoundaries(date: Date, freq: HabitFrequency): { start: Date, end: Date } {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)

    switch (freq) {
        case "daily": {
            const start = new Date(d)
            const end = new Date(d.getTime() + 24 * 60 * 60 * 1000)
            return { start, end }
        }
        case "weekly": {
            // Get the start of the week (Monday)
            const dayOfWeek = d.getDay()
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
            const start = new Date(d.getTime() + mondayOffset * 24 * 60 * 60 * 1000)
            const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000)
            return { start, end }
        }
        case "monthly": {
            const start = new Date(d.getFullYear(), d.getMonth(), 1)
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 1)
            return { start, end }
        }
        case "quarterly": {
            const quarterStartMonth = Math.floor(d.getMonth() / 3) * 3
            const start = new Date(d.getFullYear(), quarterStartMonth, 1)
            const end = new Date(d.getFullYear(), quarterStartMonth + 3, 1)
            return { start, end }
        }
        case "yearly": {
            const start = new Date(d.getFullYear(), 0, 1)
            const end = new Date(d.getFullYear() + 1, 0, 1)
            return { start, end }
        }
        default: {
            // Default to daily if frequency is unknown
            const start = new Date(d)
            const end = new Date(d.getTime() + 24 * 60 * 60 * 1000)
            return { start, end }
        }
    }
}

//=============================================================================
// # HABIT
//=============================================================================

// ## Create

export async function createHabit(
    userId: string,
    title: string,
    color: HabitColor,
    icon: string,
    frequency: HabitFrequency,
    targetCount: number,
    description?: string,
): Promise<number> {
    const result = await db
        .insert(Schema.habit)
        .values({
            user_id: userId,
            title: title,
            description: description,
            color: color,
            icon: icon,
            frequency: frequency,
            target_count: targetCount,
            is_active: true
        } as Schema.NewHabit)
        .returning({ id: Schema.habit.id })

    // Revalidate all pages that might show habits
    revalidatePath("/my", "layout")

    return result[0].id
}

// ## Read

export async function getHabitById(id: number): Promise<Schema.Habit | null> {
    const result = await db
        .select()
        .from(Schema.habit)
        .where(and(
            eq(Schema.habit.id, id),
            isNull(Schema.habit.deleted_at)
        ))

    return result[0] || null
}

export async function getUserHabits(userId: string, activeOnly: boolean = true): Promise<Schema.Habit[]> {
    return await db
        .select()
        .from(Schema.habit)
        .where(and(
            eq(Schema.habit.user_id, userId),
            isNull(Schema.habit.deleted_at),
            activeOnly ? eq(Schema.habit.is_active, true) : sql`1 = 1`
        ))
        .orderBy(desc(Schema.habit.created_at))
}

export async function getHabitsByFrequency(
    userId: string,
    frequency: HabitFrequency,
    activeOnly: boolean = true
): Promise<Schema.Habit[]> {
    return await db
        .select()
        .from(Schema.habit)
        .where(and(
            eq(Schema.habit.user_id, userId),
            eq(Schema.habit.frequency, frequency),
            isNull(Schema.habit.deleted_at),
            activeOnly ? eq(Schema.habit.is_active, true) : sql`1 = 1`
        ))
        .orderBy(desc(Schema.habit.created_at))
}

export async function searchHabits(userId: string, searchTerm: string): Promise<Schema.Habit[]> {
    // Normalize comparison by converting both title and searchTerm to lowercase
    return await db
        .select()
        .from(Schema.habit)
        .where(and(
            eq(Schema.habit.user_id, userId),
            sql`LOWER(${Schema.habit.title}) LIKE LOWER(${`%${searchTerm}%`})`,
            isNull(Schema.habit.deleted_at)
        ))
        .orderBy(desc(Schema.habit.updated_at))
}

// ## Update

export async function updateHabit(
    userId: string,
    id: number,
    title?: string,
    description?: string,
    color?: HabitColor,
    icon?: string,
    frequency?: HabitFrequency,
    targetCount?: number,
    isActive?: boolean
): Promise<number | null> {
    const updateData: Partial<Schema.NewHabit> = {
        updated_at: new Date()
    }

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (color !== undefined) updateData.color = color
    if (icon !== undefined) updateData.icon = icon
    if (frequency !== undefined) updateData.frequency = frequency
    if (targetCount !== undefined) updateData.target_count = targetCount
    if (isActive !== undefined) updateData.is_active = isActive

    const result = await db
        .update(Schema.habit)
        .set(updateData)
        .where(and(
            eq(Schema.habit.id, id),
            eq(Schema.habit.user_id, userId),
            isNull(Schema.habit.deleted_at)
        ))
        .returning({ id: Schema.habit.id })

    // Revalidate all pages that might show habits
    revalidatePath("/my", "layout")

    if (!result || result.length === 0) {
        return null
    }

    return result[0].id
}

export async function toggleHabitActive(id: number): Promise<boolean | null> {
    const habit = await getHabitById(id)
    if (!habit) return null

    const result = await db
        .update(Schema.habit)
        .set({
            is_active: !habit.is_active,
            updated_at: new Date()
        })
        .where(and(
            eq(Schema.habit.id, id),
            isNull(Schema.habit.deleted_at)
        ))
        .returning({ is_active: Schema.habit.is_active })

    // Revalidate all pages that might show habits
    revalidatePath("/my", "layout")

    if (!result || result.length === 0) {
        return null
    }

    return result[0].is_active
}

// ## Delete

export async function deleteHabit(userId: string, id: number): Promise<number | null> {
    const result = await db
        .update(Schema.habit)
        .set({
            deleted_at: new Date(),
            updated_at: new Date()
        })
        .where(and(
            eq(Schema.habit.id, id),
            eq(Schema.habit.user_id, userId)
        ))
        .returning({ id: Schema.habit.id })

    // Revalidate all pages that might show habits
    revalidatePath("/my", "layout")

    if (!result || result.length === 0) {
        return null
    }

    return result[0].id
}

//=============================================================================
// # HABIT ENTRY
//=============================================================================

// ## Create

export async function createHabitEntry(
    userId: string,
    habitId: number,
    date: Date,
    count: number,
    notes?: string
): Promise<number> {
    const result = await db
        .insert(Schema.habitEntry)
        .values({
            habit_id: habitId,
            user_id: userId,
            date: date,
            count: count,
            notes: notes
        } as Schema.NewHabitEntry)
        .returning({ id: Schema.habitEntry.id })

    // Revalidate all pages that might show habit entries
    revalidatePath("/my", "layout")

    return result[0].id
}

// ## Read

export async function getHabitEntryById(userId: string, id: number): Promise<Schema.HabitEntry | null> {
    const result = await db
        .select()
        .from(Schema.habitEntry)
        .where(and(
            eq(Schema.habitEntry.id, id),
            eq(Schema.habitEntry.user_id, userId)
        ))

    return result[0] || null
}

export async function getHabitEntryByDate(
    userId: string,
    habitId: number,
    date: Date
): Promise<Schema.HabitEntry | null> {
    // Create date without time for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    const result = await db
        .select()
        .from(Schema.habitEntry)
        .where(and(
            eq(Schema.habitEntry.habit_id, habitId),
            eq(Schema.habitEntry.user_id, userId),
            sql`${Schema.habitEntry.date}::date = ${dateOnly}::date`
        ))

    return result[0] || null
}

export async function getHabitEntries(
    habitId: number,
    startDate?: Date,
    endDate?: Date,
    limit?: number
): Promise<Schema.HabitEntry[]> {
    let whereConditions = and(
        eq(Schema.habitEntry.habit_id, habitId)
    )

    if (startDate || endDate) {
        if (startDate && endDate) {
            whereConditions = and(
                whereConditions,
                between(Schema.habitEntry.date, startDate, endDate)
            )
        } else if (startDate) {
            whereConditions = and(
                whereConditions,
                gte(Schema.habitEntry.date, startDate)
            )
        } else if (endDate) {
            whereConditions = and(
                whereConditions,
                lte(Schema.habitEntry.date, endDate)
            )
        }
    }

    const query = db
        .select()
        .from(Schema.habitEntry)
        .where(whereConditions)
        .orderBy(desc(Schema.habitEntry.date))

    if (limit) {
        query.limit(limit)
    }

    return await query
}

export async function getUserHabitEntries(
    userId: string,
    startDate?: Date,
    endDate?: Date
): Promise<(Schema.HabitEntry & { habit: Schema.Habit })[]> {
    let whereConditions = and(
        eq(Schema.habitEntry.user_id, userId),
        isNull(Schema.habit.deleted_at)
    )

    if (startDate || endDate) {
        if (startDate && endDate) {
            whereConditions = and(
                whereConditions,
                between(Schema.habitEntry.date, startDate, endDate)
            )
        } else if (startDate) {
            whereConditions = and(
                whereConditions,
                gte(Schema.habitEntry.date, startDate)
            )
        } else if (endDate) {
            whereConditions = and(
                whereConditions,
                lte(Schema.habitEntry.date, endDate)
            )
        }
    }

    return await db
        .select({
            id: Schema.habitEntry.id,
            habit_id: Schema.habitEntry.habit_id,
            user_id: Schema.habitEntry.user_id,
            date: Schema.habitEntry.date,
            count: Schema.habitEntry.count,
            notes: Schema.habitEntry.notes,
            created_at: Schema.habitEntry.created_at,
            updated_at: Schema.habitEntry.updated_at,
            habit: Schema.habit
        })
        .from(Schema.habitEntry)
        .innerJoin(Schema.habit, eq(Schema.habitEntry.habit_id, Schema.habit.id))
        .where(whereConditions)
        .orderBy(desc(Schema.habitEntry.date))
}

export async function getCycleProgress(
    userId: string,
    frequency: HabitFrequency,
    date: Date
): Promise<{
    cycleStart: Date;
    cycleEnd: Date;
    habits: Array<{
        habit: Schema.Habit;
        isCompleted: boolean;
        currentCount: number;
        targetCount: number;
        completionPercentage: number;
    }>;
}> {
    // Get cycle boundaries for the given date and frequency
    const { start: cycleStart, end: cycleEnd } = getCycleBoundaries(date, frequency)

    // Get all habits with the specified frequency for the user
    const habits = await getHabitsByFrequency(userId, frequency, true)

    // Check completion status for each habit in this cycle
    const habitProgress = await Promise.all(
        habits.map(async (habit) => {
            // Get all entries for this habit within the cycle
            const entries = await getHabitEntries(habit.id, cycleStart, cycleEnd)

            // Calculate total count for this cycle
            const currentCount = entries.reduce((sum, entry) => sum + entry.count, 0)
            const targetCount = habit.target_count || 1
            const isCompleted = currentCount >= targetCount
            const completionPercentage = Math.min(Math.round((currentCount / targetCount) * 100), 100)

            return {
                habit,
                isCompleted,
                currentCount,
                targetCount,
                completionPercentage
            }
        })
    )

    return {
        cycleStart,
        cycleEnd,
        habits: habitProgress
    }
}

// ## Update

export async function updateHabitEntry(
    userId: string,
    id: number,
    count?: number,
    notes?: string
): Promise<number | null> {
    const updateData: Partial<Schema.NewHabitEntry> = {
        updated_at: new Date()
    }

    if (count !== undefined) updateData.count = count
    if (notes !== undefined) updateData.notes = notes

    const result = await db
        .update(Schema.habitEntry)
        .set(updateData)
        .where(and(
            eq(Schema.habitEntry.id, id),
            eq(Schema.habitEntry.user_id, userId)
        ))
        .returning({ id: Schema.habitEntry.id })

    // Revalidate all pages that might show habit entries
    revalidatePath("/my", "layout")

    if (!result || result.length === 0) {
        return null
    }

    return result[0].id
}

export async function updateHabitEntryByDate(
    userId: string,
    habitId: number,
    date: Date,
    count?: number,
    notes?: string
): Promise<number | null> {
    const existingEntry = await getHabitEntryByDate(userId, habitId, date)

    if (!existingEntry) {
        // Create new entry if it doesn't exist
        return await createHabitEntry(userId, habitId, date, count || 1, notes)
    }

    // Update existing entry
    return await updateHabitEntry(userId, existingEntry.id, count, notes)
}

// ## Delete

export async function deleteHabitEntry(userId: string, id: number): Promise<number | null> {
    const result = await db
        .delete(Schema.habitEntry)
        .where(and(
            eq(Schema.habitEntry.id, id),
            eq(Schema.habitEntry.user_id, userId)
        ))
        .returning({ id: Schema.habitEntry.id })

    // Revalidate all pages that might show habit entries
    revalidatePath("/my", "layout")

    if (!result || result.length === 0) {
        return null
    }

    return result[0].id
}

export async function deleteHabitEntryByDate(
    userId: string,
    habitId: number,
    date: Date
): Promise<number | null> {
    const entry = await getHabitEntryByDate(userId, habitId, date)

    if (!entry) {
        return null
    }

    return await deleteHabitEntry(userId, entry.id)
}

//=============================================================================
// # HABIT STATISTICS
//=============================================================================

export async function getHabitStats(userId: string, habitId: number): Promise<HabitStats> {
    // Fetch habit and entries
    const habit = await getHabitById(habitId)
    if (!habit) {
        return {
            number_of_cycles: 0,
            number_of_cycles_completed: 0,
            number_of_cycles_uncompleted: 0,
            number_of_cycles_in_progress: 0,
            current_streak_of_cycles_completed: 0,
            longest_streak_of_cycles_completed: 0,
            completion_rate: 0
        }
    }

    const entries = await getHabitEntries(habitId)
    const frequency = habit.frequency
    const targetCount = habit.target_count || 1

    // Determine cycle boundaries
    const startDate = new Date(habit.created_at)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Helper to get next cycle start date
    function addCycle(date: Date, freq: string): Date {
        const d = new Date(date)
        switch (freq) {
            case "daily":
                d.setDate(d.getDate() + 1)
                break
            case "weekly":
                d.setDate(d.getDate() + 7)
                break
            case "monthly":
                d.setMonth(d.getMonth() + 1)
                break
            case "quarterly":
                d.setMonth(d.getMonth() + 3)
                break
            case "yearly":
                d.setFullYear(d.getFullYear() + 1)
                break
            default:
                d.setDate(d.getDate() + 1)
        }
        return d
    }

    // Generate all cycles from creation to today
    const cycles: { start: Date, end: Date }[] = []
    let cycleStart = new Date(startDate)
    let cycleEnd = addCycle(cycleStart, frequency)
    while (cycleStart <= today) {
        cycles.push({ start: new Date(cycleStart), end: new Date(cycleEnd) })
        cycleStart = new Date(cycleEnd)
        cycleEnd = addCycle(cycleStart, frequency)
    }

    // Map entries to cycles
    const entriesByCycle = cycles.map(({ start, end }) => {
        const entriesInCycle = entries.filter(entry =>
            entry.date >= start && entry.date < end
        )
        const totalCount = entriesInCycle.reduce((sum, entry) => sum + entry.count, 0)
        return {
            completed: totalCount >= targetCount,
            inProgress: totalCount > 0 && totalCount < targetCount,
            entries: entriesInCycle
        }
    })

    const number_of_cycles = cycles.length
    const number_of_cycles_completed = entriesByCycle.filter(c => c.completed).length
    const number_of_cycles_in_progress = entriesByCycle.filter(c => c.inProgress && !c.completed).length
    const number_of_cycles_uncompleted = number_of_cycles - number_of_cycles_completed - number_of_cycles_in_progress

    // Calculate streaks
    let current_streak_of_cycles_completed = 0
    let longest_streak_of_cycles_completed = 0
    let tempStreak = 0

    for (let i = 0; i < entriesByCycle.length; i++) {
        if (entriesByCycle[i].completed) {
            tempStreak++
            longest_streak_of_cycles_completed = Math.max(longest_streak_of_cycles_completed, tempStreak)
        } else {
            tempStreak = 0
        }
    }

    // Current streak: count from the end backwards
    tempStreak = 0
    for (let i = entriesByCycle.length - 1; i >= 0; i--) {
        if (entriesByCycle[i].completed) {
            tempStreak++
        } else {
            break
        }
    }
    current_streak_of_cycles_completed = tempStreak

    // Completion rate
    const completion_rate = number_of_cycles > 0
        ? Math.round((number_of_cycles_completed / number_of_cycles) * 100)
        : 0

    return {
        number_of_cycles,
        number_of_cycles_completed,
        number_of_cycles_uncompleted,
        number_of_cycles_in_progress,
        current_streak_of_cycles_completed,
        longest_streak_of_cycles_completed,
        completion_rate
    }
}

export async function getUserHabitStats(userId: string): Promise<{
    totalHabits: number;
    activeHabits: number;
    totalCompletions: number;
    averageCompletionRate: number;
}> {
    const habits = await getUserHabits(userId, false)
    const activeHabits = habits.filter(habit => habit.is_active)

    const allEntries = await getUserHabitEntries(userId)
    const totalCompletions = allEntries.reduce((sum, entry) => sum + entry.count, 0)

    // Calculate average completion rate across all active habits
    let totalCompletionRate = 0
    let habitCount = 0

    for (const habit of activeHabits) {
        const stats: HabitStats = await getHabitStats(userId, habit.id)
        totalCompletionRate += stats.completion_rate
        habitCount++
    }

    const averageCompletionRate = habitCount > 0 ? totalCompletionRate / habitCount : 0

    return {
        totalHabits: habits.length,
        activeHabits: activeHabits.length,
        totalCompletions,
        averageCompletionRate: Math.round(averageCompletionRate)
    }
}