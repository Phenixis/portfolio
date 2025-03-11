import { setSession } from "@/lib/auth/session"

export default function Login() {
    setSession()

    return (
        <div>
            <h1>Login</h1>
            <p>Sign in to access the back office</p>
        </div>
    )
}