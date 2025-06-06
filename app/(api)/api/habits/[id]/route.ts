import { NextRequest, NextResponse } from "next/server"
import { verifyRequest } from "@/lib/auth/api"
import { updateHabit, deleteHabit, getHabitById } from "@/lib/db/queries/habit-tracker"

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const verification = await verifyRequest(request)
        if ('error' in verification) return verification.error

        const habitId = parseInt(params.id)
        
        if (isNaN(habitId)) {
            return NextResponse.json(
                { success: false, error: "Invalid habit ID" },
                { status: 400 }
            )
        }

        // Check if habit exists and belongs to user
        const existingHabit = await getHabitById(verification.userId, habitId)
        
        if (!existingHabit) {
            return NextResponse.json(
                { success: false, error: "Habit not found or access denied" },
                { status: 404 }
            )
        }

        const body = await request.json()
        
        const habit = await updateHabit(
            verification.userId,
            habitId,
            body.title,
            body.description,
            body.color,
            body.icon,
            body.frequency,
            body.target_count,
            body.is_active
        )
        
        return NextResponse.json({
            success: true,
            data: habit
        })
    } catch (error) {
        console.error("Error updating habit:", error)
        return NextResponse.json(
            { success: false, error: "Failed to update habit" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const verification = await verifyRequest(request)
        if ('error' in verification) return verification.error

        const habitId = parseInt(params.id)
        
        if (isNaN(habitId)) {
            return NextResponse.json(
                { success: false, error: "Invalid habit ID" },
                { status: 400 }
            )
        }

        // Check if habit exists and belongs to user
        const existingHabit = await getHabitById(verification.userId, habitId)
        
        if (!existingHabit) {
            return NextResponse.json(
                { success: false, error: "Habit not found or access denied" },
                { status: 404 }
            )
        }

        await deleteHabit(verification.userId, habitId)
        
        return NextResponse.json({
            success: true,
            message: "Habit deleted successfully"
        })
    } catch (error) {
        console.error("Error deleting habit:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete habit" },
            { status: 500 }
        )
    }
}
