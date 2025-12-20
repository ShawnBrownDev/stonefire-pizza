import { GraphQLClient } from 'graphql-request';

const shopifyStorefrontUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL!;
const shopifyStorefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

if (!shopifyStorefrontUrl || !shopifyStorefrontToken) {
  throw new Error('Missing Shopify environment variables');
}

const client = new GraphQLClient(`${shopifyStorefrontUrl}/api/2024-01/graphql.json`, {
  headers: {
    'X-Shopify-Storefront-Access-Token': shopifyStorefrontToken,
    'Content-Type': 'application/json',
  },
});

// GraphQL queries
const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
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
}

export interface ShopifyProductDetail extends ShopifyProduct {
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
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
}

export async function getProducts(first: number = 20) {
  const data = await client.request<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(
    PRODUCTS_QUERY,
    { first }
  );
  return data.products.edges.map((edge) => edge.node);
}

export async function getProduct(handle: string) {
  const data = await client.request<{ product: ShopifyProductDetail | null }>(
    PRODUCT_QUERY,
    { handle }
  );
  return data.product;
}

export async function getCollections(first: number = 10) {
  const data = await client.request<{
    collections: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          image: {
            url: string;
            altText: string | null;
          } | null;
        };
      }>;
    };
  }>(COLLECTIONS_QUERY, { first });
  return data.collections.edges.map((edge) => edge.node);
}

export async function createCart(variantId: string, quantity: number = 1) {
  const data = await client.request<{
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
      } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(CREATE_CART_MUTATION, {
    input: {
      lines: [
        {
          merchandiseId: variantId,
          quantity,
        },
      ],
    },
  });
  return data.cartCreate;
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1) {
  const data = await client.request<{
    cartLinesAdd: {
      cart: {
        id: string;
        checkoutUrl: string;
      } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(ADD_TO_CART_MUTATION, {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  });
  return data.cartLinesAdd;
}

