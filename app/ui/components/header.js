'use client'

import LinkedInLogo from '/app/ui/logos/LinkedIn-logo';
import GithubLogo from '/app/ui/logos/Github-logo';
import MastodonLogo from '/app/ui/logos/Mastodon-logo';
import XLogo from '/app/ui/logos/X-logo';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className={`flex justify-between p-2 sticky top-0 w-full bg-amber-50 rounded-lg shadow-lg shadow-black-700 duration-300 ${
                isScrolled ? 'h-16' : ''
            }`}
        >
            <p className="text-2xl block p-3 rounded-xl font-bold">Maxime Duhamel</p>
            <div className="flex justify-around space-x-0.5">
                <XLogo />
                <GithubLogo />
                <LinkedInLogo />
                <MastodonLogo />
            </div>
        </header>
    );
}