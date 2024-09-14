import { VscGithubInverted } from "react-icons/vsc";

export default function GithubLogo() {

    return (
            <a
                className="btn btn-ghost btn-circle"
                target="_blank"
                rel="me"
                href="https://github.com/Phenixis"
            >
                <VscGithubInverted className="size-7 hover:fill-[#773fc6]" />
            </a>
    );
}