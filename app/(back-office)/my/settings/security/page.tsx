import { getUser } from "@/lib/db/queries/user"
import { PasswordResetForm } from "@/components/big/settings/password-reset-form"

export default async function SecuritySettingsPage() {
    const user = await getUser()

    if (!user) {
        return (
            <section className="page">
                <h1 className="page-title">Security</h1>
                <p className="page-description">
                    Unable to load user information. Please try refreshing the page.
                </p>
            </section>
        )
    }

    return (
        <section className="page">
            <h1 className="page-title">Security</h1>
            <p className="page-description">
                Manage your password and security settings to keep your account safe.
            </p>
            <div className="mt-8">
                <PasswordResetForm user={user} />
            </div>
        </section>
    )
}
