import { createStorefrontClient } from '@shopify/hydrogen-react';

export const client = createStorefrontClient({
  // load environment variables according to your framework and runtime
  storeDomain: import.meta.env.VITE_SHOPIFY_PUBLIC_STORE_DOMAIN,
  publicStorefrontToken: import.meta.env.VITE_SHOPIFY_PUBLIC_STOREFRONT_API_TOKEN,
});
