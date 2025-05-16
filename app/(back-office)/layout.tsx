import Header from "@/components/big/header"
import { UserProvider } from "@/hooks/use-user"
import { getUser } from "@/lib/db/queries/user"
import { getDarkModeCookie } from "@/lib/cookies"

export default async function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userPromise = getUser()
  const darkModeCookie = await getDarkModeCookie()

  return (
    <UserProvider userPromise={userPromise}>
      <main className="relative w-full h-full">
        <Header darkModeCookie={darkModeCookie} />
        <div className="w-full h-full">{children}</div>
      </main>
    </UserProvider>
  )
}
