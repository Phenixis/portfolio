'use client'

import { AiFillLinkedin, AiOutlineLinkedin } from "react-icons/ai";
import { useState } from "react";

export default function LinkedInLogo() {
    {/* LinkedIn Icon that changes on hover */}
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div class="h-full content-center">
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isHovered ? (
                    <AiFillLinkedin className="size-8" />
                ) : (
                    <AiOutlineLinkedin className="size-8" />
                )}
            </div>
        </div>
    );
}