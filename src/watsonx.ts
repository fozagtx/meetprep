import { config } from './config';

interface IAMToken {
  access_token: string;
  expiration: number;
}

let cachedToken: IAMToken | null = null;

async function getIAMToken(): Promise<string> {
  // Return cached token if still valid (with 5 min buffer)
  if (cachedToken && cachedToken.expiration > Date.now() + 300000) {
    return cachedToken.access_token;
  }

  const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: config.IBM_CLOUD_API_KEY,
    }),
  });

  if (!response.ok) {
    throw new Error(`IAM token request failed: ${response.statusText}`);
  }

  const data = await response.json();
  cachedToken = {
    access_token: data.access_token,
    expiration: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.access_token;
}

export async function callGranite(prompt: string): Promise<string> {
  const token = await getIAMToken();

  const response = await fetch(`${config.WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      input: prompt,
      model_id: 'ibm/granite-3-8b-instruct',
      project_id: config.WATSONX_PROJECT_ID,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Granite API request failed: ${response.statusText} - ${error}`);
  }

  const data = await response.json();
  return data.results[0].generated_text.trim();
}

// Made with Bob
