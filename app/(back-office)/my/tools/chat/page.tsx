"use client"

import type React from "react"
import { useState, useEffect, Fragment } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useProfiles } from "@/hooks/chat/use-profiles"
import { useConversations } from "@/hooks/chat/use-conversations"
import { useMessages } from "@/hooks/chat/use-messages"
import { useChatApi } from "@/hooks/chat/use-chat-api"
import type { Profile, Conversation } from "@/lib/types/chat"

export default function MultiProfileChatbot() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [input, setInput] = useState("")
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  const [newProfile, setNewProfile] = useState({
    name: "",
    description: "",
    system_prompt: "",
  })

  // Use the new hooks
  const { profiles, isLoading: profilesLoading, createProfile } = useProfiles()
  const { conversations, isLoading: conversationsLoading, createConversation } = useConversations(selectedProfile?.id)
  const { messages, addOptimisticMessage, refreshMessages } = useMessages(selectedConversation?.id)

  const { sendMessage, isLoading: chatLoading } = useChatApi({
    conversationId: selectedConversation?.id || "",
    onMessage: (message) => {
      addOptimisticMessage(message)
      // Refresh messages after AI response to get the actual saved message
      if (message.role === "assistant") {
        setTimeout(() => refreshMessages(), 1000)
      }
    },
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  // Reset conversation when profile changes
  useEffect(() => {
    setSelectedConversation(null)
  }, [selectedProfile])

  const handleCreateProfile = async () => {
    try {
      await createProfile(newProfile)
      setNewProfile({ name: "", description: "", system_prompt: "" })
      setIsCreatingProfile(false)
    } catch (error) {
      console.error("Error creating profile:", error)
    }
  }

  const handleCreateConversation = async () => {
    if (!selectedProfile) return

    try {
      const { conversation } = await createConversation({
        profile_id: selectedProfile.id,
        title: `Chat with ${selectedProfile.name}`,
      })
      setSelectedConversation(conversation)
    } catch (error) {
      console.error("Error creating conversation:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !selectedConversation) return

    const messageContent = input
    setInput("")
    await sendMessage(messageContent)
  }

  // Default profiles for demo
  const defaultProfiles = [
    {
      name: "80-Year-Old Me",
      description: "Your wise, experienced future self",
      system_prompt:
        "You are the user's 80-year-old future self. You have lived a full life, gained wisdom through experience, and have perspective on what truly matters. Speak with warmth, wisdom, and the benefit of hindsight. Share life lessons, encourage patience, and help the user see the bigger picture. Use a gentle, caring tone as if speaking to your younger self.",
    },
    {
      name: "Life Mentor",
      description: "A supportive guide for personal growth",
      system_prompt:
        "You are a wise and supportive life mentor. Your role is to guide, encourage, and help the user navigate life's challenges. Provide thoughtful advice, ask insightful questions, and help the user discover their own answers. Be empathetic, non-judgmental, and focus on personal growth and self-discovery.",
    },
    {
      name: "Creative Collaborator",
      description: "An inspiring creative partner",
      system_prompt:
        "You are an enthusiastic creative collaborator. Help the user explore ideas, brainstorm solutions, and think outside the box. Encourage experimentation, celebrate creativity, and help turn abstract concepts into concrete plans. Be energetic, supportive, and always ready to build on ideas.",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Profile Selection */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">AI Profiles</h2>
            <Button size="sm" onClick={() => setIsCreatingProfile(true)}>
              Add Profile
            </Button>
          </div>

          {profilesLoading ? (
            <div className="text-sm text-gray-500">Loading profiles...</div>
          ) : profiles.length === 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">Get started with these default profiles:</p>
              {defaultProfiles.map((profile, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={async () => {
                    try {
                      await createProfile(profile)
                    } catch (error) {
                      console.error("Error creating default profile:", error)
                    }
                  }}
                >
                  <div>
                    <div className="font-medium">{profile.name}</div>
                    <div className="text-xs text-gray-500">{profile.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {profiles.map((profile) => (
                <Button
                  key={profile.id}
                  variant={selectedProfile?.id === profile.id ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setSelectedProfile(profile)}
                >
                  <div>
                    <div className="font-medium">{profile.name}</div>
                    <div className="text-xs opacity-70">{profile.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Conversations */}
        {selectedProfile && (
          <div className="flex-1 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Conversations</h3>
              <Button size="sm" onClick={handleCreateConversation}>
                New Chat
              </Button>
            </div>
            {conversationsLoading ? (
              <div className="text-sm text-gray-500">Loading conversations...</div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant={selectedConversation?.id === conversation.id ? "default" : "ghost"}
                    className="w-full justify-start text-left h-auto p-2"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="truncate">{conversation.title}</div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h1 className="text-xl font-semibold">{selectedProfile?.name}</h1>
              <p className="text-sm text-gray-600">{selectedProfile?.description}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {message.content.split("\n").map(
                      (content: string, id: number) => 
                      <Fragment key={id}>
                        {content}
                        <br/>
                      </Fragment>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse">Thinking...</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 pb-20 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Message ${selectedProfile?.name}...`}
                  disabled={chatLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={chatLoading || !input.trim()}>
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Multi-Profile AI Chatbot</h2>
              <p className="text-gray-600">Select a profile and start a conversation to begin</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Profile Modal */}
      {isCreatingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Profile</CardTitle>
              <CardDescription>Define a new AI persona for conversations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newProfile.name}
                  onChange={(e) => setNewProfile((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Career Coach"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newProfile.description}
                  onChange={(e) => setNewProfile((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this persona"
                />
              </div>
              <div>
                <label className="text-sm font-medium">System Prompt</label>
                <Textarea
                  value={newProfile.system_prompt}
                  onChange={(e) => setNewProfile((prev) => ({ ...prev, system_prompt: e.target.value }))}
                  placeholder="Define how this AI persona should behave..."
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreateProfile} className="flex-1">
                  Create Profile
                </Button>
                <Button variant="outline" onClick={() => setIsCreatingProfile(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
