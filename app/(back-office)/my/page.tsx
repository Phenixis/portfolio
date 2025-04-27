import { TasksCard } from "@/components/big/tasks/tasks-card"
import Calendar from "@/components/big/calendar/calendar"

export default function DashboardPage() {
    return (
        <div className="flex flex-col md:flex-row md:justify-between w-full">
            <h1 className="text-3xl text-center p-2 md:hidden">
                Dashboard
            </h1>
            <TasksCard className="w-full xl:w-1/3 order-2 md:order-none lg:m-4" limit={5} />
            <Calendar className="order-1 md:order-none"/>
        </div>
    )
}