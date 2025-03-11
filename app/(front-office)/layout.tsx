import Main from '@/components/big/main'

export default function FrontOfficeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Main>
            {children}
        </Main>
    )
}
