// filepath: /home/etudiant/Documents/portfolio/components/big/tasks/task-actions.ts
"use client";

import { updateTaskFilterCookie } from "@/lib/cookies";
import type { TaskFilterCookie } from "@/lib/flags";

/**
 * Client action to update the task filter cookie
 * Provides a client-side wrapper for the server action
 */
export async function updateTaskFilterCookieFromClient(cookie: TaskFilterCookie): Promise<void> {
    // Convert Date object to string if it exists
    const cookieToSave: TaskFilterCookie = {
        ...cookie,
        // Make sure we're storing a string in the cookie instead of a Date object
        dueBeforeDate: cookie.dueBeforeDate ? cookie.dueBeforeDate : undefined
    };
    
    return updateTaskFilterCookie(cookieToSave);
}