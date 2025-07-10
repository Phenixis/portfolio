# Payment System Documentation

This document describes the complete Stripe payment integration for the Life OS application.

## Overview

The payment system handles subscription-based billing through Stripe, including:
- Checkout session creation
- Webhook handling for payment events
- Subscription management (cancellation, updates)
- Database synchronization

## Architecture

### Database Schema

The payment system uses the following tables:

#### `user` table
- `stripe_customer_id`: Links user to Stripe customer

#### `userSubscription` table
- Stores subscription details from Stripe
- Tracks status, billing periods, and cancellation info

#### `feature` table
- Defines available features

#### `planFeature` table
- Maps Stripe products to features

### API Endpoints

#### 1. Create Checkout Session
**POST** `/api/stripe/create-checkout-session`

Creates a Stripe checkout session for subscription purchase.

**Request:**
```json
{
    "priceId": "price_xxx",
    "successUrl": "https://app.com/success",
    "cancelUrl": "https://app.com/cancel"
}
```

**Response:**
```json
{
    "sessionId": "cs_xxx",
    "url": "https://checkout.stripe.com/xxx"
}
```

#### 2. Webhook Handler
**POST** `/api/stripe/webhook`

Handles Stripe webhook events:
- `checkout.session.completed`: Creates subscription record
- `invoice.payment_succeeded`: Updates subscription
- `customer.subscription.updated`: Syncs subscription changes
- `customer.subscription.deleted`: Marks subscription as cancelled

#### 3. Cancel Subscription
**POST** `/api/stripe/cancel-subscription` - Cancel at period end
**DELETE** `/api/stripe/cancel-subscription` - Cancel immediately

#### 4. Subscription Status
**GET** `/api/stripe/subscription-status`

Returns current user's subscription status.

### Frontend Components

#### Hooks

##### `useCheckout`
Handles checkout flow and subscription cancellation.

```typescript
const { createCheckoutSession, cancelSubscription, isLoading, error } = useCheckout({
    onSuccess: () => console.log('Success'),
    onError: (error) => console.error(error)
})
```

##### `useSubscription`
Manages subscription status state.

```typescript
const { subscriptionStatus, isLoading, error, refetch } = useSubscription()
```

#### Updated PricingCard Component
- Integrated checkout flow
- Loading states and error handling
- Free plan handling

## Environment Variables

Add these to your `.env` file:

```bash
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Setup Instructions

### 1. Stripe Configuration

1. Create Stripe products and prices
2. Set up webhook endpoint at `/api/stripe/webhook`
3. Configure webhook events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 2. Database Migration

Ensure the following tables exist with proper schema:
- `user` (with `stripe_customer_id` field)
- `userSubscription`
- `feature`
- `planFeature`

### 3. Frontend Integration

```tsx
import { useCheckout } from '@/hooks/use-checkout'

function PricingCard({ priceId }) {
    const { createCheckoutSession, isLoading } = useCheckout()
    
    const handlePurchase = () => {
        createCheckoutSession(priceId)
    }
    
    return (
        <button onClick={handlePurchase} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Subscribe'}
        </button>
    )
}
```

## Security Considerations

1. **Webhook Signature Verification**: All webhooks are verified using Stripe's signature
2. **API Key Authentication**: All endpoints require valid API key
3. **User Authorization**: Users can only access their own subscription data
4. **Environment Variables**: Sensitive keys are stored in environment variables

## Error Handling

The system includes comprehensive error handling:
- Invalid signatures on webhooks
- Missing authentication
- Stripe API errors
- Database operation failures

All errors are logged and appropriate HTTP status codes are returned.

## Testing

### Webhook Testing
Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Test Cards
Use Stripe's test card numbers for testing different scenarios:
- `4242424242424242` - Successful payment
- `4000000000000002` - Card declined

## Monitoring

Monitor the following:
- Webhook delivery success rates
- Payment success/failure rates
- Subscription churn metrics
- Database synchronization issues

## Future Enhancements

Potential improvements:
1. Proration handling for plan changes
2. Trial period management
3. Usage-based billing
4. Multi-currency support
5. Invoice management
6. Subscription analytics dashboard
