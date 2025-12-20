import { NextResponse } from 'next/server';
import { getProduct } from '@/app/lib/shopify';

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  try {
    const product = await getProduct(params.handle);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

