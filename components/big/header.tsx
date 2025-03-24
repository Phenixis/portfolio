import DarkModeToggle from "@/components/big/darkModeToggle"
import Meteo from "@/components/big/meteo"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth/actions"
import DateDisplay from "@/components/big/date"
import Time from "@/components/big/time"

export default function Header({ }: {}) {
	return (
		<header className="-ml-4 fixed z-50 bottom-4 flex items-center justify-center w-full group/Header">
			<div className="w-fit p-2 px-4 gap-2 xl:gap-4 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-between border border-gray-200 dark:border-gray-800">
				<DarkModeToggle />
				<div className="flex items-center justify-center gap-1 xl:gap-2 group/Time">
					<Meteo/>
					<div>
						<Time className="xl:text-xl duration-300 xl:transform xl:translate-y-3 xl:group-hover/Time:translate-y-0" />
						<DateDisplay className="text-xs xl:text-sm duration-300 xl:opacity-0 xl:group-hover/Time:opacity-100 xl:transform xl:-translate-y-2 xl:group-hover/Time:translate-y-0" />
					</div>
				</div>
				<div className="flex items-center space-x-1 xl:space-x-2">
					<form action={logout}>
						<Button type="submit">Logout</Button>
					</form>
				</div>
			</div>
		</header>
	)
}
