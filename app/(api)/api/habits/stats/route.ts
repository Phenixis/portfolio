import { NextResponse, NextRequest } from "next/server"
import * as HabitQueries from "@/lib/db/queries/habits"
import { verifyRequest } from "@/lib/auth/api"

// Get overall user habit statistics
export async function GET(request: NextRequest) {
    try {
        const { error, userId } = await verifyRequest(request)
        if (error) return error

        const stats = await HabitQueries.getUserHabitStats(userId)

        return NextResponse.json({ stats })
    } catch (error) {
        console.error('Error fetching user habit stats:', error)
        return NextResponse.json(
            { error: "Failed to fetch user habit stats" },
            { status: 500 }
        )
    }
}
