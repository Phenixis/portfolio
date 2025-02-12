"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"

/**
 * Generates hourglass data for a given life year.
 * For past years, daysSpent equals the full year (complete),
 * for the current year, daysSpent is calculated until now,
 * and for future years, daysSpent is 0.
 *
 * @param {number} year - The calendar year corresponding to the life year.
 * @param {Date} birthDate - The user's birthday.
 * @returns {{year: number, daysSpent: number, daysLeft: number}}
 */
function generateHourglassData(year: number, birthDate: Date) {
    const startOfYear = new Date(Date.UTC(year, birthDate.getMonth(), birthDate.getDate()));
    const endOfYear = new Date(Date.UTC(year + 1, birthDate.getMonth(), birthDate.getDate()));

    // Calculate total days in this life year
    const daysInYear = Math.floor((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 3600 * 24));
    const now = new Date();

    // Determine effective start and end dates for computing days spent
    const effectiveStart = year === birthDate.getFullYear() ? birthDate : startOfYear;
    let effectiveEnd: Date;
    if (endOfYear < now) {
        // Past years: full year completed
        effectiveEnd = endOfYear;
    } else {
        // Future years: none of the year has passed yet
        effectiveEnd = now < endOfYear ? now : endOfYear;
    }

    // Calculate days spent and adjust for the birth year (if needed)
    let daysSpent = Math.max(
        0,
        Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 3600 * 24))
    );
    if (year === birthDate.getFullYear()) {
        daysSpent = Math.max(0, daysSpent + 1);
    }
    const daysLeft = daysInYear - daysSpent;

    return { year, daysSpent, daysLeft };
}

export default function LifeElapsed() {
    const birthDate = new Date(2005, 3, 18, 10, 1, 0, 0);
    const now = new Date();
    const birthdayThisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    let currentLifeYear = now.getFullYear() - birthDate.getFullYear();
    if (now < birthdayThisYear) {
        currentLifeYear--;
    }
    currentLifeYear = Math.max(0, currentLifeYear); // safeguard in case of negative age

    const currentYear = birthDate.getFullYear() + currentLifeYear;
    const { daysSpent, daysLeft } = generateHourglassData(currentYear, birthDate);
    const totalDays = daysSpent + daysLeft;

    return (
        <div className="flex flex-col items-center" title={`${daysSpent}/${totalDays}`}>
            <span className="text-sm mb-1">{currentLifeYear}</span>
            <div className="relative w-8 h-8">
                {/* Border SVG with reduced height for triangles */}
                <svg
                    className="absolute inset-0 dark:hidden"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {/* Top triangle: common apex at (50,50) */}
                    <polygon
                        points="0,0 100,0 50,50"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                    />
                    {/* Bottom triangle: common apex at (50,50) */}
                    <polygon
                        points="0,100 100,100 50,50"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                    />
                </svg>
                {/* Border SVG with reduced height for triangles */}
                <svg
                    className="hidden inset-0 dark:block absolute"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {/* Top triangle: common apex at (50,50) */}
                    <polygon
                        points="0,0 100,0 50,50"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    />
                    {/* Bottom triangle: common apex at (50,50) */}
                    <polygon
                        points="0,100 100,100 50,50"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    />
                </svg>
                {/* Top half: Days Left */}
                <div
                    className="absolute top-0 left-0 w-full overflow-hidden dark:hidden"
                    style={{ height: `${(daysLeft / totalDays) * 50}%` }}
                >
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 100 50"
                        preserveAspectRatio="none"
                    >
                        <polygon
                            points="0,0 100,0 50,50"
                            fill="black"
                            stroke="black"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
                <div
                    className="hidden top-0 left-0 w-full overflow-hidden dark:block absolute"
                    style={{ height: `${(daysLeft / totalDays) * 50}%` }}
                >
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 100 50"
                        preserveAspectRatio="none"
                    >
                        <polygon
                            points="0,0 100,0 50,50"
                            fill="white"
                            stroke="white"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
                {/* Bottom half: Days Spent */}
                <div
                    className="absolute bottom-0 left-0 w-full overflow-hidden dark:hidden"
                    style={{ height: `${(daysSpent / totalDays) * 50}%` }}
                >
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 100 50"
                        preserveAspectRatio="none"
                    >
                        <polygon
                            points="0,50 100,50 50,0"
                            fill="black"
                            stroke="black"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
                {/* Bottom half: Days Spent */}
                <div
                    className="hidden bottom-0 left-0 w-full overflow-hidden dark:block absolute"
                    style={{ height: `${(daysSpent / totalDays) * 50}%` }}
                >
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 100 50"
                        preserveAspectRatio="none"
                    >
                        <polygon
                            points="0,50 100,50 50,0"
                            fill="white"
                            stroke="white"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}