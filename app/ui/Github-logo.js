'use client'

import { VscGithub, VscGithubInverted } from "react-icons/vsc";
import { useState } from "react";

export default function GithubLogo() {
    {/* Icon that changes on hover */}
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="h-full content-center">
            <a
                target="_blank"
                rel="me"
                href="https://github.com/Phenixis"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isHovered ? (
                    <VscGithubInverted className="size-7" />
                ) : (
                    <VscGithub className="size-7" />
                )}
            </a>
        </div>
    );
}