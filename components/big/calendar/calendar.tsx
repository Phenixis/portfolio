"use client";

import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function Calendar() {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
        <div className="w-full md:max-w-2xl flex justify-center">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">
                        Calendar
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        onDayClick={(day) => {
                            console.log(day);
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    )
}