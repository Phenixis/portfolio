// hooks/use-filtered-data.ts
"use client"

import { fetcher } from "@/lib/fetcher"
import useSWR from "swr"
import { useUser } from "./use-user"

export function useFilteredData<T>({
  endpoint,
  params,
  skipFetch = false,
}: {
  endpoint: string
  params?: Record<string, string | number | boolean | undefined>
  skipFetch?: boolean
}) {
  const { user } = useUser()
  if (!user) {
    return {
      data: [],
      isLoading: false,
      isError: { error: "User not found" },
    }
  }

  const resolvedKey = user.api_key

  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
  }

  // Create the SWR key
  const swrKey = skipFetch ? null : `${endpoint}?${searchParams.toString()}`

  // Fetch data using SWR
  const { data, error, isLoading, mutate } = useSWR(swrKey, (url) => fetcher(url, resolvedKey), {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    revalidateIfStale: false,
  })


  return {
    data: skipFetch ? ([] as unknown as T) : data,
    isLoading: skipFetch ? false : isLoading,
    isError: skipFetch ? undefined : error,
    mutate,
  }
}
