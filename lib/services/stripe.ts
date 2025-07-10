import Stripe from 'stripe';

const stripeApiKey = process.env.STRIPE_API_KEY;
if (!stripeApiKey) {
    throw new Error('Stripe API key is not set in environment variables');
}

export const stripe = new Stripe(stripeApiKey);

/**
 * Get all Stripe's products
 */
export async function getAllStripeProducts(): Promise<Stripe.Product[]> {
    const products = await stripe.products.list();
    return products.data;
}

/**
 * Get a specific Stripe product by its ID
 */
export async function getStripeProduct(stripeProductId: string): Promise<Stripe.Product> {
    const product = await stripe.products.retrieve(stripeProductId);
    return product;
}

