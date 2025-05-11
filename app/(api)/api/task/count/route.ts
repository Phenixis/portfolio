import { verifyRequest } from "@/lib/auth/api"
import { getNumberOfTasks } from "@/lib/db/queries"
import { NextRequest, NextResponse } from "next/server"

// GET - Récupérer les count de tasks
export async function GET(request: NextRequest) {
	const verification = await verifyRequest(request)
	if ('error' in verification) return verification.error

	const searchParams = request.nextUrl.searchParams
	const completedParam = searchParams.get("completed")
	const projectTitles = searchParams.get("projectTitles")
		? searchParams.get("projectTitles")?.split(",")
		: undefined
	const excludedProjectTitles = searchParams.get("excludedProjectTitles")
		? searchParams.get("excludedProjectTitles")?.split(",")
		: undefined
        const dueBefore = searchParams.get("dueBefore")
            ? new Date(searchParams.get("dueBefore") as string)
            : undefined
	let completed: boolean | undefined = completedParam === "true" ? true : completedParam === "false" ? false : undefined

	try {
		const result = await getNumberOfTasks(verification.userId, completed, projectTitles, excludedProjectTitles, dueBefore)

		return NextResponse.json(result)
	} catch (error) {
		console.error("Error fetching tasks:", error)
		return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
	}
}