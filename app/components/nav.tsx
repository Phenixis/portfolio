import Link from 'next/link'
import DarkModeToggle from './darkModeToggle'
import Image from 'next/image'
import * as ListIconLight from 'public/listIconLight.png';
import * as ListIconDark from 'public/listIconDark.png';

const navItems = {
	'/': {
		name: 'Home',
	},
	'/blog': {
		name: 'Blog',
	},
	'/projects': {
		name: 'Projects',
	},
}

export default function Navbar({ actualPath } :  { actualPath: string }) {

	return (
		<aside className="-ml-[8px] mb-16 tracking-tight">
			<div className="lg:sticky lg:top-20 flex justify-between">
				<nav
					className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
					id="nav"
				>
					<div className="flex flex-row space-x-0 pr-10">
						{Object.entries(navItems).map(([path, { name }]) => {
							return (
								<Link
									key={path}
									href={path}
									className={`flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1 ${actualPath === path ? 'underline decoration-dashed' : 'text-neutral-500 dark:text-neutral-400'}`}
								>
									{name === 'Home' ? (
										<div className="mr-2">
											<Image src={ListIconLight} width={32} height={32} alt="list-style" className="dark:hidden" />
											<Image src={ListIconDark} width={32} height={32} alt="list-style" className="hidden dark:block" />
										</div>
									) : null}
									{name}
								</Link>
							)
						})}
					</div>
				</nav>
				<DarkModeToggle />
			</div>
		</aside>
	)
}
