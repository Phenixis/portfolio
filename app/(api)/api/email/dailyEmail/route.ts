import {
    getUncompletedAndDueInTheNextThreeDaysOrLessTasks,
} from "@/lib/db/queries"
import {
    type NextRequest,
    NextResponse
} from "next/server"
import {
    sendEmail
} from "@/components/utils/send_email"
import { verifyRequest } from "@/lib/auth/api"
import { getUser, getAllUsers } from "@/lib/db/queries/user"

export async function GET(request: NextRequest) {
    const verification = await verifyRequest(request)
    if ('error' in verification) return verification.error
    if (verification.userId !== "cron") {
        return NextResponse.json({
            error: "Unauthorized"
        }, {
            status: 401
        })
    }

    const users = await getAllUsers()

    for (const user of users) {
        try {
            const tasks = await getUncompletedAndDueInTheNextThreeDaysOrLessTasks(user.id);

            // Sort tasks by due date in ascending order
            const sortedTasks = tasks.sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

            // Helper function to calculate relative days
            const getRelativeDay = (dueDate: Date): string => {
                const today = new Date();
                const diffInDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
                return rtf.format(diffInDays, "day");
            };

            // Group tasks by relative days
            const groupedByDays = sortedTasks.reduce((acc: Record<string, any[]>, task) => {
                const relativeDay = getRelativeDay(new Date(task.due));
                if (!acc[relativeDay]) {
                    acc[relativeDay] = [];
                }
                acc[relativeDay].push(task);
                return acc;
            }, {});

            // Group tasks by projects within each relative day
            const groupedByProjects = Object.entries(groupedByDays).reduce((acc: Record<string, any>, [day, tasks]) => {
                acc[day] = (tasks as any[]).reduce((projectAcc: Record<string, any[]>, task) => {
                    const project = task.project_title || "No Project";
                    if (!projectAcc[project]) {
                        projectAcc[project] = [];
                    }
                    projectAcc[project].push(task);
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
                color: #000000;
                margin-bottom: 16px;
                text-align: center;
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
                margin: 0;
            }
            li {
                color: #1f2937;
                margin-bottom: 8px;
            }
            @media (max-width: 600px) {
                main {
                    padding: 10px;
                }
                h1 {
                    font-size: 1.25rem;
                }
                h2 {
                    font-size: 1rem;
                }
                h3 {
                    font-size: 0.875rem;
                }
                ul {
                    padding-left: 15px;
                }
                li {
                        font-size: 0.875rem;
                    }
                }
            </style>
            </head>
            <body>
            <main>
            <h1>Your Daily Task List</h1>
        `;

            for (const [day, projects] of Object.entries(groupedByProjects)) {
                emailContent += `<h2>Due ${day}</h2>`;
                for (const [project, tasks] of Object.entries(projects)) {
                    emailContent += `<h3>${project}</h3><ul>`;
                    (tasks as any[]).forEach((task) => {
                        emailContent += `<li>${task.title}</li>`;
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
            const formattedSubject = `${today.toLocaleDateString("en-GB", { weekday: 'long', day: '2-digit', month: 'long' })} - Your Daily Task List`;
            const result = sendEmail(user.email, formattedSubject, emailContent);

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
            console.error("Error fetching tasks:", error);
            return NextResponse.json({
                error: "Failed to fetch tasks"
            }, {
                status: 500
            });
        }
    }
}