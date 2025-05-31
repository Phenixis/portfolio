import UpdateAutoDarkMode from "@/components/big/darkMode/updateAutoDarkMode"
import { getDarkModeCookie } from "@/lib/cookies"

export default async function AppearanceSettingsPage() {
    const darkModeCookie = await getDarkModeCookie()
    
    return (
        <section className="page">
            <h1 className="page-title">Appearance</h1>
            <p className="page-description">
                Customize the look and feel of your interface. Adjust dark mode settings to match your preferences.
            </p>
            <UpdateAutoDarkMode darkModeCookie={darkModeCookie} />
        </section>
    )
}
