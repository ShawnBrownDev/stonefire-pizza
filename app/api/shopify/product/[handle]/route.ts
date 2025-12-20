import { NextResponse } from 'next/server';
import { getProduct } from '@/app/lib/shopify';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const product = await getProduct(handle);
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

