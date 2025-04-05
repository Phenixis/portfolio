import { TodosCard } from "@/components/big/todos/todosCard"
import Calendar from "@/components/big/calendar/calendar"

export default function DashboardPage() {
    return (
        <div className="flex flex-col md:flex-row w-full">
            <TodosCard className="w-full xl:w-1/3 order-2 md:order-none" limit={5} />
            <Calendar />
        </div>
    )
}