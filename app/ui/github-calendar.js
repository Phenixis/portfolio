'use client'

import GitHubCalendar from 'react-github-calendar';
import React from 'react';

export default function GithubCalendar() {
    const theme = {
        light: ['#ece0d1', '#dbc1ac', '#967259', '#634832', '#38220f']
    };

    const selectLastHalfYear = contributions => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const shownMonths = 6;
      
        return contributions.filter(activity => {
            const date = new Date(activity.date);
            const monthOfDay = date.getMonth();
        
            return (
                date.getFullYear() === currentYear &&
                monthOfDay > currentMonth - shownMonths &&
                monthOfDay <= currentMonth
            );
        });
    };

    const isMobile = false;

    return (
        <div className="bg-amber-50 p-2 sm:p-4 rounded-lg w-full">
            {isMobile ? (
                <>
                    <GitHubCalendar
                        username="Phenixis"
                        transformData={selectLastHalfYear}
                        hideTotalCount={true}
                        hideColorLegend={true}
                        theme={theme}
                    />
                </>
            ) : (
                <GitHubCalendar
                    username="Phenixis"
                    hideTotalCount={true}
                    hideColorLegend={true}
                    theme={theme}
                />
            )}
        </div>
    );
}