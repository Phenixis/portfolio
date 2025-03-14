import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth/actions"
import Link from "next/link"

export default function BackOfficeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="w-full h-full flex flex-col p-4">
            <header className="w-full min-h-16 bg-background flex items-center justify-between">
                <Link href="/my">
                    <h1 className="text-2xl">Dashboard</h1>
                </Link>
                <form action={logout}>
                    <Button type="submit">Logout</Button>
                </form>
            </header>
            {children}
        </main>
    )
}
