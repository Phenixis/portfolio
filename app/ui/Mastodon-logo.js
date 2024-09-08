'use client'

import { PiMastodonLogoFill, PiMastodonLogo } from "react-icons/pi";
import { useState } from "react";

export default function MastodonLogo() {
    {/* Icon that changes on hover */}
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="h-full content-center">
                <a
                    target="_blank"
                    rel="me"
                    href="https://bzh.social/@mduhamel"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    >
                    {isHovered ? (
                        <PiMastodonLogoFill className="size-8 fill-[#6364FF]" />
                    ) : (
                        <PiMastodonLogo className="size-8" />
                    )}
                </a>
        </div>
    );
}