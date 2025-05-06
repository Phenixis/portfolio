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

export async function getNotes(
    userId: string,
    title?: string,
    projectTitle?: string,
    limit: number = 25,
    page: number = 1,
    projectTitles?: string[],
    excludedProjectTitles?: string[]
) {
    // Get total count
    const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(Schema.note)
        .where(
            and(
                isNull(Schema.note.deleted_at),
                eq(Schema.note.user_id, userId),
                title ? sql`LOWER(${Schema.note.title}) LIKE LOWER(${'%' + title + '%'})` : undefined,
                projectTitle ? (and(
                    isNotNull(Schema.note.project_title),
                    sql`LOWER(${Schema.note.project_title}) LIKE LOWER(${'%' + projectTitle + '%'})`,
                    )
                ) : undefined,
                projectTitles && projectTitles.length > 0 ? inArray(Schema.note.project_title, projectTitles) : undefined,
                excludedProjectTitles && excludedProjectTitles.length > 0 ? not(inArray(Schema.note.project_title, excludedProjectTitles)) : undefined
            )
        )

    // Get paginated notes
    const notes = await db.select().from(Schema.note).where(
        and(
            isNull(Schema.note.deleted_at),
            eq(Schema.note.user_id, userId),
            title ? sql`LOWER(${Schema.note.title}) LIKE LOWER(${'%' + title + '%'})` : undefined,
            projectTitle ? (and(
                isNotNull(Schema.note.project_title),
                sql`LOWER(${Schema.note.project_title}) LIKE LOWER(${'%' + projectTitle + '%'})`
            )) : undefined,
            projectTitles && projectTitles.length > 0 ? (
                projectTitles.includes("No project")
                    ? or(
                        inArray(Schema.note.project_title, projectTitles.filter(p => p !== "No project")),
                        isNull(Schema.note.project_title)
                    )
                    : inArray(Schema.note.project_title, projectTitles)
            ) : undefined,
            excludedProjectTitles && excludedProjectTitles.length > 0 ? (
                excludedProjectTitles.includes("No project")
                    ? and(
                        not(inArray(Schema.note.project_title, excludedProjectTitles.filter(p => p !== "No project"))),
                        isNotNull(Schema.note.project_title)
                    )
                    : or(
                        not(inArray(Schema.note.project_title, excludedProjectTitles)),
                        isNull(Schema.note.project_title)
                    )
            ) : undefined
        )
    )
        .orderBy(desc(Schema.note.created_at))
        .offset((page - 1) * limit)
        .limit(limit)

    return {
        notes,
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        limit
    }
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