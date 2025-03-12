import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth/actions"

export default function BackOfficeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="w-full min-h-screen p-4">
            <header className="w-full h-16 bg-background flex items-center justify-between">
                <h1 className="text-2xl">Dashboard</h1>
                <form action={logout}>
                    <Button type="submit">Logout</Button>
                </form>
            </header>
            {children}
        </main>
    )
}
