'use client'

import GitHubCalendar from 'react-github-calendar';

export default function GithubCalendar() {
    return (
        <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-700">
        <GitHubCalendar
            username="Phenixis"
            hideTotalCount={true}
            hideColorLegend={true}
        />
        </div>
    );
}