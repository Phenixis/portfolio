import { DiGithubBadge } from "react-icons/di";
import { LuConstruction } from "react-icons/lu";
import LinkedInLogo from '/app/ui/LinkedIn-logo';
import GithubLogo from '/app/ui/Github-logo';
import MastodonLogo from '/app/ui/Mastodon-logo';
import XLogo from '/app/ui/X-logo';
import ContactMe from '/app/ui/Contact';

export const metadata = {
    title: "Portfolio",
}

export default function Page() {
    return (
        <main className="m-12 h-screen">
            <header className="flex justify-between p-2 sticky top-0">
                <div className="flex justify-around space-x-0.5">
                    <XLogo />
                    <GithubLogo />
                    <LinkedInLogo />
                    <MastodonLogo />
                </div>
                <p className='text-5xl block p-3 rounded-xl shadow-lg shadow-black-700 font-bold'>Maxime Duhamel</p>
                <ContactMe />
            </header>
            <main className="m-8 flex flex-col items-center">
             <LuConstruction className="size-10"/>
             <p className="text-5xl">Under Construction</p>
            </main>
        </main>
    )
}