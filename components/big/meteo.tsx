'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
    type Meteo
} from '@/lib/db/schema';

export default function Meteo({
    className,
}: {
    className?: string
}) {
    const [meteo, setMeteo] = useState<Meteo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async (latitude: number, longitude: number) => {
            try {
                const response = await fetch(`/api/weather?day=${new Date().toLocaleDateString('fr-FR', {year: 'numeric', month: '2-digit', day: '2-digit'})}&lat=${latitude}&lon=${longitude}`);

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

        getLocation();
        const interval = setInterval(getLocation, 600000); // Update every 10 minutes

        return () => clearInterval(interval);
    }, []);

    if (error) {
        return <div className={cn("text-center text-lg", className)}>{error}</div>;
    }

    if (!meteo) {
        return <div className={cn("text-center text-lg", className)}>Loading...</div>;
    }

    return (
        <div className={cn("text-center text-lg", className)}>
            <div className="flex items-center justify-between">
                <div className="flex flex-col justify-center items-center">
                    <img src={`http://openweathermap.org/img/wn/${meteo.icon}@2x.png`} alt="Weather icon" />
                    <div>{meteo.temperature.toFixed(0)}°C</div>
                </div>
                <div>{meteo.summary}</div>
            </div>
        </div>
    );
}