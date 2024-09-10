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
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 768;
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    const isLargeDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

    let numMonths;
    if (isMobile) {
        numMonths = 5;
    } else if (isTablet) {
        numMonths = 5;
    } else if (isDesktop) {
        numMonths = 8;
    } else if (isLargeDesktop) {
        numMonths = 12;
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
        <div className="bg-amber-50 p-2 sm:p-4 rounded-lg w-full flex justify-center">
            <GitHubCalendar
                username="Phenixis"
                transformData={contributions => { return selectMonths(contributions, numMonths); }}
                hideTotalCount={true}
                hideColorLegend={true}
                theme={theme}
            />
        </div>
    );
}