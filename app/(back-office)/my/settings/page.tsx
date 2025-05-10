import UpdateAutoDarkMode from "@/components/big/darkMode/updateAutoDarkMode"
import { getDarkModeCookie } from "@/lib/cookies"

export default async function SettingsPage() {
    const darkModeCookie = await getDarkModeCookie()
    return (
        <div>
            <h1>Settings</h1>
            <UpdateAutoDarkMode darkModeCookie={darkModeCookie} />
        </div>
    )
}