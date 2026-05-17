import { config } from './config';

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  // Get basic auth token
  const auth = btoa(`apikey:${config.STT_APIKEY}`);

  const contentType = audioBlob.type || 'audio/webm;codecs=opus';
  const url = `${config.STT_URL.replace(/\/$/, '')}/v1/recognize?model=en-US_BroadbandModel`;

  console.log(`[STT] POST ${url} (${audioBlob.size} bytes, ${contentType})`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': contentType,
    },
    body: audioBlob,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[STT] ${response.status} ${response.statusText}: ${error}`);
    throw new Error(`STT API request failed: ${response.status} ${response.statusText} - ${error}`);
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
