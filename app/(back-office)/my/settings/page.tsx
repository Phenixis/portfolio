import UpdateAutoDarkMode from "@/components/big/darkMode/updateAutoDarkMode"
import { getDarkModeCookie } from "@/lib/cookies"

export default async function SettingsPage() {
    const darkModeCookie = await getDarkModeCookie()
    return (
        <div className="space-y-6">
            <h1>Settings</h1>
            <UpdateAutoDarkMode darkModeCookie={darkModeCookie} />
        </div>
    )
}