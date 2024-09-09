import { VscGithubInverted } from "react-icons/vsc";

export default function GithubLogo() {

    return (
        <div className="h-full content-center w-8 flex items-center justify-center">
            <a
                target="_blank"
                rel="me"
                href="https://github.com/Phenixis"
            >
                <VscGithubInverted className="size-7 hover:size-8 duration-200" />
            </a>
        </div>
    );
}