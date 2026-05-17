import { config } from './config';

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  // Get basic auth token
  const auth = btoa(`apikey:${config.STT_APIKEY}`);

  const response = await fetch(`${config.STT_URL}/v1/recognize`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'audio/webm',
    },
    body: audioBlob,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`STT API request failed: ${response.statusText} - ${error}`);
  }

  const data = await response.json();
  
  // Extract transcript from results
  if (data.results && data.results.length > 0) {
    const transcript = data.results
      .map((result: any) => result.alternatives[0]?.transcript || '')
      .join(' ')
      .trim();
    return transcript;
  }

  return '';
}

// Made with Bob
