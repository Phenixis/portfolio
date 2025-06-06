import { TasksCard } from "@/components/big/tasks/tasks-card"
import Calendar from "@/components/big/calendar/calendar"
import { NotesCard } from "@/components/big/notes/notes-card"
import HabitWidget from "@/components/big/habit-tracker/habit-widget"
import { getTaskFilterCookie } from "@/lib/cookies"

export default async function DashboardPage() {
    // Get task filter cookie from server
    const taskFilterCookie = await getTaskFilterCookie()
    
    return (
        <div className="flex flex-col md:flex-row md:justify-between w-full h-full">
            <h1 className="w-full text-3xl text-center p-2 md:hidden">
                Life OS
            </h1>
            <div className="flex flex-col order-2 md:order-0 md:max-h-screen w-full h-full lg:w-1/3">
                <TasksCard 
                    className="w-full lg:m-4" 
                    limit={5} 
                    initialTaskFilterCookie={taskFilterCookie}
                />
                <NotesCard className="w-full lg:m-4" limit={5} />
                <HabitWidget className="w-full lg:m-4" />
            </div>
            <Calendar className="order-1 md:order-0" />
        </div>
    )
}