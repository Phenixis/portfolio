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
import { cn } from "@/lib/utils"


export default function Calendar({
    className
} : {
    className: string
}) {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
        <div className={cn("w-full h-fit md:max-w-2xl flex justify-center", className)}>
            <Card className="w-full md:w-fit">
                <CardHeader>
                    <CardTitle className="text-center">
                        Calendar
                    </CardTitle>
                </CardHeader>
                <CardContent className="w-full md:w-fit flex justify-center">
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