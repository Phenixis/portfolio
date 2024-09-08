'use client'

import { FaSquareXTwitter, FaXTwitter } from "react-icons/fa6";
import { useState } from "react";

export default function XLogo() {
    {/* Icon that changes on hover */}
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="h-full content-center">
            <div className="flex flex-row-reverse">
                <a
                    target="_blank"
                    rel="me"
                    href="https://x.com/maxime_duhamel_"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {isHovered ? (
                        <FaSquareXTwitter className="size-7 outline-2 outline-black rounded-lg" />
                    ) : (
                        <FaXTwitter className="size-7" />
                    )}
                </a>
                <span class="animate-ping absolute inline-flex size-2.5 rounded-full bg-red-500 opacity-75"></span>
                <span class="absolute inline-flex rounded-full size-2.5 bg-red-400"></span>
            </div>
        </div>
    );
}