import { TasksCard } from "@/components/big/tasks/tasks-card"
import Calendar from "@/components/big/calendar/calendar"
import { NotesCard } from "@/components/big/notes/notes-card"

export default async function DashboardPage() {
    return (
        <div className="flex flex-col md:flex-row md:justify-between w-full h-full">
            <h1 className="text-3xl text-center p-2 md:hidden">
                Dashboard
            </h1>
            <div className="flex flex-col order-2 md:order-none md:max-h-screen w-full h-full lg:w-1/3">
                <TasksCard className="w-full lg:m-4" limit={5} />
                <NotesCard className="w-full lg:m-4" limit={5} />
            </div>
            <Calendar className="order-1 md:order-none" />
        </div>
    )
}