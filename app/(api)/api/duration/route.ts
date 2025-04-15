import { db } from "@/lib/db/drizzle"
import * as Schema from "@/lib/db/schema"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const durations = await db.select().from(Schema.duration)
        return NextResponse.json(durations)
    } catch (error) {
        console.error("Error fetching durations:", error);
        return NextResponse.json({ error: "Failed to fetch durations" }, { status: 500 })
    }
}