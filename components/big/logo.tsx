import Image from 'next/image'
import * as ListIconLight from 'public/listIconLight.png';
import * as ListIconDark from 'public/listIconDark.png';
import Link from 'next/link'

export default function Logo({ className, size=16 } : { className?: string, size?: number }) {
    return (
        <Link href="/" className={'inline-block duration-1000 lg:group-hover/Logo:rotate-45 ' + className}>
            <Image src={ListIconLight} width={size} height={size} alt="list-style" className="dark:hidden" />
            <Image src={ListIconDark} width={size} height={size} alt="list-style" className="hidden dark:block" />
        </Link>
    )
}