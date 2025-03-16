"use server";

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const key = new TextEncoder().encode(process.env.AUTH_SECRET);

type SessionData = {
	expires: string;
};

export async function signToken(payload: SessionData) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('1 day from now')
		.sign(key);
}

export async function verifyToken(input: string) {
	const { payload } = await jwtVerify(input, key, {
		algorithms: ['HS256'],
	});
	return payload as SessionData;
}

export async function getSession() {
	const cookieStore = await cookies();
	const credentialsSession = cookieStore.get('session')?.value;
	if (!credentialsSession) {
		return null;
	}
	let res = NextResponse.next();

	const parsed = await verifyToken(credentialsSession);
	const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

	res.cookies.set({
		name: 'session',
		value: await signToken({
			...parsed,
			expires: expiresInOneDay.toISOString(),
		}),
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		expires: expiresInOneDay,
	});

	return parsed;
}

export async function setSession() {
	const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
	const session: SessionData = {
		expires: expiresInOneDay.toISOString(),
	};
	const encryptedSession = await signToken(session);

	// Await the cookies() function before calling set()
	(await cookies()).set({
		name: 'session',
		value: encryptedSession,
		expires: expiresInOneDay,
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
	});
}

export async function removeSession() {
	// Await the cookies() function before calling delete()
	(await cookies()).delete('session');
}