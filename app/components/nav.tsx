import Link from 'next/link'
import DarkModeToggle from './darkModeToggle'
import Logo from './logo'

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
									className={`group duration-1000 flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1 ${actualPath === path ? 'underline decoration-dashed' : 'text-neutral-500 dark:text-neutral-400'}`}
								>
									{name === 'Home' ? (
										<Logo className="mr-2" size={32} />
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
