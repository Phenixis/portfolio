import Header from "@/components/big/header"

export default function BackOfficeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="relative w-full h-full flex flex-col p-4">
            <Header />
            {children}
        </main>
    )
}
