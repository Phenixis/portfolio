'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function DateDisplay({
    className,
} : {
    className?: string
}) {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 3600000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={cn("text-center text-lg", className)}>
            {currentDate.toLocaleDateString('fr-FR', {year: 'numeric', month: '2-digit', day: '2-digit'})}
        </div>
    );
}