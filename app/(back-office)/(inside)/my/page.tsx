import { TodosCard } from "@/components/big/todos/todosCard"

export default function DashboardPage() {
    return (
        <div>
            <div className="flex">
                <TodosCard className="w-1/2" limit={5}/>
            </div>
        </div>
    )
}