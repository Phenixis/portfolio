"use server";

import { ActionState } from '@/middleware';
import { redirect } from 'next/navigation'
import { removeSession, setSession } from '@/lib/auth/session';

export async function login(prevState: ActionState, formData: FormData) {
    const trial = formData.get("password");
    const password = process.env.PIN;

    if (password === undefined) {
        return { error: "PIN is not set, you can't connect." };
    }

    if (trial !== password) {
        return { error: "Invalid PIN." };
    }

    setSession();

    redirect("/my");
}

export async function logout() {
    removeSession();

    redirect('/login');
}