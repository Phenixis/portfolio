import { type NextRequest, NextResponse } from "next/server"
import type * as Schema from "@/lib/db/schema"
import { createWorkout, updateWorkout, getAllWorkouts } from "@/lib/db/queries"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderBy = (searchParams.get("orderBy") as keyof Schema.Workout) || "date"
    const orderingDirection = (searchParams.get("orderingDirection") as "asc" | "desc") || "desc"
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const withSeance = searchParams.get("withSeance") === "true"

    // This is a placeholder - you'll need to implement a function to get workouts with their seances
    const workouts = await getAllWorkouts()

    return NextResponse.json(workouts)
  } catch (error) {
    console.error("Error fetching workouts:", error)
    return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { date, note, seance_id } = await request.json()

    const workoutId = await createWorkout(new Date(date), seance_id)

    return NextResponse.json({ id: workoutId })
  } catch (error) {
    console.error("Error creating workout:", error)
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, date, note, seance_id } = await request.json()

    const workoutId = await updateWorkout(id, note, seance_id)

    return NextResponse.json({ id: workoutId })
  } catch (error) {
    console.error("Error updating workout:", error)
    return NextResponse.json({ error: "Failed to update workout" }, { status: 500 })
  }
}

