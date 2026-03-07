'use client'

import { useCallback } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { startQuoteCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface QuoteItem {
  id: string
  name: string
  priceValue: number
  quantity: number
  unit: string
}

interface StripeCheckoutProps {
  items: QuoteItem[]
  subtotal: number
  iva: number
  total: number
}

export default function StripeCheckout({ items, subtotal, iva, total }: StripeCheckoutProps) {
  const fetchClientSecret = useCallback(
    () => startQuoteCheckoutSession(items, subtotal, iva, total),
    [items, subtotal, iva, total]
  )

  return (
    <div id="stripe-checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
