import { NextRequest, NextResponse } from "next/server";
import { getMeteoByDay, createMeteo, updateMeteo } from "@/lib/db/queries";
import {
    type Meteo
} from "@/lib/db/schema";
import dotenv from 'dotenv';

export async function GET(request: NextRequest) {
    dotenv.config();
    const searchParams = request.nextUrl.searchParams;
    const day = searchParams.get("day");

    if (!day) {
        throw new Error("Missing day parameter");
    }

    const savedMeteo = await getMeteoByDay(day);

    const oneHourAgo = new Date(Date.now() - 3600 * 1000);

    if (savedMeteo.length === 0 || savedMeteo[0].updated_at < oneHourAgo) { // Update every hour
        const lat = searchParams.get("lat");
        if (!lat) {
            throw new Error("Missing lat parameter");
        }
        const lon = searchParams.get("lon");
        if (!lon) {
            throw new Error("Missing lon parameter");
        }

        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`;
        const result = await fetch(url);

        if (!result.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const data = await result.json();

        if (savedMeteo.length === 0) {
            await createMeteo(day, parseInt(data.daily[0].feels_like.day as string), data.daily[0].summary, data.daily[0].weather[0].icon);
        } else {
            await updateMeteo(day, parseInt(data.daily[0].feels_like.day as string), data.daily[0].summary, data.daily[0].weather[0].icon);
        }

        return NextResponse.json({
            day: day,
            temperature: data.daily[0].feels_like.day,
            summary: data.daily[0].summary,
            icon: data.daily[0].weather[0].icon,
        } as Meteo);
    } else {
        return NextResponse.json(savedMeteo[0]);
    }
}