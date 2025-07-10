"use client"

import { useState } from 'react'
import { useUser } from '@/hooks/use-user'

interface UseCheckoutOptions {
    onSuccess?: () => void
    onError?: (error: string) => void
}

export function useCheckout(options: UseCheckoutOptions = {}) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { user } = useUser()

    const createCheckoutSession = async (priceId: string) => {
        setIsLoading(true)
        setError(null)

        try {
            if (!user) {
                throw new Error('Authentication required. Please log in.')
            }

            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.api_key}`
                },
                body: JSON.stringify({
                    priceId,
                    successUrl: `${window.location.origin}/my?payment=success`,
                    cancelUrl: `${window.location.origin}/my?payment=cancelled`
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to create checkout session')
            }

            const { url } = await response.json()
            
            if (url) {
                // Redirect to Stripe checkout
                window.location.href = url
            } else {
                throw new Error('No checkout URL received')
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
            setError(errorMessage)
            options.onError?.(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const cancelSubscription = async (immediately = false) => {
        setIsLoading(true)
        setError(null)

        try {
            if (!user) {
                throw new Error('Authentication required. Please log in.')
            }

            const response = await fetch('/api/stripe/cancel-subscription', {
                method: immediately ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${user.api_key}`
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to cancel subscription')
            }

            const result = await response.json()
            options.onSuccess?.()
            return result

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
            setError(errorMessage)
            options.onError?.(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return {
        createCheckoutSession,
        cancelSubscription,
        isLoading,
        error,
        clearError: () => setError(null)
    }
}
