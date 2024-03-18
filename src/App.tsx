import './App.css';
import { SHOP_ID } from './common/constant';
import { generateCodeChallenge, generateCodeVerifier, generateNonce, generateState } from './utils';

function App() {
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

  return (
    <>
      <div>
        <h3>Shopify Customer Authentication</h3>
        <button onClick={handleAuthentication}>Authenticate with Shopify</button>
      </div>
    </>
  );
}

export default App;
