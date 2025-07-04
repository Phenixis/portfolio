import { fetcher } from "@/lib/fetcher"
import type { Profile, CreateProfileRequest, CreateConversationRequest, Conversation } from "./types/chat"

export class ApiClient {
  constructor(private apiKey: string) {}

  // Profile methods
  async getProfiles() {
    return fetcher("/api/profiles", this.apiKey) as Promise<{ profiles: Profile[] }>
  }

  async createProfile(data: CreateProfileRequest) {
    const response = await fetch("/api/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = new Error("Failed to create profile") as Error & { info?: unknown; status?: number }
      const info = await response.json()
      console.log(info)
      error.info = info
      error.status = response.status
      throw error
    }

    return response.json() as Promise<{ profile: Profile }>
  }

  async updateProfile(profileId: string, data: Partial<Profile>) {
    const response = await fetch(`/api/profiles/${profileId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = new Error("Failed to update profile") as Error & { info?: unknown; status?: number }
      const info = await response.json()
      error.info = info
      error.status = response.status
      throw error
    }

    return response.json() as Promise<{ profile: Profile }>
  }

  async deleteProfile(profileId: string) {
    const response = await fetch(`/api/profiles/${profileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      const error = new Error("Failed to delete profile") as Error & { info?: unknown; status?: number }
      const info = await response.json()
      error.info = info
      error.status = response.status
      throw error
    }

    return response.json() as Promise<{ message: string }>
  }

  // Conversation methods
  async createConversation(data: CreateConversationRequest) {
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = new Error("Failed to create conversation") as Error & { info?: unknown; status?: number }
      const info = await response.json()
      error.info = info
      error.status = response.status
      throw error
    }

    return response.json() as Promise<{ conversation: Conversation }>
  }

  async deleteConversation(conversationId: string) {
    const response = await fetch(`/api/conversations/${conversationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      const error = new Error("Failed to delete conversation") as Error & { info?: unknown; status?: number }
      const info = await response.json()
      error.info = info
      error.status = response.status
      throw error
    }

    return response.json() as Promise<{ message: string }>
  }

  async updateConversation(conversationId: string, data: { title?: string; is_archived?: boolean }) {
    const response = await fetch(`/api/conversations/${conversationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = new Error("Failed to update conversation") as Error & { info?: unknown; status?: number }
      const info = await response.json()
      error.info = info
      error.status = response.status
      throw error
    }

    return response.json() as Promise<{ conversation: Conversation }>
  }
}
