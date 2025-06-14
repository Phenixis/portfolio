"use client"

import { useFilteredData } from "../use-filtered-data"
import { ApiClient } from "@/lib/api-client"
import { useUser } from "../use-user"
import type { Profile, CreateProfileRequest } from "@/lib/types/chat"

export function useProfiles() {
  const { user } = useUser()

  const {
    data: profilesData,
    isLoading,
    isError,
    mutate,
  } = useFilteredData<{ profiles: Profile[] }>({
    endpoint: "/api/profiles",
    skipFetch: !user?.api_key,
  })

  const profiles = (profilesData?.profiles || []) as Profile[]

  const createProfile = async (data: CreateProfileRequest) => {
    if (!user?.api_key) throw new Error("No API key available")

    const apiClient = new ApiClient(user.api_key)
    const result = await apiClient.createProfile(data)

    // Optimistically update the cache
    await mutate()

    return result
  }

  const updateProfile = async (profileId: string, data: Partial<Profile>) => {
    if (!user?.api_key) throw new Error("No API key available")

    const apiClient = new ApiClient(user.api_key)
    const result = await apiClient.updateProfile(profileId, data)

    // Optimistically update the cache
    await mutate()

    return result
  }

  const deleteProfile = async (profileId: string) => {
    if (!user?.api_key) throw new Error("No API key available")

    const apiClient = new ApiClient(user.api_key)
    const result = await apiClient.deleteProfile(profileId)

    // Optimistically update the cache
    await mutate()

    return result
  }

  return {
    profiles,
    isLoading,
    isError,
    createProfile,
    updateProfile,
    deleteProfile,
    mutate,
  }
}
