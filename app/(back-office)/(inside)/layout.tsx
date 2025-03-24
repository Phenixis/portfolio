import Header from "@/components/big/header"

export default function BackOfficeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="relative w-full h-full xl:p-4">
            <Header />
            {children}
        </main>
    )
}
