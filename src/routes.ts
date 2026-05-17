import { transcribeAudio } from './stt';
import { generateSummary } from './summary';

export async function handleTranscribe(req: Request): Promise<Response> {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile || !(audioFile instanceof Blob)) {
      return new Response(JSON.stringify({ error: 'No audio file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const transcript = await transcribeAudio(audioFile);

    return new Response(JSON.stringify({ transcript }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Transcription failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function handleSummarize(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { transcript } = body;

    if (!transcript || typeof transcript !== 'string') {
      return new Response(JSON.stringify({ error: 'No transcript provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const summary = await generateSummary(transcript);

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Summary error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Summary generation failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Made with Bob
