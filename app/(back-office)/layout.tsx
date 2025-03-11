export default function BackOfficeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="w-full min-h-screen">
            {children}
        </main>
    )
}
