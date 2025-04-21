import {
    searchTasksByTitle
} from "@/lib/db/queries"
import {
    type NextRequest,
    NextResponse
} from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")

    if (!query) {
        return NextResponse.json({
            error: "Missing 'query' parameter"
        }, {
            status: 400
        })
    }

    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam) : undefined

    try {
        const tasks = await searchTasksByTitle(query, limit)
        return NextResponse.json(tasks)
    } catch (error) {
        console.error("Error fetching tasks:", error)
        return NextResponse.json({
            error: "Failed to fetch tasks"
        }, {
            status: 500
        })
    }
}