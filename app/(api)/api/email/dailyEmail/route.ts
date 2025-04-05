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
            <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-100 flex justify-center items-center min-h-screen">
            <main class="max-w-3xl w-full mx-auto my-5 p-5 bg-white rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold text-blue-500 mb-4">Your Daily Todo List</h1>
        `;

        for (const [day, projects] of Object.entries(groupedByProjects)) {
            emailContent += `<h2 class="text-xl font-semibold text-gray-700 mt-4">Due ${day}</h2>`;
            for (const [project, todos] of Object.entries(projects)) {
                emailContent += `<h3 class="text-lg font-medium text-gray-600 mt-2">${project}</h3><ul class="list-disc pl-5">`;
                (todos as any[]).forEach((todo) => {
                    emailContent += `<li class="text-gray-800">${todo.title}</li>`;
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