import { NextRequest, NextResponse } from "next/server"
import { verifyRequest } from "@/lib/auth/api"
import { db } from "@/lib/db/drizzle"
import { habitEntry, habit } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(request: NextRequest) {
    try {
        const verification = await verifyRequest(request)
        if ('error' in verification) return verification.error

        const { userId } = verification
        const { searchParams } = new URL(request.url)
        const habitId = searchParams.get('habit_id')

        // Build the where conditions array
        const whereConditions = [eq(habitEntry.user_id, userId)]
        
        if (habitId) {
            whereConditions.push(eq(habitEntry.habit_id, parseInt(habitId)))
        }

        const entries = await db.select()
            .from(habitEntry)
            .where(and(...whereConditions))
            .orderBy(habitEntry.date)
            .execute()

        return NextResponse.json({
            success: true,
            data: entries
        })
    } catch (error) {
        console.error("Error fetching habit entries:", error)
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const verification = await verifyRequest(request)
        if ('error' in verification) return verification.error

        const { userId } = verification

        const body = await request.json()
        const { habit_id, date, count = 1, notes } = body

        if (!habit_id || !date) {
            return NextResponse.json({
                success: false,
                error: "Missing required fields: habit_id and date"
            }, { status: 400 })
        }

        // Validate habit_id is a positive integer
        const habitIdNum = parseInt(habit_id)
        if (isNaN(habitIdNum) || habitIdNum <= 0) {
            return NextResponse.json({
                success: false,
                error: "habit_id must be a valid positive integer"
            }, { status: 400 })
        }

        // Validate count is a positive number
        if (typeof count !== 'number' || count <= 0) {
            return NextResponse.json({
                success: false,
                error: "count must be a positive number"
            }, { status: 400 })
        }

        // Normalize the date to avoid timezone issues
        let entryDate: Date
        try {
            entryDate = new Date(date)
            if (isNaN(entryDate.getTime())) {
                throw new Error("Invalid date")
            }
            entryDate.setUTCHours(0, 0, 0, 0) // Set to start of day in UTC
        } catch (error) {
            console.error("Error parsing date:", error)
            return NextResponse.json({
                success: false,
                error: "Invalid date format"
            }, { status: 400 })
        }

        // Verify that the habit exists and belongs to the user
        const habitExists = await db.select({ id: habit.id })
            .from(habit)
            .where(
                and(
                    eq(habit.id, habitIdNum),
                    eq(habit.user_id, userId)
                )
            )
            .limit(1)
            .execute()

        if (habitExists.length === 0) {
            return NextResponse.json({
                success: false,
                error: "Habit not found or access denied"
            }, { status: 404 })
        }

        // Check if entry for this habit and date already exists
        const existingEntry = await db.select()
            .from(habitEntry)
            .where(
                and(
                    eq(habitEntry.habit_id, habitIdNum),
                    eq(habitEntry.user_id, userId),
                    eq(habitEntry.date, entryDate)
                )
            )
            .limit(1)
            .execute()

        if (existingEntry.length > 0) {
            // Update existing entry
            const [updatedEntry] = await db.update(habitEntry)
                .set({
                    count: existingEntry[0].count + count,
                    notes: notes || existingEntry[0].notes,
                    updated_at: new Date()
                })
                .where(eq(habitEntry.id, existingEntry[0].id))
                .returning()
                .execute()

            return NextResponse.json({
                success: true,
                data: updatedEntry,
                message: "Habit entry updated"
            })
        } else {
            // Create new entry
            const [newEntry] = await db.insert(habitEntry)
                .values({
                    habit_id: habitIdNum,
                    user_id: userId,
                    date: entryDate,
                    count,
                    notes
                })
                .returning()
                .execute()

            return NextResponse.json({
                success: true,
                data: newEntry,
                message: "Habit entry created"
            })
        }
    } catch (error) {
        console.error("Error creating/updating habit entry:", error)
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 })
    }
}
