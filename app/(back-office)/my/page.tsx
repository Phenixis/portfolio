import { TasksCard } from "@/components/big/tasks/tasks-card"
import { SWRConfig } from "swr"
import { getTop5UncompletedTasksCached } from "@/lib/server/getTopTasksCached"
import Calendar from "@/components/big/calendar/calendar"
import { getUser } from "@/lib/db/queries/user"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const user = await getUser()
    if (!user) {
        redirect("/login")
    }
    const tasks = await getTop5UncompletedTasksCached(user.id)

    const params = {
        completed: false,
        orderBy: "score",
        orderingDirection: "desc",
        limit: 6, // your code uses limit+1
        withProject: true,
    }

    const swrKey = JSON.stringify([
        `/api/task?${new URLSearchParams(params as any).toString()}`,
        user.api_key,
    ])

    return (
        <div className="flex flex-col md:flex-row md:justify-between w-full">
            <h1 className="text-3xl text-center p-2 md:hidden">
                Dashboard
            </h1>
            <SWRConfig value={{ fallback: { [swrKey]: tasks } }}>
                <TasksCard className="w-full lg:w-1/3 order-2 md:order-none lg:m-4" limit={5} />
            </SWRConfig>
            <Calendar className="order-1 md:order-none" />
        </div>
    )
}