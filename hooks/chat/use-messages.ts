"use client"

import { useFilteredData } from "../use-filtered-data"
import { useUser } from "../use-user"
import type { Message } from "@/lib/types/chat"

export function useMessages(conversationId?: string) {
  const { user } = useUser()

  const {
    data: messagesData,
    isLoading,
    isError,
    mutate,
  } = useFilteredData<{ messages: Message[] }>({
    endpoint: conversationId ? `/api/conversations/${conversationId}/messages` : "",
    skipFetch: !user?.api_key || !conversationId,
  })

  const messages = (messagesData?.messages || []) as Message[]

  const addOptimisticMessage = (message: Message) => {
    // Optimistically add message to cache
    mutate(
      (current: typeof messagesData) => ({
        messages: [...(current?.messages || []), message],
      }),
      false,
    )
  }

  const refreshMessages = () => {
    mutate()
  }

  return {
    messages,
    isLoading,
    isError,
    addOptimisticMessage,
    refreshMessages,
    mutate,
  }
}
