"use server"

import {
    desc,
    asc,
    eq,
    isNull,
    isNotNull,
    sql,
    and,
    or,
    lte,
    inArray,
    not
} from "drizzle-orm"
import { db } from "../drizzle"
import * as Schema from "../schema"

export async function getNotes(userId: string, title?: string, projectTitle?: string, limit: number = 50) {
    const notes = await db.select().from(Schema.note).where(
        and(
            isNull(Schema.note.deleted_at),
            eq(Schema.note.user_id, userId),
            title ? eq(Schema.note.title, title) : undefined,
            projectTitle ? eq(Schema.note.project_title, projectTitle) : undefined
        )
    ).orderBy(asc(Schema.note.title)).limit(limit)

    return notes
}

export async function createNote(userId: string, title: string, content: string, projectTitle?: string, salt?: string, iv?: string) {
    const note = await db.insert(Schema.note).values({
        user_id: userId,
        title,
        content,
        project_title: projectTitle,
        salt,
        iv
    })

    return note
}

export async function updateNote(userId: string, id: number, title: string, content: string, projectTitle?: string, salt?: string, iv?: string) {
    const note = await db.update(Schema.note).set({
        title,
        content,
        project_title: projectTitle,
        salt,
        iv
    }).where(and(eq(Schema.note.id, id), eq(Schema.note.user_id, userId)))

    return note
}

export async function deleteNote(userId: string, id: number) {
    const note = await db.update(Schema.note).set({
        deleted_at: new Date()
    }).where(and(eq(Schema.note.id, id), eq(Schema.note.user_id, userId)))

    return note
}