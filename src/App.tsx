/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import './App.css';
import { SHOP_ID } from './common/constant';
import { client } from './config/storefrontClient';
import { generateCodeChallenge, generateCodeVerifier, generateNonce, generateState } from './utils';

// a Storefront API query
const GRAPHQL_QUERY = `
  query {
    shop {
      name
    }
  }
`;

function App() {
  const [shop, setShop] = useState<any>(null);

  const handleAuthentication = async () => {
    const clientId = import.meta.env.VITE_SHOPIFY_CLIENT_ID;
    const authorizationRequestUrl = new URL(`https://shopify.com/${SHOP_ID}/auth/oauth/authorize`);

    authorizationRequestUrl.searchParams.append(
      'scope',
      'openid email https://api.customers.com/auth/customer.graphql',
    );
    const state = await generateState();
    const nonce = await generateNonce(16);

    authorizationRequestUrl.searchParams.append('client_id', clientId);
    authorizationRequestUrl.searchParams.append('response_type', 'code');
    authorizationRequestUrl.searchParams.append(
      'redirect_uri',
      `${window.location.origin}/callback`,
    );
    authorizationRequestUrl.searchParams.append('state', state);
    authorizationRequestUrl.searchParams.append('nonce', nonce);

    // Public client
    const verifier = await generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem('code-verifier', verifier);

    authorizationRequestUrl.searchParams.append('code_challenge', challenge);
    authorizationRequestUrl.searchParams.append('code_challenge_method', 'S256');

    window.location.href = authorizationRequestUrl.toString();
  };

  const fetchShop = async () => {
    const response = await fetch(client.getStorefrontApiUrl(), {
      body: JSON.stringify({
        query: GRAPHQL_QUERY,
      }),
      headers: client.getPublicTokenHeaders(),
      method: 'POST',
    });
    const data = await response.json();
    setShop(data?.data?.shop);
  };

  useEffect(() => {
    fetchShop();
  }, []);

  return (
    <>
      <div>
        <h3>Shopify Customer Authentication</h3>
        <p>Shop name: {shop?.name}</p>
        <button onClick={handleAuthentication}>Authenticate with Shopify</button>
      </div>
    </>
  );
}

export default App;
