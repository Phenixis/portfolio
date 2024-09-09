'use client'

import GitHubCalendar from 'react-github-calendar';
import React from 'react';

export default function GithubCalendar() {
    const theme = {
        light: ['#ece0d1', '#dbc1ac', '#967259', '#634832', '#38220f']
    };

    return (
        <div className="bg-amber-50 p-4 rounded-lg">
            <GitHubCalendar
                username="Phenixis"
                hideTotalCount={true}
                hideColorLegend={true}
                theme={theme}
            />
        </div>
    );
}