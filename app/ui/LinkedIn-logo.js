'use client'

import { AiFillLinkedin, AiOutlineLinkedin } from "react-icons/ai";
import { useState } from "react";

export default function LinkedInLogo() {
    {/* LinkedIn Icon that changes on hover */}
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div class="h-full content-center">
            <a
                target="_blank"
                rel="me"
                href="https://www.linkedin.com/in/maxime-duhamel-b07a71251/"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isHovered ? (
                    <AiFillLinkedin className="size-8" />
                ) : (
                    <AiOutlineLinkedin className="size-8" />
                )}
            </a>
        </div>
    );
}