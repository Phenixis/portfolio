import { NextRequest, NextResponse } from "next/server"
import { verifyRequest } from "@/lib/auth/api"
import { createHabit, getUserHabits } from "@/lib/db/queries/habit-tracker"

export async function GET(request: NextRequest) {
    try {
        const verification = await verifyRequest(request)
        if ('error' in verification) return verification.error

        const habits = await getUserHabits(verification.userId)
        
        return NextResponse.json(habits)
    } catch (error) {
        console.error("Error fetching habits:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch habits" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const verification = await verifyRequest(request)
        if ('error' in verification) return verification.error

        const body = await request.json()
        
        // Validate required fields
        if (!body.title || !body.frequency) {
            return NextResponse.json(
                { success: false, error: "Title and frequency are required" },
                { status: 400 }
            )
        }

        const habit = await createHabit(
            verification.userId,
            body.title,
            body.description,
            body.color,
            body.icon,
            body.frequency,
            body.target_count
        )
        
        return NextResponse.json({
            success: true,
            data: habit
        })
    } catch (error) {
        console.error("Error creating habit:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create habit" },
            { status: 500 }
        )
    }
}
