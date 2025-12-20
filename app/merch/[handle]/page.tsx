'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Variant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: Variant;
    }>;
  };
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const handle = params.handle as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!handle) return;
    fetch(`/api/shopify/product/${handle}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProduct(data.product);
          if (data.product?.variants.edges[0]) {
            setSelectedVariant(data.product.variants.edges[0].node.id);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load product');
        setLoading(false);
      });
  }, [handle]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    setAddingToCart(true);
    try {
      const cartId = localStorage.getItem('shopify_cart_id');
      const response = await fetch('/api/shopify/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId: selectedVariant,
          quantity,
          cartId,
        }),
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        if (data.cartId) {
          localStorage.setItem('shopify_cart_id', data.cartId);
        }
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }
      }
    } catch {
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <p className="text-[#2c2c2c]">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <p className="text-[#8B0000]">Error: {error || 'Product not found'}</p>
      </div>
    );
  }

  const selectedVariantData = product.variants.edges.find(
    (v) => v.node.id === selectedVariant
  )?.node;
  const price = selectedVariantData
    ? parseFloat(selectedVariantData.price.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount);

  return (
    <div className="min-h-screen bg-[#f5f3f0] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="text-[#8B0000] hover:text-[#700000] mb-6"
        >
          ← Back to Merch
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              {product.images.edges.length > 0 && (
                <div className="relative w-full h-96 mb-4">
                  <Image
                    src={product.images.edges[0].node.url}
                    alt={product.images.edges[0].node.altText || product.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              {product.images.edges.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.edges.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="relative w-full h-20">
                      <Image
                        src={img.node.url}
                        alt={img.node.altText || product.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-[#2c2c2c] mb-4">
                {product.title}
              </h1>
              <p className="text-2xl font-bold text-[#8B0000] mb-6">
                ${price.toFixed(2)} {product.priceRange.minVariantPrice.currencyCode}
              </p>

              {product.description && (
                <div
                  className="text-[#2c2c2c] mb-6"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {/* Variant Selection */}
              {product.variants.edges.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#2c2c2c] mb-2">
                    Variant
                  </label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {product.variants.edges.map((variant) => (
                      <option
                        key={variant.node.id}
                        value={variant.node.id}
                        disabled={!variant.node.availableForSale}
                      >
                        {variant.node.title}
                        {!variant.node.availableForSale && ' (Out of Stock)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#2c2c2c] mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedVariantData?.availableForSale}
                className="w-full bg-[#8B0000] hover:bg-[#700000] text-white font-semibold py-3 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

