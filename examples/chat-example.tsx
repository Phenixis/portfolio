/**
 * Example component demonstrating the fixed optimistic update pattern
 * for chat functionality using the updated hooks
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChatApi } from "@/hooks/chat/use-chat-api"
import { useMessages } from "@/hooks/chat/use-messages"
import type { Message } from "@/lib/types/chat"

interface ChatExampleProps {
    conversationId: string
}

export function ChatExample({ conversationId }: ChatExampleProps) {
    const [inputMessage, setInputMessage] = useState("")

    // Use the updated messages hook with optimistic updates
    const { 
        messages, 
        isLoading: messagesLoading,
        isPending: messagesPending,
        updateOptimisticMessages,
        refreshMessages 
    } = useMessages({ conversationId })

    // Use the updated chat API hook
    const { 
        sendMessage, 
        isLoading: chatLoading,
        isPending: chatPending,
        isError 
    } = useChatApi({
        conversationId,
        onOptimisticUpdate: updateOptimisticMessages,
        onComplete: refreshMessages,
        onError: (error) => {
            console.error("Chat error:", error)
        }
    })

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return

        const messageContent = inputMessage.trim()
        setInputMessage("")

        // The optimistic update is now handled by the sendMessage function
        // It will automatically create temporary messages and update them during streaming
        await sendMessage(messageContent)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messagesLoading && messages.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        Loading messages...
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                    message.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                } ${
                                    // Show visual indication for temporary messages
                                    message.id.startsWith("temp_") 
                                        ? "opacity-70 border-dashed border-2" 
                                        : ""
                                }`}
                            >
                                <div className="text-sm">
                                    {message.content || (
                                        <span className="text-muted-foreground italic">
                                            {message.role === "assistant" ? "Thinking..." : ""}
                                        </span>
                                    )}
                                </div>
                                {message.id.startsWith("temp_") && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Sending...
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                
                {/* Show loading indicator during transitions */}
                {(messagesPending || chatPending) && (
                    <div className="text-center text-muted-foreground">
                        <div className="animate-pulse">Processing...</div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={chatLoading || messagesLoading}
                    className="flex-1"
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={chatLoading || messagesLoading || !inputMessage.trim()}
                    variant={isError ? "destructive" : "default"}
                >
                    {chatLoading ? "Sending..." : "Send"}
                </Button>
            </div>

            {isError && (
                <div className="mt-2 text-sm text-destructive">
                    Failed to send message. Please try again.
                </div>
            )}
        </div>
    )
}
