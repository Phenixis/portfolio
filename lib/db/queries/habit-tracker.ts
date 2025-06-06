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
import type { HabitFrequency, HabitColor } from "@/lib/types/habit-tracker"

//=============================================================================
// # HABIT
//=============================================================================

// ## Create

export async function createHabit(
    userId: string,
    title: string,
    description?: string,
    color: HabitColor = 'blue',
    icon: string = 'star',
    frequency: HabitFrequency = 'daily',
    targetCount: number = 1
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

export async function getHabitById(userId: string, id: number): Promise<Schema.Habit | null> {
    const result = await db
        .select()
        .from(Schema.habit)
        .where(and(
            eq(Schema.habit.id, id),
            eq(Schema.habit.user_id, userId),
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
    return await db
        .select()
        .from(Schema.habit)
        .where(and(
            eq(Schema.habit.user_id, userId),
            sql`${Schema.habit.title} ILIKE ${'%' + searchTerm + '%'}`,
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

export async function toggleHabitActive(userId: string, id: number): Promise<boolean | null> {
    const habit = await getHabitById(userId, id)
    if (!habit) return null

    const result = await db
        .update(Schema.habit)
        .set({
            is_active: !habit.is_active,
            updated_at: new Date()
        })
        .where(and(
            eq(Schema.habit.id, id),
            eq(Schema.habit.user_id, userId),
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
    count: number = 1,
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
    userId: string,
    habitId: number,
    startDate?: Date,
    endDate?: Date,
    limit?: number
): Promise<Schema.HabitEntry[]> {
    let whereConditions = and(
        eq(Schema.habitEntry.habit_id, habitId),
        eq(Schema.habitEntry.user_id, userId)
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

export async function getHabitStats(userId: string, habitId: number): Promise<{
    totalCompletions: number;
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
    averagePerPeriod: number;
    lastCompleted: Date | null;
}> {
    const entries = await getHabitEntries(userId, habitId)
    
    if (entries.length === 0) {
        return {
            totalCompletions: 0,
            currentStreak: 0,
            longestStreak: 0,
            completionRate: 0,
            averagePerPeriod: 0,
            lastCompleted: null
        }
    }

    const totalCompletions = entries.reduce((sum, entry) => sum + entry.count, 0)
    const lastCompleted = entries[0]?.date || null

    // Calculate streaks (simplified - consecutive days with entries)
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Sort entries by date ascending for streak calculation
    const sortedEntries = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime())
    
    for (let i = 0; i < sortedEntries.length; i++) {
        const entryDate = new Date(sortedEntries[i].date)
        entryDate.setHours(0, 0, 0, 0)
        
        if (i === 0) {
            tempStreak = 1
        } else {
            const prevDate = new Date(sortedEntries[i - 1].date)
            prevDate.setHours(0, 0, 0, 0)
            const dayDiff = (entryDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
            
            if (dayDiff === 1) {
                tempStreak++
            } else {
                tempStreak = 1
            }
        }
        
        longestStreak = Math.max(longestStreak, tempStreak)
        
        // Calculate current streak (from most recent entries)
        if (i === sortedEntries.length - 1) {
            const daysSinceEntry = (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
            if (daysSinceEntry <= 1) {
                currentStreak = tempStreak
            }
        }
    }

    // Calculate completion rate (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentEntries = entries.filter(entry => entry.date >= thirtyDaysAgo)
    const completionRate = (recentEntries.length / 30) * 100

    // Calculate average per period
    const daysSinceFirstEntry = entries.length > 0 
        ? Math.max(1, (today.getTime() - new Date(entries[entries.length - 1].date).getTime()) / (1000 * 60 * 60 * 24))
        : 1
    const averagePerPeriod = totalCompletions / daysSinceFirstEntry

    return {
        totalCompletions,
        currentStreak,
        longestStreak,
        completionRate: Math.round(completionRate),
        averagePerPeriod: Math.round(averagePerPeriod * 100) / 100,
        lastCompleted
    }
}

export async function getUserHabitStats(userId: string): Promise<{
    totalHabits: number;
    activeHabits: number;
    totalCompletions: number;
    averageCompletionRate: number;
}> {
    const habits = await getUserHabits(userId, false)
    const activeHabits = habits.filter(h => h.is_active)
    
    const allEntries = await getUserHabitEntries(userId)
    const totalCompletions = allEntries.reduce((sum, entry) => sum + entry.count, 0)
    
    // Calculate average completion rate across all active habits
    let totalCompletionRate = 0
    let habitCount = 0
    
    for (const habit of activeHabits) {
        const stats = await getHabitStats(userId, habit.id)
        totalCompletionRate += stats.completionRate
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