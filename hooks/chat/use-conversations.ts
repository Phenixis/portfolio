"use client"

import { useFilteredData } from "../use-filtered-data"
import { ApiClient } from "@/lib/api-client"
import { useUser } from "../use-user"
import type { Conversation, CreateConversationRequest } from "@/lib/types/chat"

export function useConversations(profileId?: string) {
  const { user } = useUser()

  const {
    data: conversationsData,
    isLoading,
    isError,
    mutate,
  } = useFilteredData<{ conversations: Conversation[] }>({
    endpoint: profileId ? `/api/profiles/${profileId}/conversations` : "",
    skipFetch: !user?.api_key || !profileId,
  })

  const conversations = (conversationsData?.conversations || []) as Conversation[]

  const createConversation = async (data: CreateConversationRequest) => {
    if (!user?.api_key) throw new Error("No API key available")

    const apiClient = new ApiClient(user.api_key)
    const result = await apiClient.createConversation(data)

    // Optimistically update the cache
    await mutate()

    return result
  }

  const deleteConversation = async (conversationId: string) => {
    if (!user?.api_key) throw new Error("No API key available")

    const apiClient = new ApiClient(user.api_key)
    const result = await apiClient.deleteConversation(conversationId)

    // Optimistically update the cache
    await mutate()

    return result
  }

  return {
    conversations,
    isLoading,
    isError,
    createConversation,
    deleteConversation,
    mutate,
  }
}
