"use client"

import { MotionDiv, MotionSpan } from "@/lib/services/motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import Tooltip from "../tooltip"
import { useCheckout } from "@/hooks/use-checkout"
import { useState } from "react"
import { formatPrice } from "@/lib/utils/payment"

export default function PricingCard({
    plan,
    isPopular = false,
    recurrency = "monthly",
    active = true
}: {
    plan: {
        stripe_product_id?: number,
        name?: string,
        display_name?: string,
        description?: string | null,
        price?: {
            monthly: {
                amount: number,
                priceId: string,
                currency: string
            },
            yearly: {
                amount: number,
                priceId: string,
                currency: string
            }
        },
        features: {
            enabled: {
                id: number,
                name: string,
                display_name: string,
                description: string | null,
            }[],
            disabled?: {
                id: number,
                name: string,
                display_name: string,
                description: string | null,
            }[]
        }
    },
    isPopular?: boolean,
    recurrency?: "monthly" | "yearly",
    active?: boolean
}) {
    const [isProcessing, setIsProcessing] = useState(false)
    const { createCheckoutSession, isLoading, error } = useCheckout({
        onSuccess: () => {
            console.log('Checkout initiated successfully')
        },
        onError: (error) => {
            console.error('Checkout error:', error)
            setIsProcessing(false)
        }
    })

    const handleGetStarted = async () => {
        if (!plan.price) {
            // Free plan - redirect to sign up or dashboard
            window.location.href = '/sign-up'
            return
        }

        setIsProcessing(true)
        try {
            await createCheckoutSession(plan.price[recurrency].priceId)
        } catch (error) {
            console.error('Failed to start checkout:', error)
            setIsProcessing(false)
        }
    }

    const staggerItem = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    return (
        <MotionDiv variants={staggerItem}>
            <MotionDiv
                whileHover={{ scale: 1.03, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative hover:z-10 ${!active && "grayscale pointer-events-none"}`}
            >
                <Card className={`${isPopular ? "relative border-blue-500 dark:border-blue-400" : "border-gray-200 dark:border-gray-800"} flex flex-col h-[650px]`}>
                    {
                        isPopular && (
                            <MotionDiv
                                className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                                initial={{ opacity: 0, y: -10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <Badge className="bg-blue-500 lg:hover:bg-blue-600 text-white">
                                    Most Popular
                                </Badge>
                            </MotionDiv>
                        )
                    }
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-heading">
                            {plan.display_name || "Free"}
                        </CardTitle>
                        <div className="mt-4">
                            <MotionSpan
                                className="text-4xl font-bold"
                                initial={{ scale: 0.8 }}
                                whileInView={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
                                viewport={{ once: true }}
                            >
                                {plan.price 
                                    ? formatPrice(plan.price[recurrency].amount, plan.price[recurrency].currency)
                                    : "0€"
                                }
                            </MotionSpan>
                            <span className="text-gray-600 dark:text-gray-400">/{plan.price ? (recurrency === "monthly" ? "month" : "year") : "forever"}</span>
                        </div>
                        <CardDescription className="mt-2">
                            {plan.description || "Perfect for getting started with organization"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 flex flex-col">
                        <div className="space-y-3 flex-1">
                            {plan.features.enabled.map((feature, index) => (
                                <Tooltip key={index} tooltip={feature.description || ""} className="w-full">
                                    <MotionDiv
                                        className="flex items-center space-x-3 text-left"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span>{feature.display_name}</span>
                                    </MotionDiv>
                                </Tooltip>
                            ))}
                            {plan.features.disabled && plan.features.disabled.map((feature, index) => (
                                <Tooltip key={index} tooltip={feature.description || ""} className="w-full">
                                    <MotionDiv
                                        key={index}
                                        className="flex items-center space-x-3 text-left"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 0.5, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <X className="h-5 w-5 text-red-500" />
                                        <span>{feature.display_name}</span>
                                    </MotionDiv>
                                </Tooltip>
                            ))}
                        </div>
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.0 }}
                            viewport={{ once: true }}
                        >
                            <MotionDiv
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                    variant={isPopular ? "default" : "outline"} 
                                    className={`w-full ${isPopular ? "dark:text-black bg-blue-500 text-white lg:hover:bg-blue-600" : "border-gray-300 dark:border-gray-700"}`}
                                    onClick={handleGetStarted}
                                    disabled={isLoading || isProcessing || !active}
                                >
                                    {isLoading || isProcessing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>Get Started {plan.price === undefined && "Free"}</>
                                    )}
                                </Button>
                                {error && (
                                    <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                                )}
                            </MotionDiv>
                        </MotionDiv>
                    </CardContent>
                </Card>
            </MotionDiv>
        </MotionDiv>
    )
}