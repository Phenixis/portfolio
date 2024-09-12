import { AiFillLinkedin } from "react-icons/ai";

export default function LinkedInLogo() {

    return (
            <a
                className="btn btn-ghost btn-circle"
                target="_blank"
                rel="me"
                href="https://www.linkedin.com/in/maxime-duhamel-b07a71251/"
            >
                <AiFillLinkedin className="size-8 hover:fill-[#0077B5]"/>
            </a>
    );
}