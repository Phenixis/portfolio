'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Time({
    className,
} : {
    className?: string
}) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={cn("text-center text-lg", className)}>
            {currentTime.toLocaleTimeString()}
        </div>
    );
}