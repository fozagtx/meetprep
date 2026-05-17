import { config } from './config';
import { handleTranscribe, handleSummarize } from './routes';

const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // Health check endpoint
    if (url.pathname === '/healthz') {
      return new Response('OK', { status: 200 });
    }

    // Transcribe endpoint
    if (url.pathname === '/api/transcribe' && req.method === 'POST') {
      return handleTranscribe(req);
    }

    // Summarize endpoint
    if (url.pathname === '/api/summarize' && req.method === 'POST') {
      return handleSummarize(req);
    }

    // API routes
    if (url.pathname.startsWith('/api/')) {
      return new Response('Not implemented', { status: 501 });
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log(`Backend server running at http://localhost:${server.port}`);
console.log('Environment config loaded successfully');

// Made with Bob
