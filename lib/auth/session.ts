"use server"

import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const key = new TextEncoder().encode(process.env.AUTH_SECRET)

type SessionData = {
	expires: string
}

export async function signToken(payload: SessionData) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1 day from now")
		.sign(key)
}

export async function verifyToken(input: string) {
	try {
		const { payload } = await jwtVerify(input, key, {
			algorithms: ["HS256"],
		})
		return payload as SessionData
	} catch (error) {
		return null
	}
}

// For server components and server actions
export async function getSession() {
	const cookieStore = await cookies()
	const credentialsSession = cookieStore.get("session")?.value

	if (!credentialsSession) {
		return null
	}

	try {
		// Verify the token
		const parsed = await verifyToken(credentialsSession)

		if (!parsed) {
			return null
		}

		// Extend the session expiration by reusing setSession
		await setSession(parsed)

		return parsed
	} catch (error) {
		// Handle invalid or expired token
		return null
	}
}

// For middleware - only verifies, doesn't extend
export async function verifySession(sessionCookie: string | undefined) {
	if (!sessionCookie) {
		return null
	}

	try {
		return await verifyToken(sessionCookie)
	} catch (error) {
		return null
	}
}

export async function setSession(session?: SessionData) {
	const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000)
	const sessionData: SessionData = session || {
		expires: expiresInOneDay.toISOString(),
	}
	const encryptedSession = await signToken(sessionData)
		; (await cookies()).set({
			name: "session",
			value: encryptedSession,
			expires: expiresInOneDay,
			httpOnly: true,
			secure: true,
			sameSite: "lax",
		})

	return encryptedSession
}

export async function removeSession() {
	// Await the cookies() function before calling delete()
	; (await cookies()).delete("session")
}
