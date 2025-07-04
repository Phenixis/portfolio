"use client"

import { useState, useCallback } from "react"
import { useUser } from "../use-user"
import type { Message } from "@/lib/types/chat"

interface UseChatApiParams {
    conversationId: string
    onOptimisticUpdate?: (messages: Message[]) => void
    onComplete?: () => void
    onError?: (error: string) => void
}

export function useChatApi(params: UseChatApiParams) {
    const { conversationId, onOptimisticUpdate, onComplete, onError } = params
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const { user } = useUser()

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim() || isLoading || !user?.api_key) return

            setIsLoading(true)
            setIsError(false)

            // Generate temporary IDs for optimistic updates
            const tempUserId = `temp_user_${Date.now()}`
            const tempAiId = `temp_ai_${Date.now()}_${Math.random()}`

            // Create optimistic user message
            const optimisticUserMessage: Message = {
                id: tempUserId,
                conversation_id: conversationId,
                role: "user",
                content,
                created_at: new Date(),
                token_count: null,
            }

            // Create optimistic AI message (initially empty for streaming)
            const optimisticAiMessage: Message = {
                id: tempAiId,
                conversation_id: conversationId,
                role: "assistant",
                content: "",
                created_at: new Date(),
                token_count: null,
            }

            // Add optimistic user message immediately (but not the AI message yet)
            onOptimisticUpdate?.([optimisticUserMessage])

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
                let hasAddedAiMessage = false

                // Stream the response and update the AI message
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

                                    // Create/update the AI message with streaming content
                                    const updatedAiMessage: Message = {
                                        ...optimisticAiMessage,
                                        content: assistantMessage,
                                    }

                                    // Only add the AI message when we have actual content
                                    if (!hasAddedAiMessage && assistantMessage.trim()) {
                                        hasAddedAiMessage = true
                                    }

                                    // Update optimistic state with streaming content
                                    onOptimisticUpdate?.([optimisticUserMessage, updatedAiMessage])
                                }
                            } catch (e) {
                                // Ignore parsing errors for streaming data
                            }
                        }
                    }
                }

                // Notify completion to refresh real messages from server
                onComplete?.()
            } catch (error) {
                console.error("Chat error:", error)
                setIsError(true)
                onError?.(error instanceof Error ? error.message : "Unknown error")

                // On error, we should trigger a refresh to remove optimistic messages
                onComplete?.()
            } finally {
                setIsLoading(false)
            }
        },
        [conversationId, user?.api_key, isLoading, onOptimisticUpdate, onComplete, onError],
    )

    return {
        sendMessage,
        isLoading,
        isError,
        isPending: false, // Simplified since we're not using transitions
    }
}
