'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Time({
    className,
}: {
    className?: string
}) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [locale, setLocale] = useState("fr-FR");

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        setLocale(navigator.language);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={cn("text-center text-lg", className)} suppressHydrationWarning>
            {
                currentTime.toLocaleTimeString(locale)
            }
        </div>
    );
}