import { NextRequest, NextResponse } from "next/server";
import dotenv from 'dotenv';

export async function GET(request: NextRequest) {
    dotenv.config();
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    try {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`;
        const result = await fetch(url);

        if (!result.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const data = await result.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch weather data: " + (error as Error).message }, { status: 500 });
    }
}