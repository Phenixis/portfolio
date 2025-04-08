import {
    getProject,
    getProjects,
    getCompletedProjects,
    getUncompletedProjects,
    createProject,
    updateProject,
    deleteProject
} from '@/lib/db/queries';
import type { Project } from '@/lib/db/schema';
import { type NextRequest, NextResponse } from 'next/server';

// GET - Récupérer les projets
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const projectTitle = searchParams.get('projectTitle');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number.parseInt(limitParam) : undefined;
    const completed = searchParams.get('completed');
    const projects = projectTitle ?
    await getProject(projectTitle) :
    completed == "true" ? await getCompletedProjects(limit) : completed == "false" ? await getUncompletedProjects(limit) : await getProjects(limit);

    return NextResponse.json(projects);
}

// POST - Créer un nouveau projet
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description } = body;

        // Validation
        if (!title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const projectId = await createProject(title, description);

        return NextResponse.json({ id: projectId }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}