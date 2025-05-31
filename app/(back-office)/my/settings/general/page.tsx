export default async function GeneralSettingsPage() {
    return (
        <section className="page">
            <h1 className="page-title">General</h1>
            <p className="page-description">
                Configure general application settings including language, region, and other preferences.
            </p>
            <div className="mt-8">
                <div className="max-w-2xl">
                    <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                            General Settings Coming Soon
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Language preferences, timezone settings, and other general configuration options will be available in a future update.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
