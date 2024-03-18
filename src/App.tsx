import './App.css';
import { generateCodeChallenge, generateCodeVerifier, generateNonce, generateState } from './utils';

function App() {
  const handleAuthentication = async () => {
    const clientId = 'shp_8d2cdc84-d967-405f-962c-739d2d838eb6';
    const authorizationRequestUrl = new URL(`https://shopify.com/68099145966/auth/oauth/authorize`);

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
      `https://internal-sadly-stag.ngrok-free.app/callback`,
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
