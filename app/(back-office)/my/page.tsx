import { TasksCard } from "@/components/big/tasks/tasks-card"
import Calendar from "@/components/big/calendar/calendar"
import { NotesCard } from "@/components/big/notes/notes-card"

export default async function DashboardPage() {
    return (
        <div className="flex flex-col md:flex-row md:justify-between w-full">
            <h1 className="text-3xl text-center p-2 md:hidden">
                Dashboard
            </h1>
            <div className="flex flex-col md:order-none order-2 w-full lg:w-1/3 lg:max-h-screen">
                <TasksCard className="w-full lg:m-4" limit={5} />
                <NotesCard className="w-full lg:m-4" limit={5} />
            </div>
            <Calendar className="order-1 md:order-none" />
        </div>
    )
}