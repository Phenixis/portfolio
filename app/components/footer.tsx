function ArrowIcon() {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
                fill="currentColor"
            />
        </svg>
    )
}

const links = [
    { name: "X ", ref: "https://twitter.com/maxime_duhamel_", visibleOn: "/"},
    { name: "Github", ref: "https://github.com/Phenixis", visibleOn: "/" },
    { name: "Linkedin", ref: "https://www.linkedin.com/in/maxime-duhamel/", visibleOn: "/" },
    { name: "RSS feed", ref: "/rss", visibleOn: "/blog" },
];

export default function Footer({ actualPath } :  { actualPath: string }) {
    return (
        <footer className="pb-16">
            <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
                {
                    links
                    .filter((link) => actualPath.includes(link.visibleOn))
                    .map((link) => {
                        return (
                            <li key={link.name}>
                                <a
                                    className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={link.ref}
                                >
                                    <ArrowIcon />
                                    <p className="ml-2 h-7">{link.name}</p>
                                </a>
                            </li>
                        );
                    })
                }
            </ul>
        </footer>
    )
}
