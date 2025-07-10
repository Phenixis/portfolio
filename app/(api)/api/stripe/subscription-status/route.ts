import { NextRequest, NextResponse } from "next/server"
import { verifyRequest } from "@/lib/auth/api"
import { db } from "@/lib/db/drizzle"
import { eq, and } from "drizzle-orm"
import * as Schema from "@/lib/db/schema"

export async function GET(request: NextRequest) {
    try {
        const { error, userId } = await verifyRequest(request)
        if (error) return error

        // Get user's active subscription
        const subscription = await db
            .select()
            .from(Schema.userSubscription)
            .where(
                and(
                    eq(Schema.userSubscription.user_id, userId),
                    eq(Schema.userSubscription.status, 'active')
                )
            )
            .limit(1)

        if (subscription.length === 0) {
            return NextResponse.json({
                hasActiveSubscription: false,
                subscription: null
            })
        }

        const activeSubscription = subscription[0]

        return NextResponse.json({
            hasActiveSubscription: true,
            subscription: {
                id: activeSubscription.stripe_subscription_id,
                status: activeSubscription.status,
                currentPeriodStart: activeSubscription.current_period_start,
                currentPeriodEnd: activeSubscription.current_period_end,
                cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
                productId: activeSubscription.stripe_product_id,
                priceId: activeSubscription.stripe_price_id,
                trialEnd: activeSubscription.trial_end,
                canceledAt: activeSubscription.canceled_at
            }
        })

    } catch (error) {
        console.error('Error fetching subscription status:', error)
        return NextResponse.json(
            { error: "Failed to fetch subscription status" },
            { status: 500 }
        )
    }
}
