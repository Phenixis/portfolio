"use client"

import { fetcher } from "@/lib/fetcher"
import useSWR from "swr"

export function useFilteredData<T>({
  endpoint,
  params,
  skipFetch = false,
}: {
  endpoint: string
  params?: Record<string, string | number | boolean | undefined>
  skipFetch?: boolean
}) {
  // Convert params to URLSearchParams
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
  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
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
