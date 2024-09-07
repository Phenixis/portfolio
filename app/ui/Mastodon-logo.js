'use client'

import { PiMastodonLogoFill, PiMastodonLogo } from "react-icons/pi";
import { useState } from "react";

export default function MastodonLogo() {
    {/* Icon that changes on hover */}
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div class="h-full content-center">
            <a
                target="_blank"
                rel="me"
                href="https://bzh.social/@mduhamel"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isHovered ? (
                    <PiMastodonLogoFill className="size-7" />
                ) : (
                    <PiMastodonLogo className="size-7" />
                )}
            </a>
        </div>
    );
}