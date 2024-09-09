import { PiMastodonLogoFill } from "react-icons/pi";

export default function MastodonLogo() {

    return (
        <div className="h-full w-9 content-center flex items-center justify-center">
                <a
                    target="_blank"
                    rel="me"
                    href="https://bzh.social/@mduhamel"
                    >
                    <PiMastodonLogoFill className="size-8 duration-200 hover:size-9 hover:fill-[#6364FF]" />
                </a>
        </div>
    );
}