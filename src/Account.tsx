import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Callback = () => {
  const [searchParams] = useSearchParams();

  const handleGetToken = useCallback(async () => {
    const clientId = 'shp_8d2cdc84-d967-405f-962c-739d2d838eb6';
    const body = new URLSearchParams();

    body.append('grant_type', 'authorization_code');
    body.append('client_id', clientId);
    body.append('redirect_uri', `https://internal-sadly-stag.ngrok-free.app/callback`);
    body.append('code', searchParams.get('code') as string);

    // Public Client
    const codeVerifier = localStorage.getItem('code-verifier') as string;
    body.append('code_verifier', codeVerifier);

    const headers = {
      'content-type': 'application/x-www-form-urlencoded',
    };

    const response = await fetch(`https://shopify.com/68099145966/auth/oauth/token`, {
      method: 'POST',
      headers: headers,
      body,
    });

    const { access_token, expires_in, id_token, refresh_token } = await response.json();

    console.log('Response: ', {
      access_token,
      expires_in,
      id_token,
      refresh_token,
    });
  }, [searchParams]);

  useEffect(() => {
    handleGetToken();
  }, [searchParams, handleGetToken]);

  return <div>Callback</div>;
};

export default Callback;
