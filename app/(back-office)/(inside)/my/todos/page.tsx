import { TodosCard } from "@/components/big/todos/todosCard"
import AverageCompletionTime from "@/components/big/todos/charts/averageCompletionTime"

export default function TodosPage() {
    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="w-full h-1/2 flex flex-col lg:flex-row space-x-4">
                <TodosCard className="max-w-full lg:max-w-xl" orderBy="score" />
                <AverageCompletionTime />
            </div>
            <div className="w-full h-1/2 flex space-x-4">
                <TodosCard className="max-w-full" orderBy="importance" />
                <TodosCard className="max-w-full" orderBy="urgency" />
                <TodosCard className="max-w-full" orderBy="duration" orderingDirection="asc" />
            </div>
        </div>
    )
}