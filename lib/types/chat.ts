import type { aiProfile, conversation, message } from "@/lib/db/schema"

// Infer types from Drizzle schema
export type Profile = typeof aiProfile.$inferSelect
export type NewProfile = typeof aiProfile.$inferInsert
export type Conversation = typeof conversation.$inferSelect
export type NewConversation = typeof conversation.$inferInsert
export type Message = typeof message.$inferSelect
export type NewMessage = typeof message.$inferInsert

// API request types
export interface CreateProfileRequest {
  name: string
  description: string
  system_prompt: string
  avatar_url?: string
}

export interface CreateConversationRequest {
  profile_id: string
  title?: string
}

export interface SendMessageRequest {
  message: string
}

// API response types
export interface ProfileResponse {
  profile: Profile
}

export interface ProfilesResponse {
  profiles: Profile[]
}

export interface ConversationResponse {
  conversation: Conversation
}

export interface ConversationsResponse {
  conversations: Conversation[]
}

export interface MessagesResponse {
  messages: Message[]
}

export interface ConversationWithMessagesResponse {
  conversation: Conversation
  messages: Message[]
}
