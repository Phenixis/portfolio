'use client'

import { PiMastodonLogoFill, PiMastodonLogo } from "react-icons/pi";
import { useState } from "react";

export default function MastodonLogo() {
    {/* Icon that changes on hover */}
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="h-full content-center">
            <div className="flex flex-row-reverse">
                <a
                    target="_blank"
                    rel="me"
                    href="https://bzh.social/@mduhamel"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    >
                    {isHovered ? (
                        <PiMastodonLogoFill className="size-8" />
                    ) : (
                        <PiMastodonLogo className="size-8" />
                    )}
                </a>
                <span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-sky-400 opacity-75"></span>
                <span class="absolute inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </div>
        </div>
    );
}