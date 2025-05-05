import { NextRequest, NextResponse } from "next/server"
import { Note, NewNote } from "@/lib/db/schema"
import { verifyRequest } from "@/lib/auth/api"
import { getNotes, createNote, updateNote, deleteNote } from "@/lib/db/queries/note"

export async function GET(request: NextRequest) {
	const verification = await verifyRequest(request)
	if ('error' in verification) return verification.error

    const searchParams = request.nextUrl.searchParams
    const title = searchParams.get("title") || undefined
    const project_title = searchParams.get("project_title") || undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : undefined

    try {
        const notes = await getNotes(verification.userId, title, project_title, limit)
        return NextResponse.json(notes)
    } catch (error) {
        console.error("Error fetching notes:", error)
        return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const verification = await verifyRequest(request)
    if ('error' in verification) return verification.error
    
    const body = await request.json()
    const { title, content, project_title } = await request.json()

    try {
        const note = await createNote(verification.userId, title, content, project_title)
        return NextResponse.json(note)
    } catch (error) {
        console.error("Error creating note:", error)
        return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    const verification = await verifyRequest(request)
    if ('error' in verification) return verification.error
    
    const { id, title, content, project_title } = await request.json()

    try {
        const note = await updateNote(verification.userId, id, title, content, project_title)
        return NextResponse.json(note)
    } catch (error) {
        console.error("Error updating note:", error)
        return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const verification = await verifyRequest(request)
    if ('error' in verification) return verification.error
    
    const { id } = await request.json()

    try {
        const note = await deleteNote(verification.userId, id)
        return NextResponse.json(note)
    } catch (error) {
        console.error("Error deleting note:", error)
        return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
    }
}