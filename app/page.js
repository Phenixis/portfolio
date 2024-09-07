import { Metadata } from 'next';

export const metadata = {
    title: "Portfolio",
}

export default function Page() {
    return (
        <main>
            <a class="hidden" rel="me" href="https://bzh.social/@mduhamel">Mastodon</a>
            <p>This site is in construction.</p>
        </main>
    )
}