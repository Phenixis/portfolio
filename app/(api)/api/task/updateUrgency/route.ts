import {
    getUncompletedTasks,
    updateTaskUrgency,
  } from "@/lib/db/queries"
  import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const tasks = await getUncompletedTasks();
        
        for (const task of tasks) {
            const result = await updateTaskUrgency(task.id);

            if (!result) {
                throw new Error(`Task ${task.id} urgency update failed`);
            }
        }

        return NextResponse.json({ message: "Tasks urgency updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update tasks" }, { status: 500 })
    }
}