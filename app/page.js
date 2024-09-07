import { DiGithubBadge } from "react-icons/di";
import LinkedInLogo from '/app/ui/LinkedIn-logo';
import GithubLogo from '/app/ui/Github-logo';
import MastodonLogo from '/app/ui/Mastodon-logo';
import ContactMe from '/app/ui/Contact';

export const metadata = {
    title: "Portfolio",
}

export default function Page() {
    return (
        <main className="m-12 h-screen">
            <header className="flex justify-between p-2 sticky top-0">
                <div className="flex justify-around">
                    <GithubLogo />
                    <LinkedInLogo />
                    <MastodonLogo />
                </div>
                <p className='text-5xl block p-3 rounded-xl shadow-lg shadow-black-700 font-bold'>Maxime Duhamel</p>
                <ContactMe />
            </header>
            <div className="p-6 flex justify-around">
                <div className="p-3 rounded-xl">
                    <p>
                        Insert Gauche
                    </p>
                </div>
                <div className="p-3 rounded-xl">
                    <p>
                        Insert Droit
                    </p>
                </div>
            </div>
        </main>
    )
}