import LinkedInLogo from '/app/ui/logos/LinkedIn-logo';
import GithubLogo from '/app/ui/logos/Github-logo';
import MastodonLogo from '/app/ui/logos/Mastodon-logo';
import XLogo from '/app/ui/logos/X-logo';

export default function Header() {
    return (
        <header className="navbar bg-base-100 shadow-lg rounded-full">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabindex="0" role="button" className="btn btn-ghost rounded-full lg:hidden">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabindex="0"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a>Item 1</a></li>
                        <li>
                        <a>Parent</a>
                        <ul className="p-2">
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                        </ul>
                        </li>
                        <li><a>Item 3</a></li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl rounded-full">Maxime Duhamel</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a>Item 1</a></li>
                    <li>
                        <details>
                        <summary>Parent</summary>
                        <ul className="p-2">
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                        </ul>
                        </details>
                    </li>
                    <li><a>Item 3</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                <XLogo />
                <GithubLogo />
                <LinkedInLogo />
                <MastodonLogo />
            </div>
        </header>
    )
}