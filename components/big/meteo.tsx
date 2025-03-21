'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
    type Meteo
} from '@/lib/db/schema';

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
        return <div className={cn("text-center text-lg", className)}>Loading...</div>;
    }

    return (
        <div className={cn("text-center md:text-lg", className)}>
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col justify-center items-center">
                    <img src={`http://openweathermap.org/img/wn/${meteo.icon}@2x.png`} className="size-12" alt="Weather icon" />
                    <p>{meteo.temperature.toFixed(0)}°C</p>
                </div>
                <p className="">
                    {meteo.day != new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }) ? "Tomorrow, " : "Today, "}
                    {meteo.summary}
                </p>
            </div>
        </div >
    );
}