import { db } from '@/lib/db/drizzle';
import { feature, planFeature, userSubscription } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getStripeProduct } from '@/lib/services/stripe';

/**
 * Get user's active subscription (there should only be one)
 */
export async function getUserActiveSubscription(userId: string) {
    const activeSubscriptions = await db
        .select()
        .from(userSubscription)
        .where(
            and(
                eq(userSubscription.user_id, userId),
                eq(userSubscription.status, 'active')
            )
        )
        .limit(1);

    return activeSubscriptions.length > 0 ? activeSubscriptions[0] : null;
}

/**
 * Get all free features
 */
export async function getAllFreeFeatures(activeOnly = true) {
    let freeFeatures = await db
        .select()
        .from(feature)
        .where(eq(feature.is_paid, false));

    if (activeOnly) {
        freeFeatures = freeFeatures.filter(f => f.is_active);
    }

    return freeFeatures;
}

/**
 * Get all features available to a user based on their active subscription
 */
export async function getUserAvailableFeatures(userId: string, activeOnly = true) {
    const activeSubscription = await getUserActiveSubscription(userId);

    let stripeProductId = null;
    let userFeatures = await getAllFreeFeatures(activeOnly);

    if (activeSubscription) {
        stripeProductId = activeSubscription.stripe_product_id;

        let planFeatures = (await db
            .select()
            .from(feature)
            .innerJoin(planFeature, eq(feature.id, planFeature.feature_id))
            .where(
                eq(planFeature.stripe_product_id, stripeProductId)
            )).map(f => f.feature);
        
        if (activeOnly) {
            planFeatures = planFeatures.filter(f => f.is_active);
        }

        userFeatures = [...userFeatures, ...planFeatures];
    }

    return userFeatures;
}

/**
 * Check if user has access to a specific feature
 */
export async function hasFeatureAccess(
    userId: string,
    featureName: string
): Promise<boolean> {
    const userFeatures = await getUserAvailableFeatures(userId);
    return userFeatures.some(feature => feature.name === featureName);
}

/**
 * Get user's current plan information
 */
export async function getUserCurrentPlan(userId: string) {
    const activeSubscription = await getUserActiveSubscription(userId);

    if (!activeSubscription) {
        return {
            plan_name: 'free',
            stripe_product_id: null,
            subscription: null
        };
    }

    return {
        plan_name: (await getStripeProduct(activeSubscription.stripe_product_id)).name,
        stripe_product_id: activeSubscription.stripe_product_id,
        subscription: activeSubscription
    };
}