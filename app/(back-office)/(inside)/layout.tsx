import Header from "@/components/big/header"

export default function BackOfficeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="relative w-full h-full">
            <Header />
            {children}
        </main>
    )
}
