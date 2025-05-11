import { verifyRequest } from "@/lib/auth/api"
import { getDailyMoods } from "@/lib/db/queries/dailyMood"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const verification = await verifyRequest(request)
    if ('error' in verification) return verification.error

    const searchParams = request.nextUrl.searchParams
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")

    if (!startDateParam || !endDateParam) {
        const missingParams = [];
        if (!startDateParam) missingParams.push('startDate');
        if (!endDateParam) missingParams.push('endDate');
        return NextResponse.json({ error: `Missing required parameter(s): ${missingParams.join(', ')}` }, { status: 400 })
    }

    try {
        const startDate = new Date(startDateParam);
        const endDate = new Date(endDateParam);
        const result = await getDailyMoods(verification.userId, startDate, endDate)
        return NextResponse.json(result)
    } catch (error) {
        console.error("Error fetching mood:", error)
        return NextResponse.json({ error: "Failed to fetch mood" }, { status: 500 })
    }
}