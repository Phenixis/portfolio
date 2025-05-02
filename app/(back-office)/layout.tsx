import Header from "@/components/big/header"
import { UserProvider } from "@/hooks/use-user"
import { getUser } from "@/lib/db/queries/user"
import { Toaster } from "@/components/ui/sonner"

export default function BackOfficeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const userPromise = getUser()
    return (
        <UserProvider userPromise={userPromise}>
            <main className="relative w-full h-full">
                <Header />
                <div className="w-full h-full">
                    {children}
                </div>
                <Toaster />
            </main>
        </UserProvider>
    )
}
