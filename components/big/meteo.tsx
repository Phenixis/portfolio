'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface WeatherData {
    temperature: number;
    description: string;
    icon: string;
}

export default function Meteo({
    className,
}: {
    className?: string
}) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async (latitude: number, longitude: number) => {
            try {
                const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);

                const data = await response.json();
                
                setWeather({
                    temperature: data.daily[0].feels_like.day,
                    description: data.daily[0].summary,
                    icon: data.daily[0].weather[0].icon,
                });
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

    if (!weather) {
        return <div className={cn("text-center text-lg", className)}>Loading...</div>;
    }

    return (
        <div className={cn("text-center text-lg", className)}>
            <div className="flex items-center justify-between">
                <div className="flex flex-col justify-center items-center">
                    <img src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="Weather icon" />
                    <div>{weather.temperature.toFixed(2)}°C</div>
                </div>
                <div>{weather.description}</div>
            </div>
        </div>
    );
}