import LinkedInLogo from '/app/ui/LinkedIn-logo';
import GithubLogo from '/app/ui/Github-logo';
import MastodonLogo from '/app/ui/Mastodon-logo';
import XLogo from '/app/ui/X-logo';
import ContactMe from '/app/ui/Contact';

export default function Header() {
    return (
        <header className="flex justify-between p-2 sticky top-2 w-full bg-amber-50 rounded-lg">
            <ContactMe />
            <p className='text-5xl block p-3 rounded-xl shadow-lg shadow-black-700 font-bold'>Maxime Duhamel</p>
            <div className="flex justify-around space-x-0.5">
                <XLogo />
                <GithubLogo />
                <LinkedInLogo />
                <MastodonLogo />
            </div>
        </header>
    )
}