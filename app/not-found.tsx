"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function NotFound() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    toast.error("Page \""+ pathname + "\" not found, redirecting to home page...",)
    router.replace("/my")
  }, [pathname, router])

  return (
    <div>
      404 - Page Not Found
    </div>
  )
}
