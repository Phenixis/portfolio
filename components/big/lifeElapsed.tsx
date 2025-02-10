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
    console.log(year, now.getFullYear())
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
    const actualDate = new Date();

    return (
        <AspectRatio ratio={5/4} className="flex flex-col gap-1">
            <table className="table-auto">
                <tbody>
                    {Array.from(
                        { length: actualDate.getFullYear() - birthDate.getFullYear() },
                        (_, i) => {
                            // currentYear not used for display now; lifeYear is i + 1
                            const currentYear = birthDate.getFullYear() + i;
                            const { daysSpent, daysLeft } = generateHourglassData(currentYear, birthDate);
                            const totalDays = daysSpent + daysLeft;
                            return (
                                <tr key={currentYear}>
                                    <td>{i + 1}</td>
                                    <td className="flex items-center gap-2">
                                        <div className="relative w-8 h-16">
                                            {/* SVG border for the whole hourglass shape */}
                                            <svg
                                                className="absolute inset-0"
                                                viewBox="0 0 100 200"
                                                preserveAspectRatio="none"
                                            >
                                                {/* Top half: triangle with its base at the top */}
                                                <polygon
                                                    points="0,0 100,0 50,100"
                                                    fill="none"
                                                    stroke="black"
                                                    strokeWidth="2"
                                                />
                                                {/* Bottom half: triangle with its base at the bottom */}
                                                <polygon
                                                    points="0,200 100,200 50,100"
                                                    fill="none"
                                                    stroke="black"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                            {/* Top half: Days Left */}
                                            <div
                                                className="absolute top-0 left-0 w-full overflow-hidden"
                                                // Container height is relative to the top half (50% of overall height)
                                                style={{ height: `${(daysLeft / totalDays) * 50}%` }}
                                            >
                                                <svg
                                                    className="w-full h-full"
                                                    viewBox="0 0 100 50"
                                                    preserveAspectRatio="none"
                                                >
                                                    {/* Top triangle with base at the top */}
                                                    <polygon
                                                        points="0,0 100,0 50,50"
                                                        fill="black"
                                                        stroke="black"
                                                        strokeWidth="2"
                                                    />
                                                </svg>
                                            </div>
                                            {/* Bottom half: Days Spent */}
                                            <div
                                                className="absolute bottom-0 left-0 w-full overflow-hidden"
                                                // Container height is relative to the bottom half (50% of overall height)
                                                style={{ height: `${(daysSpent / totalDays) * 50}%` }}
                                            >
                                                <svg
                                                    className="w-full h-full"
                                                    viewBox="0 0 100 50"
                                                    preserveAspectRatio="none"
                                                >
                                                    {/* Bottom triangle with base at the bottom */}
                                                    <polygon
                                                        points="0,50 100,50 50,0"
                                                        fill="black"
                                                        stroke="black"
                                                        strokeWidth="2"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }
                    )}
                </tbody>
            </table>
        </AspectRatio>
    );
}