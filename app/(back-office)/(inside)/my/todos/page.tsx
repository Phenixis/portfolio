import { TodosCard } from "@/components/big/todos/todosCard"

export default function TodosPage() {
    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="w-full h-1/2 flex space-x-4">
                <TodosCard orderBy="score" limit={5} />
                <div className="bg-gray-500 h-full w-full" />
            </div>
            <div className="w-full h-1/2 flex space-x-4">
                <TodosCard className="max-w-full" orderBy="importance" />
                <TodosCard className="max-w-full" orderBy="urgency" />
                <TodosCard className="max-w-full" orderBy="duration" orderingDirection="asc" />
            </div>
        </div>
    )
}