import {
    getUncompletedAndDueInTheNextThreeDaysOrLessTodos
} from "@/lib/db/queries"
import {
    type NextRequest,
    NextResponse
} from "next/server"
import {
    sendEmail
} from "@/components/utils/send_email"

export async function GET(request: NextRequest) {
    try {
        const todos = await getUncompletedAndDueInTheNextThreeDaysOrLessTodos(true)
        const groupedTodos = todos.reduce((acc: Record<string, Record<string, typeof todos>>, todo) => {
            const dueDate = new Date(todo.due);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let group;
            if (diffDays < 0) {
                group = "Overdue";
            } else if (diffDays === 0) {
                group = "Due Today";
            } else if (diffDays <= 3) {
                group = "Due in the Next 3 Days";
            } else {
                group = "Later";
            }

            const dayKey = dueDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });

            if (!acc[group]) {
                acc[group] = {};
            }
            if (!acc[group][dayKey]) {
                acc[group][dayKey] = [];
            }
            acc[group][dayKey].push(todo);
            return acc;
        }, {});

        // Sort todos by due date
        Object.values(groupedTodos).forEach(days => {
            Object.values(days).forEach(tasks => {
                tasks.sort((a, b) => {
                    const dateA = new Date(a.due).getTime();
                    const dateB = new Date(b.due).getTime();
                    return dateA - dateB;
                });
            });
        });

        const emailContent = `
            <html>
            <head>
            <style>
            body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            }
            h1 {
            color: #0070f3;
            }
            ul {
            padding-left: 20px;
            }
            li {
            margin-bottom: 10px;
            }
            </style>
            </head>
            <body>
            ${Object.entries(groupedTodos).map(([group, days]) => `
            <h2>${group}</h2>
            ${Object.entries(days).map(([day, tasks]) => `
            <h3>${day}</h3>
            <ul>
            ${tasks.map(todo => `
            <li>
            <strong>${todo.title}</strong> (${todo.project_title}) - Due: ${new Date(todo.due).toLocaleDateString()}
            </li>
            `).join("")}
            </ul>
            `).join("")}
            `).join("")}
            </body>
            </html>
        `;

        const result = sendEmail("max@maximeduhamel.com", "Your Daily Todo List", emailContent);

        console.log(result);
        
        if (!result) {
            return NextResponse.json({
                error: "Failed to send email"
            }, {
                status: 500
            });
        }

        return NextResponse.json({
            message: "Email sent successfully"
        }, {
            status: 200
        });
    } catch (error) {
        console.error("Error fetching projects:", error)
        return NextResponse.json({
            error: "Failed to fetch projects"
        }, {
            status: 500
        })
    }
}