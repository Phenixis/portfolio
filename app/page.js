
import { Metadata } from 'next';
import { DiGithubBadge } from "react-icons/di";
import LinkedInLogo from '/app/ui/LinkedIn-logo';
import GithubLogo from '/app/ui/Github-logo';
import MastodonLogo from '/app/ui/Mastodon-logo';

export const metadata = {
    title: "Portfolio",
}

export default function Page() {
    return (
        <main class="m-12 h-screen">
            <div class="flex justify-around">
                <div class="flex justify-around">
                    <GithubLogo />
                    <LinkedInLogo />
                    <MastodonLogo />
                </div>
                <p className='text-5xl block p-3 rounded-xl shadow-md shadow-black-700 font-bold'>Maxime Duhamel</p>
            </div>
            <div class="p-6 flex justify-around">
                <div class="p-3 rounded-xl">
                    <p>
                        Insert Gauche
                    </p>
                </div>
                <div class="p-3 rounded-xl">
                    <p>
                        Insert Droit
                    </p>
                </div>
            </div>
        </main>
    )
}