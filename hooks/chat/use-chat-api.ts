"use client"

import { useState, useCallback } from "react"
import { useUser } from "../use-user"
import type { Message } from "@/lib/types/chat"

interface UseChatApiProps {
  conversationId: string
  onMessage?: (message: Message) => void
  onError?: (error: string) => void
}

export function useChatApi({ conversationId, onMessage, onError }: UseChatApiProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || !user?.api_key) return

      setIsLoading(true)

      try {
        const response = await fetch(`/api/chat/${conversationId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.api_key}`,
          },
          body: JSON.stringify({ message: content }),
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error("No response body")

        let assistantMessage = ""

        // Create user message immediately
        const userMessage: Message = {
          id: `user_${Date.now()}`,
          conversation_id: conversationId,
          role: "user",
          content,
          created_at: new Date(),
          token_count: null,
        }

        onMessage?.(userMessage)

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const data = JSON.parse(line.slice(2))
                if (data.type === "text-delta") {
                  assistantMessage += data.textDelta
                }
              } catch (e) {
                // Ignore parsing errors for streaming data
              }
            }
          }
        }

        // Create AI message when complete
        const aiMessage: Message = {
          id: `ai_${Date.now()}`,
          conversation_id: conversationId,
          role: "assistant",
          content: assistantMessage,
          created_at: new Date(),
          token_count: null,
        }

        onMessage?.(aiMessage)
      } catch (error) {
        console.error("Chat error:", error)
        onError?.(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, user?.api_key, isLoading, onMessage, onError],
  )

  return {
    sendMessage,
    isLoading,
  }
}
