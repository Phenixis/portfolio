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
        const todos = await getUncompletedAndDueInTheNextThreeDaysOrLessTodos(true);

        // Sort todos by due date in ascending order
        const sortedTodos = todos.sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

        // Group todos by days
        const groupedByDays = sortedTodos.reduce((acc: Record<string, any[]>, todo) => {
            const day = new Date(todo.due).toLocaleDateString("en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(todo);
            return acc;
        }, {});

        // Group todos by projects within each day
        const groupedByProjects = Object.entries(groupedByDays).reduce((acc: Record<string, any>, [day, todos]) => {
            acc[day] = (todos as any[]).reduce((projectAcc: Record<string, any[]>, todo) => {
                const project = todo.project_title || "No Project";
                if (!projectAcc[project]) {
                    projectAcc[project] = [];
                }
                projectAcc[project].push(todo);
                return projectAcc;
            }, {});
            return acc;
        }, {});

        // Generate email content
        let emailContent = `
            <html>
            <head>
            <style>
            body {
                background-color: #f3f4f6;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
            }
            main {
                max-width: 768px;
                width: 100%;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
                font-size: 1.5rem;
                font-weight: bold;
                color: #3b82f6;
                margin-bottom: 16px;
            }
            h2 {
                font-size: 1.25rem;
                font-weight: 600;
                color: #374151;
                margin-top: 16px;
            }
            h3 {
                font-size: 1.125rem;
                font-weight: 500;
                color: #4b5563;
                margin-top: 8px;
            }
            ul {
                list-style-type: disc;
                padding-left: 20px;
            }
            li {
                color: #1f2937;
            }
            </style>
            </head>
            <body>
            <main>
            <h1>Your Daily Todo List</h1>
        `;

        for (const [day, projects] of Object.entries(groupedByProjects)) {
            emailContent += `<h2>Due ${day}</h2>`;
            for (const [project, todos] of Object.entries(projects)) {
            emailContent += `<h3>${project}</h3><ul>`;
            (todos as any[]).forEach((todo) => {
                emailContent += `<li>${todo.title}</li>`;
            });
            emailContent += `</ul>`;
            }
        }

        emailContent += `
            </main>
            </body>
            </html>
        `;

        const today = new Date();
        const formattedSubject = `${today.toLocaleDateString("en-GB", { weekday: 'long', day: '2-digit', month: 'long' })} - Your Daily Todo List`;
        const result = sendEmail("max@maximeduhamel.com", formattedSubject, emailContent);

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
        console.error("Error fetching todos:", error);
        return NextResponse.json({
            error: "Failed to fetch todos"
        }, {
            status: 500
        });
    }
}