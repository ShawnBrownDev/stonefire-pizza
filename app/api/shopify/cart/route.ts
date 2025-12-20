import { NextResponse } from 'next/server';
import { createCart, addToCart } from '@/app/lib/shopify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variantId, quantity, cartId } = body;

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    if (cartId) {
      // Add to existing cart
      const result = await addToCart(cartId, variantId, quantity || 1);
      if (result.userErrors.length > 0) {
        return NextResponse.json(
          { error: result.userErrors[0].message },
          { status: 400 }
        );
      }
      return NextResponse.json({
        cartId: result.cart?.id,
        checkoutUrl: result.cart?.checkoutUrl,
      });
    } else {
      // Create new cart
      const result = await createCart(variantId, quantity || 1);
      if (result.userErrors.length > 0) {
        return NextResponse.json(
          { error: result.userErrors[0].message },
          { status: 400 }
        );
      }
      return NextResponse.json({
        cartId: result.cart?.id,
        checkoutUrl: result.cart?.checkoutUrl,
      });
    }
  } catch (error) {
    console.error('Error with cart:', error);
    return NextResponse.json(
      { error: 'Failed to process cart' },
      { status: 500 }
    );
  }
}

