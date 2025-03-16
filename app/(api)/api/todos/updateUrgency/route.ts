import {
    getUncompletedTodos,
    updateTodoUrgency,
  } from "@/lib/db/queries"
  import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const todos = await getUncompletedTodos();
        
        for (const todo of todos) {
            const result = await updateTodoUrgency(todo.id);

            if (!result) {
                throw new Error(`Todo ${todo.id} urgency update failed`);
            }
        }

        return NextResponse.json({ message: "Todos urgency updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update todos" }, { status: 500 })
    }
}