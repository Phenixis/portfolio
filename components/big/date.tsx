'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function DateDisplay({
    className,
} : {
    className?: string
}) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [locale, setLocale] = useState("fr-FR");

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 3600000);

        setLocale(navigator.language);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={cn("text-center text-lg", className)}>
            {currentDate.toLocaleDateString(locale)}
        </div>
    );
}