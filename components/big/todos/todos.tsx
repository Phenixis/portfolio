import { getTodos } from '@/lib/db/queries'
import TodoDisplay from './todoDisplay'
import { Suspense } from "react"

export default async function Todos({ limit }: { limit?: number }) {
    const todos = await getTodos(limit);

    return (
        <Suspense fallback={
            Array(5).fill(null).map((_, i) => (
                <TodoDisplay key={i} />
            ))
        }>
            {
                todos.map(todo => (
                    <TodoDisplay key={todo.id} todo={todo} />
                ))
            }
        </Suspense>
    )
}