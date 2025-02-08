import { TwitterApi } from 'twitter-api-v2';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';


export async function POST(req: NextRequest) {
    const headersList = await headers();
    const bearer = process.env.X_BEARER;
    if (!bearer) {
        return NextResponse.json({ error: 'Missing X_BEARER' }, { status: 500 });
    }
    if (headersList.get('token') !== bearer) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const message = await req.json();

    const client = new TwitterApi(bearer);
    
    const readOnlyClient = client.readOnly;

    const user = await readOnlyClient.v2.userByUsername('maxime_duhamel_');

    return NextResponse.json({ message: 'Tweet sent' });
}
