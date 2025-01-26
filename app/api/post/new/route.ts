import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
    const body = await request.json();

    console.log(process.cwd());
    
    const postsDirectory = join(process.cwd(), 'app/blog/posts/');
    const filePath = join(postsDirectory, `${
        body.title
            .toLowerCase()
            .replace(/ /g, '_')
            .replace(/[^a-z0-9-]/g, '')
    }.mdx`);

    const template = await fs.readFile(join(postsDirectory, 'template'), 'utf-8');
    
    const content = template
        .replace('TITLE', body.title)
        .replace("DATE", new Date().toISOString())
        .replace('SUMMARY', body.summary)
        .replace('CONTENT', body.content);

    await fs.writeFile(filePath, content);

    return NextResponse.json(content);
}