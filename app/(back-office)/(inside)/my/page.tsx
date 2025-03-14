import DateDisplay from "@/components/big/date"
import Meteo from "@/components/big/meteo"
import Time from "@/components/big/time"
import { TodosCard } from "@/components/big/todos/todosCard"

export default function DashboardPage() {
    return (
        <div className="flex flex-col md:flex-row w-full gap-4">
            <TodosCard className="w-full xl:w-1/3 order-2 md:order-none" limit={5} />
            <div className="w-full xl:w-1/3 order-1 md:order-none">
                <Time className="text-7xl" />
                <DateDisplay className="text-2xl" />
                <Meteo className="" />
            </div>
        </div>
    )
}