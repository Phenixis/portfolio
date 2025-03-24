'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
    type Meteo
} from '@/lib/db/schema';
import { Loader2 } from 'lucide-react';

export default function Meteo({
    className,
}: {
    className?: string
}) {
    const now = new Date();
    const date = now.getHours() >= 19
        ? new Date(now.setDate(now.getDate() + 1)).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        : now.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const [meteo, setMeteo] = useState<Meteo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fetchWeather = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(`/api/weather?day=${date}&lat=${latitude}&lon=${longitude}`);

            const data = await response.json() as Meteo;

            setMeteo(data);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    setError('Failed to get location');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser');
        }
    };

    useEffect(() => {
        getLocation();
    }, [error]);

    if (error) {
        return <div className={cn("text-center text-lg", className)}>{error}</div>;
    }

    if (!meteo) {
        return <Loader2 className='animate-spin' />;
    }

    return (
        <div className={cn("text-center text-xs xl:text-sm flex flex-col justify-center items-center", className)}>
            <img src={`http://openweathermap.org/img/wn/${meteo.icon}@2x.png`} className="size-12 xl:transform duration-300 xl:translate-y-3 xl:group-hover/Time:-translate-y-0" alt="Weather icon" />
            <p className="duration-300 -translate-y-2 xl:transform xl:-translate-y-4 xl:opacity-0 xl:group-hover/Time:opacity-100 xl:group-hover/Time:-translate-y-2">{meteo.temperature.toFixed(0)}°C</p>
        </div>
    );
}