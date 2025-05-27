import { TwitterApi } from 'twitter-api-v2';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';


export async function POST() {
    const headersList = await headers();
    const bearer = process.env.X_BEARER;
    if (!bearer) {
        return NextResponse.json({ error: 'Missing X_BEARER' }, { status: 500 });
    }
    if (headersList.get('token') !== bearer) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    new TwitterApi(bearer);
    
    return NextResponse.json({ message: 'Tweet sent' });
}
