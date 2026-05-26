import Stripe from 'stripe';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Missing items array' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51O1dummy', {
      apiVersion: '2025-02-24.acacia' as any,
    });

    const lineItems = items.map((item: any) => {
      // Stripe requires valid, public HTTP(S) URLs. Localhost or relative paths will fail.
      const validImage = item.image && item.image.startsWith('http') && !item.image.includes('localhost') 
        ? [item.image] 
        : undefined;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.name,
            images: validImage,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    // Detect host protocol and origin
    const host = req.headers.host || 'tsrskinandhaircare.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      payment_intent_data: {
        description: items.map((i: any) => i.name).join(', '),
      },
      success_url: `${origin}/success`,
      cancel_url: `${origin}/checkout`,
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe Error] Failed to create checkout session:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
