import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CLIENT_ID, SHOP_ID } from './common/constant';

const Callback = () => {
  const [searchParams] = useSearchParams();

  const handleExchangeToken = async () => {
    const customerApiClientId = '30243aa5-17c1-465a-8493-944bcc4e88aa';
    const accessToken = localStorage.getItem('access_token') as string;
    const body = new URLSearchParams();

    body.append('grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange');
    body.append('client_id', CLIENT_ID);
    body.append('audience', customerApiClientId);
    body.append('subject_token', accessToken);
    body.append('subject_token_type', 'urn:ietf:params:oauth:token-type:access_token');
    body.append('scopes', 'https://api.customers.com/auth/customer.graphql');

    const headers = {
      'content-type': 'application/x-www-form-urlencoded',
    };

    const response = await fetch(`https://shopify.com/${SHOP_ID}/auth/oauth/token`, {
      method: 'POST',
      headers: headers,
      body,
    });

    const { access_token } = await response.json();

    if (access_token) {
      console.log('Exchange Token: ', access_token);
      const customerResponse = await fetch(
        `https://shopify.com/${SHOP_ID}/account/customer/api/unstable/graphql`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: access_token,
          },
          body: JSON.stringify({
            query: 'query { customer { id }}',
            variables: {},
          }),
        },
      );
      console.log('Customer Response: ', await customerResponse.json());
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGetToken = async () => {
    const body = new URLSearchParams();

    body.append('grant_type', 'authorization_code');
    body.append('client_id', CLIENT_ID);
    body.append('redirect_uri', `${window.location.origin}/callback`);
    body.append('code', searchParams.get('code') as string);

    // Public Client
    const codeVerifier = localStorage.getItem('code-verifier') as string;
    body.append('code_verifier', codeVerifier);

    const headers = {
      'content-type': 'application/x-www-form-urlencoded',
    };

    const response = await fetch(`https://shopify.com/${SHOP_ID}/auth/oauth/token`, {
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
    if (access_token) {
      localStorage.setItem('access_token', access_token);
      await handleExchangeToken();
    }
  };

  useEffect(() => {
    console.log('Callback');
    handleGetToken();
  }, [searchParams, handleGetToken]);

  return <div>Callback</div>;
};

export default Callback;
