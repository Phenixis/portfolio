import { getUser } from "@/lib/db/queries/user"
import { ProfileForm } from "@/components/big/settings/profile-form"

export default async function ProfileSettingsPage() {
    const user = await getUser()

    if (!user) {
        throw new Error("User not found")
    }

    return (
        <section className="page">
            <h1 className="page-title">Profile Settings</h1>
            <p className="page-description">
                Manage your personal information and account details.
            </p>
            <ProfileForm user={user} />
        </section>
    )
}
