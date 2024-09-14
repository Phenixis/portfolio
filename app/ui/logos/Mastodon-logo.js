import { PiMastodonLogoFill } from "react-icons/pi";

export default function MastodonLogo() {

    return (
            <a
                className="btn btn-ghost btn-circle"
                target="_blank"
                rel="me"
                href="https://bzh.social/@mduhamel"
                >
                <PiMastodonLogoFill className="size-8 hover:fill-[#6364FF]" />
            </a>
    );
}