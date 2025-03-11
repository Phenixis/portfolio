import './global.css'
import type { Metadata } from 'next'
import { baseUrl } from './sitemap'
import { Domine, Geist_Mono, Ubuntu_Sans_Mono } from 'next/font/google';

const domine = Domine({
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    subsets: ['latin'],
})

const ubuntuSansMono = Ubuntu_Sans_Mono({
    subsets: ['latin'],
})

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'Maxime Duhamel',
        template: '%s | Maxime Duhamel',
    },
    description: 'This is my portfolio.',
    openGraph: {
        title: 'My Portfolio',
        description: 'This is my portfolio.',
        url: baseUrl,
        siteName: 'My Portfolio',
        locale: 'en_US',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

const cx = (...classes: string[]) => classes.filter(Boolean).join(' ')

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="en"
        >
            <head>
                <link rel="icon" href="/favicon.png" sizes='any' />
            </head>
            <body className={cx(
                'antialiased text-black bg-white dark:text-white dark:bg-black',
                domine.className,
                geistMono.className,
                ubuntuSansMono.className,
            )}>
                {children}
            </body>
        </html>
    )
}
