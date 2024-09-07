'use client'

import { VscGithub, VscGithubInverted } from "react-icons/vsc";
import { useState } from "react";

export default function GithubLogo() {
    {/* LinkedIn Icon that changes on hover */}
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div class="h-full content-center">
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isHovered ? (
                    <VscGithubInverted className="size-7" />
                ) : (
                    <VscGithub className="size-7" />
                )}
            </div>
        </div>
    );
}