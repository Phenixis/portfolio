import { db } from "@/lib/db/drizzle"
import { aiProfile, conversation, message } from "@/lib/db/schema"
import { eq, and, desc, isNull } from "drizzle-orm"
import { nanoid } from "nanoid"

// Profile queries
export async function createProfile(
  userId: string,
  data: {
    name: string
    description: string
    system_prompt: string
    avatar_url?: string
  },
) {
  const profileId = nanoid(12)

  const [newProfile] = await db
    .insert(aiProfile)
    .values({
      id: profileId,
      user_id: userId,
      name: data.name,
      description: data.description,
      system_prompt: data.system_prompt,
      avatar_url: data.avatar_url,
    })
    .returning()

  return newProfile
}

export async function getProfilesByUser(userId: string) {
  return await db
    .select()
    .from(aiProfile)
    .where(and(eq(aiProfile.user_id, userId), isNull(aiProfile.deleted_at), eq(aiProfile.is_active, true)))
    .orderBy(desc(aiProfile.created_at))
}

export async function getProfile(profileId: string, userId: string) {
  const [profile] = await db
    .select()
    .from(aiProfile)
    .where(and(eq(aiProfile.id, profileId), eq(aiProfile.user_id, userId), isNull(aiProfile.deleted_at)))

  return profile || null
}

export async function updateProfile(
  profileId: string,
  userId: string,
  data: Partial<{
    name: string
    description: string
    system_prompt: string
    avatar_url: string
    is_active: boolean
  }>,
) {
  const [updatedProfile] = await db
    .update(aiProfile)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(and(eq(aiProfile.id, profileId), eq(aiProfile.user_id, userId), isNull(aiProfile.deleted_at)))
    .returning()

  return updatedProfile || null
}

export async function deleteProfile(profileId: string, userId: string) {
  const [deletedProfile] = await db
    .update(aiProfile)
    .set({
      deleted_at: new Date(),
      is_active: false,
    })
    .where(and(eq(aiProfile.id, profileId), eq(aiProfile.user_id, userId), isNull(aiProfile.deleted_at)))
    .returning()

  return !!deletedProfile
}

// Conversation queries
export async function createConversation(userId: string, profileId: string, title?: string) {
  const conversationId = nanoid(12)

  const [newConversation] = await db
    .insert(conversation)
    .values({
      id: conversationId,
      user_id: userId,
      profile_id: profileId,
      title: title || "New Conversation",
    })
    .returning()

  return newConversation
}

export async function getConversationsByProfile(profileId: string, userId: string) {
  return await db
    .select()
    .from(conversation)
    .where(
      and(
        eq(conversation.profile_id, profileId),
        eq(conversation.user_id, userId),
        isNull(conversation.deleted_at),
        eq(conversation.is_archived, false),
      ),
    )
    .orderBy(desc(conversation.updated_at))
}

export async function getConversation(conversationId: string, userId: string) {
  const [conv] = await db
    .select()
    .from(conversation)
    .where(and(eq(conversation.id, conversationId), eq(conversation.user_id, userId), isNull(conversation.deleted_at)))

  return conv || null
}

export async function deleteConversation(conversationId: string, userId: string) {
  const [deletedConversation] = await db
    .update(conversation)
    .set({
      deleted_at: new Date(),
    })
    .where(and(eq(conversation.id, conversationId), eq(conversation.user_id, userId), isNull(conversation.deleted_at)))
    .returning()

  return !!deletedConversation
}

export async function updateConversationTimestamp(conversationId: string) {
  await db
    .update(conversation)
    .set({
      updated_at: new Date(),
    })
    .where(eq(conversation.id, conversationId))
}

// Message queries
export async function addMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
  tokenCount?: number,
) {
  const messageId = nanoid(12)

  const [newMessage] = await db
    .insert(message)
    .values({
      id: messageId,
      conversation_id: conversationId,
      role,
      content,
      token_count: Number(tokenCount) || 0,
    })
    .returning()

  // Update conversation timestamp
  await updateConversationTimestamp(conversationId)

  return newMessage
}

export async function getMessages(conversationId: string, userId: string) {
  // First verify the user owns this conversation
  const conv = await getConversation(conversationId, userId)
  if (!conv) return []

  return await db.select().from(message).where(eq(message.conversation_id, conversationId)).orderBy(message.created_at)
}

export async function clearMessages(conversationId: string, userId: string) {
  // First verify the user owns this conversation
  const conv = await getConversation(conversationId, userId)
  if (!conv) return false

  await db.delete(message).where(eq(message.conversation_id, conversationId))

  return true
}

// Combined queries
export async function getConversationWithProfile(conversationId: string, userId: string) {
  const [result] = await db
    .select({
      conversation: conversation,
      profile: aiProfile,
    })
    .from(conversation)
    .innerJoin(aiProfile, eq(conversation.profile_id, aiProfile.id))
    .where(
      and(
        eq(conversation.id, conversationId),
        eq(conversation.user_id, userId),
        isNull(conversation.deleted_at),
        isNull(aiProfile.deleted_at),
      ),
    )

  return result || null
}
