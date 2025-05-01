"use client";

import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils"


export default function Calendar({
    className
}: {
    className: string
}) {
    const [date, setDate] = useState<Date | undefined>(
        new Date()
    );

    return (
        <div className={cn("flex flex-row lg:flex-col justify-start items-start lg:items-center border border-gray-100 dark:border-gray-800 lg:h-screen", className)}>
            <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                onDayClick={(day) => {
                    console.log(day);
                }}
            />
            <div>
                <div className="flex items-center justify-center w-full text-2xl">
                    <div className="flex flex-col items-center justify-center w-fit text-xl p-2">
                        {date?.getDate()}
                    </div>
                    <div className="flex flex-col items-center justify-center w-full text-xl">
                        <div className="w-full">
                            {date?.toLocaleDateString(
                                undefined,
                                {
                                    weekday: "short",
                                }
                            )}
                        </div>
                        <div className="w-full text-base flex flex-row gap-2">
                            <div>
                                {date?.toLocaleDateString(
                                    undefined,
                                    {
                                        month: "long",
                                        year: "numeric"
                                    }
                                )}
                            </div>
                            <div>
                                {(() => {
                                    if (!date) return '';
                                    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
                                    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
                                    const weekNumber = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
                                    return (
                                        <span>
                                            W<span className="hidden lg:inline">eek </span>{weekNumber}
                                        </span>
                                    )
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}