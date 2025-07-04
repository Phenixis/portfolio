"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, Fragment } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AutoExpandingTextarea } from "@/components/ui/auto-expanding-textarea"
import { useProfiles } from "@/hooks/chat/use-profiles"
import { useConversations } from "@/hooks/chat/use-conversations"
import { useMessages } from "@/hooks/chat/use-messages"
import { useChatApi } from "@/hooks/chat/use-chat-api"
import { ChatMessageSkeleton } from "@/components/ui/chat-skeletons"
import type { Profile, Conversation } from "@/lib/types/chat"

export default function ChatConversationPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const profileId = params.profile_id as string
    const conversationId = params.conversation_id as string
    const initialMessage = searchParams.get('initialMessage')

    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [input, setInput] = useState("")
    const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState(false)
    
    // Ref for auto-scrolling to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null)
    
    // Function to scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Use the hooks - optimize loading by starting all loads in parallel
    const { profiles, isLoading: profilesLoading } = useProfiles({})
    const { conversations, isLoading: conversationsLoading } = useConversations({ profileId, enabled: !!profileId })
    const { 
        messages, 
        updateOptimisticMessages, 
        refreshMessages, 
        isLoading: messagesLoading
    } = useMessages({ conversationId })

    const { sendMessage, isLoading: chatLoading } = useChatApi({
        conversationId: conversationId,
        onOptimisticUpdate: updateOptimisticMessages,
        onComplete: () => {
            // Replace temporary messages with real ones from server after completion
            setTimeout(() => {
                refreshMessages()
            }, 500)
        },
        onError: (error) => {
            console.error("Chat error:", error)
            // Refresh messages on error to ensure consistency
            refreshMessages()
        },
    })

    // Find the current profile and conversation based on URL params - optimize for parallel loading
    useEffect(() => {
        if (profileId) {
            // If profiles are loaded, find the exact profile
            if (profiles.length > 0) {
                const profile = profiles.find(p => p.id === profileId)
                setSelectedProfile(profile || null)
            }
        }
    }, [profiles, profileId])

    useEffect(() => {
        if (conversationId) {
            // If conversations are loaded, find the exact conversation
            if (conversations.length > 0) {
                const conversation = conversations.find(c => c.id === conversationId)
                setSelectedConversation(conversation || null)
            }
        }
    }, [conversations, conversationId])

    // Auto-scroll to bottom when messages change or when the page loads
    useEffect(() => {
        if (messages.length > 0) {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                scrollToBottom()
            }, 100)
        }
    }, [messages])

    // Also scroll to bottom when chat is loading (shows "Processing..." message)
    useEffect(() => {
        if (chatLoading) {
            setTimeout(() => {
                scrollToBottom()
            }, 100)
        }
    }, [chatLoading])

    // Handle initial message from URL params (when coming from profile page)
    useEffect(() => {
        if (initialMessage && selectedConversation && !hasProcessedInitialMessage && !chatLoading) {
            setHasProcessedInitialMessage(true)
            sendMessage(initialMessage)
            // Clean up the URL by removing the initialMessage parameter
            const url = new URL(window.location.href)
            url.searchParams.delete('initialMessage')
            window.history.replaceState({}, '', url.toString())
        }
    }, [initialMessage, selectedConversation, hasProcessedInitialMessage, chatLoading, sendMessage])

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || !selectedConversation) return

        const messageContent = input
        setInput("")
        await sendMessage(messageContent)
    }, [input, selectedConversation, sendMessage])

    // Handle Ctrl+Enter to send the message
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Only trigger if textarea is focused and Ctrl+Enter is pressed
            const activeElement = document.activeElement
            if (
                activeElement &&
                activeElement.tagName === "TEXTAREA" &&
                (event.ctrlKey || event.metaKey) &&
                event.key === "Enter"
            ) {
                event.preventDefault()
                // Only send if input is not empty and not loading
                if (input.trim() && !chatLoading && selectedConversation) {
                    // Use a synthetic event to trigger form submit
                    handleSendMessage(new Event("submit") as unknown as React.FormEvent)
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
        // Include handleSendMessage in dependencies
    }, [input, chatLoading, selectedConversation, handleSendMessage])


    // Show appropriate loading states
    const isLoading = profilesLoading || conversationsLoading || messagesLoading
    const isDataMissing = !selectedConversation || !selectedProfile

    if (isLoading || isDataMissing) {
        return (
            <div className="flex flex-col h-full">
                {/* Loading Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                    {selectedProfile ? (
                        <>
                            <h1 className="text-xl font-semibold">{selectedProfile.name}</h1>
                            <p className="text-sm text-gray-600">{selectedProfile.description}</p>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                        </div>
                    )}
                </div>

                {/* Loading Messages */}
                <div className="flex-1 overflow-y-auto">
                    <ChatMessageSkeleton />
                </div>

                {/* Loading Input */}
                <div className="p-4 pb-20 border-t border-gray-200 bg-white">
                    <div className="flex space-x-2">
                        <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-16 h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <h1 className="text-xl font-semibold">{selectedProfile.name}</h1>
                <p className="text-sm text-gray-600">{selectedProfile.description}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[66%] w-fit px-4 py-2 rounded-lg ${
                                message.role === "user" 
                                    ? " rounded-ee-none bg-blue-500 text-white" 
                                    : "bg-gray-200 text-gray-900 rounded-es-none"
                            }`}
                        >
                            {message.content ? (
                                message.content.split("\n").map(
                                    (content: string, id: number) => 
                                    <Fragment key={id}>
                                        {content}
                                        <br/>
                                    </Fragment>
                                )
                            ) : message.role === "assistant" ? (
                                <div className="text-gray-500 italic">
                                    Thinking...
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}
                {chatLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="animate-pulse">Processing...</div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Invisible div to scroll to */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 pb-24 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-2 items-end">
                    <AutoExpandingTextarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Message ${selectedProfile?.name}...`}
                        disabled={chatLoading}
                        className="flex-1"
                        minRows={1}
                        maxRows={5}
                    />
                    <Button 
                        type="submit" 
                        disabled={chatLoading || !input.trim()}
                        className="mb-1"
                    >
                        {chatLoading ? "Sending..." : "Send"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
