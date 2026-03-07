'use server'

import { stripe } from '@/lib/stripe'

interface QuoteItem {
  id: string
  name: string
  priceValue: number
  quantity: number
  unit: string
}

export async function startQuoteCheckoutSession(items: QuoteItem[], subtotal: number, iva: number, total: number) {
  // Create line items from the quote
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'mxn',
      product_data: {
        name: item.name,
        description: `${item.unit} x ${item.quantity}`,
      },
      unit_amount: Math.round(item.priceValue * 100), // Convert to centavos
    },
    quantity: item.quantity,
  }))

  // Add IVA as a separate line item
  lineItems.push({
    price_data: {
      currency: 'mxn',
      product_data: {
        name: 'IVA (16%)',
        description: 'Impuesto al Valor Agregado',
      },
      unit_amount: Math.round(iva * 100),
    },
    quantity: 1,
  })

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: lineItems,
    mode: 'payment',
    metadata: {
      subtotal: subtotal.toString(),
      iva: iva.toString(),
      total: total.toString(),
    },
  })

  return session.client_secret
}
