import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Todos from "@/components/big/todos/todos"
import { TodoModal } from "@/components/big/todos/todoModal"
import { cn } from "@/lib/utils"

export function TodosCard({
    className
}: {
    className: string
}) {
    return (
        <Card className={cn(`w-full max-w-xl group/TodoCard`, className)}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Todos</CardTitle>
                <TodoModal className="opacity-0 duration-300 group-hover/TodoCard:opacity-100" />
            </CardHeader>
            <CardContent>
                <CardDescription>
                    <Todos />
                </CardDescription>
            </CardContent>
        </Card>
    )
}