"use client"

import { useState, useEffect } from 'react'
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
                // Store priceId in sessionStorage and redirect to sign-up
                sessionStorage.setItem('pendingCheckoutPriceId', priceId)
                const returnUrl = `${window.location.pathname}?checkout=pending`
                const signUpUrl = `/sign-up?redirectTo=${encodeURIComponent(returnUrl)}`
                window.location.href = signUpUrl
                return
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

    // Check for pending checkout after authentication
    useEffect(() => {
        const handlePendingCheckout = async () => {
            const urlParams = new URLSearchParams(window.location.search)
            const pendingPriceId = sessionStorage.getItem('pendingCheckoutPriceId')
            
            if (user && pendingPriceId && urlParams.get('checkout') === 'pending') {
                // Clear the pending checkout data
                sessionStorage.removeItem('pendingCheckoutPriceId')
                
                // Remove checkout parameter from URL
                urlParams.delete('checkout')
                const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`
                window.history.replaceState({}, '', newUrl)
                
                // Proceed with checkout
                await createCheckoutSession(pendingPriceId)
            }
        }

        handlePendingCheckout()
    }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

    const cancelSubscription = async (immediately = false) => {
        setIsLoading(true)
        setError(null)

        try {
            if (!user) {
                // Redirect to sign-up for authentication
                const signUpUrl = `/sign-up?redirectTo=${encodeURIComponent('/my')}`
                window.location.href = signUpUrl
                return
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
