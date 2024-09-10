import { AiFillLinkedin } from "react-icons/ai";

export default function LinkedInLogo() {

    return (
        <div className="h-9 w-9 content-center flex items-center justify-center">
            <a
                target="_blank"
                rel="me"
                href="https://www.linkedin.com/in/maxime-duhamel-b07a71251/"
            >
                <AiFillLinkedin className="size-8 duration-200 hover:size-9 hover:fill-[#0077B5] hover:rounded-lg"/>
            </a>
        </div>
    );
}