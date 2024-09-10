'use client'

import GitHubCalendar from 'react-github-calendar';
import React from 'react';

export default function GithubCalendar() {
    const theme = {
        light: ['#ece0d1', '#dbc1ac', '#967259', '#634832', '#38220f']
    };

    const selectMonths = (contributions, numMonths) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
      
        return contributions.filter(activity => {
            const date = new Date(activity.date);
            const monthOfDay = date.getMonth();
        
            return (
                date.getFullYear() === currentYear &&
                monthOfDay > currentMonth - numMonths &&
                monthOfDay <= currentMonth
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
        numMonths = 7;
    } else if (isDesktop) {
        numMonths = 9;
    } else if (isLargeDesktop) {
        numMonths = 12;
    }

    return (
        <div className="bg-amber-50 p-2 sm:p-4 rounded-lg w-full">
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