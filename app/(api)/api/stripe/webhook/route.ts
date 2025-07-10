import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/services/stripe"
import { db } from "@/lib/db/drizzle"
import { eq } from "drizzle-orm"
import * as Schema from "@/lib/db/schema"
import type { NewUserSubscription } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const signature = request.headers.get('stripe-signature')

        if (!signature) {
            console.error('Missing Stripe signature')
            return NextResponse.json(
                { error: "Missing Stripe signature" },
                { status: 400 }
            )
        }

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
        if (!webhookSecret) {
            console.error('Missing Stripe webhook secret')
            return NextResponse.json(
                { error: "Missing webhook secret" },
                { status: 500 }
            )
        }

        let event

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err) {
            console.error('Webhook signature verification failed:', err)
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            )
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object)
                break
            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(event.data.object)
                break
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object)
                break
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object)
                break
            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })

    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        )
    }
}

async function handleCheckoutSessionCompleted(session: any) {
    try {
        console.log('Processing checkout session completed:', session.id)
        
        const userId = session.metadata?.userId
        if (!userId) {
            console.error('No userId in checkout session metadata')
            return
        }

        // Get the subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        
        // Update user's stripe_customer_id if not set
        await db
            .update(Schema.user)
            .set({ stripe_customer_id: session.customer })
            .where(eq(Schema.user.id, userId))

        // Create or update subscription record
        await upsertSubscription(userId, subscription)

        console.log(`Successfully processed checkout for user ${userId}`)
    } catch (error) {
        console.error('Error handling checkout session completed:', error)
    }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
    try {
        console.log('Processing invoice payment succeeded:', invoice.id)
        
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
        const userId = subscription.metadata?.userId
        
        if (!userId) {
            console.error('No userId in subscription metadata')
            return
        }

        await upsertSubscription(userId, subscription)
        
        console.log(`Successfully processed payment for user ${userId}`)
    } catch (error) {
        console.error('Error handling invoice payment succeeded:', error)
    }
}

async function handleSubscriptionUpdated(subscription: any) {
    try {
        console.log('Processing subscription updated:', subscription.id)
        
        const userId = subscription.metadata?.userId
        if (!userId) {
            console.error('No userId in subscription metadata')
            return
        }

        await upsertSubscription(userId, subscription)
        
        console.log(`Successfully updated subscription for user ${userId}`)
    } catch (error) {
        console.error('Error handling subscription updated:', error)
    }
}

async function handleSubscriptionDeleted(subscription: any) {
    try {
        console.log('Processing subscription deleted:', subscription.id)
        
        // Mark subscription as cancelled in database
        await db
            .update(Schema.userSubscription)
            .set({ 
                status: 'canceled',
                canceled_at: new Date(),
                updated_at: new Date()
            })
            .where(eq(Schema.userSubscription.stripe_subscription_id, subscription.id))
        
        console.log(`Successfully marked subscription ${subscription.id} as cancelled`)
    } catch (error) {
        console.error('Error handling subscription deleted:', error)
    }
}

async function upsertSubscription(userId: string, subscription: any) {
    const subscriptionData: NewUserSubscription = {
        user_id: userId,
        stripe_customer_id: subscription.customer,
        stripe_subscription_id: subscription.id,
        stripe_product_id: subscription.items.data[0].price.product,
        stripe_price_id: subscription.items.data[0].price.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        cancel_at_period_end: subscription.cancel_at_period_end || false,
        updated_at: new Date()
    }

    // Check if subscription already exists
    const existingSubscription = await db
        .select()
        .from(Schema.userSubscription)
        .where(eq(Schema.userSubscription.stripe_subscription_id, subscription.id))
        .limit(1)

    if (existingSubscription.length > 0) {
        // Update existing subscription
        await db
            .update(Schema.userSubscription)
            .set(subscriptionData)
            .where(eq(Schema.userSubscription.stripe_subscription_id, subscription.id))
    } else {
        // Create new subscription
        await db.insert(Schema.userSubscription).values(subscriptionData)
    }
}
