import { FaXTwitter } from "react-icons/fa6";

export default function XLogo() {

    return (
        <div className="btn btn-ghost btn-circle">
            <div className="flex flex-row-reverse">
                <a
                    target="_blank"
                    rel="me"
                    href="https://x.com/maxime_duhamel_"
                >
                    <FaXTwitter className="size-7 outline-2 outline-black rounded-lg hover:fill-[#1d9bf0]" />
                </a>
                <span className="animate-ping absolute inline-flex size-2.5 rounded-full bg-red-500 opacity-75"></span>
                <span className="absolute inline-flex rounded-full size-2.5 bg-red-400"></span>
            </div>
        </div>
    );
}