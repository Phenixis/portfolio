import {
    searchProjects
} from "@/lib/db/queries"
import {
    type Project
} from "@/lib/db/schema"
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
        const projects = await searchProjects(query, limit)
        return NextResponse.json(projects)
    } catch (error) {
        console.error("Error fetching projects:", error)
        return NextResponse.json({
            error: "Failed to fetch projects"
        }, {
            status: 500
        })
    }
}