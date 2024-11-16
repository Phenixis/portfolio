'use client';

import Navbar from './nav'
import Footer from './footer'
import { usePathname } from 'next/navigation';

export default function Main({
    children,
}: {
    children: React.ReactNode
}) {
	const actualPath = usePathname().split('/').slice(0, 2).join('/');

    return (
        <div className="min-h-screen flex flex-col justify-between min-w-0 py-6 px-2 font-mono md:px-0">
            <div>
                <Navbar actualPath={actualPath} />
                {children}
            </div>
            <Footer actualPath={actualPath} />
        </div>
    )
}