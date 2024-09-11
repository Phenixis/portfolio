'use client'

import GitHubCalendar from 'react-github-calendar';
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function GithubCalendar() {
    const theme = {
        light: ['#ece0d1', '#dbc1ac', '#967259', '#634832', '#38220f']
    };

    const router = useRouter();

    const selectMonths = (contributions, numMonths) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
    
        return contributions.filter(activity => {
            const date = new Date(activity.date);
            const year = date.getFullYear();
            const monthOfDay = date.getMonth();

            return (
                (numMonths > currentMonth && year < currentYear && monthOfDay >= (11 - Math.abs(currentMonth - numMonths))) ||
                (year == currentYear && monthOfDay >= (currentMonth - numMonths) && monthOfDay <= currentMonth)
            );
        });
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const isLargeMobile = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024 && window.innerWidth < 1280;
    const isLargeDesktop = typeof window !== 'undefined' && window.innerWidth >= 1280;

    let numMonths = 5;
    if (isLargeMobile) {
        numMonths = 8;
    } else if (isTablet) {
        numMonths = 5;
    } else if (isDesktop) {
        numMonths = 8;
    } else if (isLargeDesktop) {
        numMonths = 12;
    }
    
    console.log(numMonths);
    if (typeof window !== 'undefined') {
        console.log(window.innerWidth);
    }
    
    
    useEffect(() => {
        const handleResize = () => {
            router.refresh();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="bg-amber-50 p-2 md:p-4 rounded-lg w-full flex justify-center w-full h-full">
            <a href="https://github.com/Phenixis" target="_blank" rel="noopener noreferrer" title='Github Activity Calendar'>
            <GitHubCalendar
                username="Phenixis"
                transformData={contributions => { return selectMonths(contributions, numMonths); }}
                hideTotalCount={false}
                labels={{
                    months: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                    ],
                    weekdays: [
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat',
                        'Sun',
                    ],
                    totalCount: "{{count}} activities in the last " + numMonths + " months",
                    legend: {
                        less: 'Less',
                        more: 'More',
                    },
                }}
                hideColorLegend={true}
                hideMonthLabels={true}
                theme={theme}
                />
            </a>
        </div>
    );
}