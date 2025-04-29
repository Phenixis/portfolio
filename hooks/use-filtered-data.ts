// hooks/use-filtered-data.ts
"use client"

import { fetcher } from "@/lib/fetcher"
import useSWR from "swr"
import { useUser } from "./use-user"

export function useFilteredData<T>({
  endpoint,
  params,
  skipFetch = false,
  api_key, // NEW: allow injecting api_key manually
}: {
  endpoint: string
  params?: Record<string, string | number | boolean | undefined>
  skipFetch?: boolean
  api_key?: string
}) {
  const { user } = useUser()
  const resolvedKey = api_key ?? user?.api_key ?? ""

  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
  }

  const swrKey = skipFetch ? null : [`${endpoint}?${searchParams.toString()}`, resolvedKey]

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    ([url, token]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      revalidateIfStale: false,
    }
  )

  return {
    data: skipFetch ? ([] as unknown as T) : data,
    isLoading: skipFetch ? false : isLoading,
    isError: skipFetch ? undefined : error,
    mutate,
  }
}
