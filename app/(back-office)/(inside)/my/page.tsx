import DateDisplay from "@/components/big/date"
import Meteo from "@/components/big/meteo"
import Time from "@/components/big/time"
import { TodosCard } from "@/components/big/todos/todosCard"

export default function DashboardPage() {
    return (
        <div className="flex w-full gap-4">
            <TodosCard className="w-1/3" limit={5} />
            <div className="w-1/3">
                <Time className="text-7xl" />
                <DateDisplay className="text-2xl" />
                <Meteo className="" />
            </div>
        </div>
    )
}