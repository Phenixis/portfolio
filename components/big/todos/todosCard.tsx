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
import Link from "next/link"
import {
    type Todo
} from "@/lib/db/schema"

export function TodosCard({
    className,
    completed,
    limit,
    orderBy,
    orderingDirection,
}: {
    className: string,
    completed?: boolean,
    limit?: number,
    orderBy?: keyof Todo,
    orderingDirection?: "asc" | "desc",
}) {
    function generateTitle(completed?: boolean, limit?: number, orderBy?: keyof Todo) {
        let title = "";

        if (limit) {
            title += `The top ${limit} `;
        }

        if (orderBy) {
            switch (orderBy) {
                case "importance":
                    title += orderingDirection === "asc" ? "least important " : "most important ";
                    break;
                case "duration":
                    title += orderingDirection === "asc" ? "shortest " : "longest ";
                    break;
                case "urgency":
                    title += orderingDirection === "asc" ? "least urgent " : "most urgent ";
                    break;
                case "score":
                    title += orderingDirection === "asc" ? "lowest scoring " : "highest scoring ";
                    break;
                case "created_at":
                    title += orderingDirection === "asc" ? "oldest " : "newest ";
                    break;
                case "completed_at":
                    title += orderingDirection === "asc" ? "earliest " : "latest ";
                    break;
                // Add more cases as needed
                default:
                    title += `${orderBy} `;
                    break;
            }
        }

        if (completed) {
            if (limit || orderBy) {
                title += "completed ";
            } else {
                title += "Completed ";
            }
        }

        title += "Todos";
        return title.trim();
    }

    const completedFilter = completed || orderBy === "completed_at";

    return (
        <Card className={cn(`w-full max-w-xl group/TodoCard`, className)}>
            <CardHeader className="flex flex-row items-center justify-between">
                <Link href={`/my/todos`}>
                    <CardTitle>
                        {generateTitle(completedFilter, limit, orderBy)}
                    </CardTitle>
                </Link>
                <TodoModal className="opacity-0 duration-300 group-hover/TodoCard:opacity-100" />
            </CardHeader>
            <CardContent>
                <CardDescription>
                    <Todos limit={limit} completed={completedFilter} orderBy={orderBy} orderingDirection={orderingDirection} />
                </CardDescription>
            </CardContent>
        </Card>
    )
}