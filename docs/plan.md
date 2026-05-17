# Meeting Transcription & Summary - 1 Hour Build Plan

## P1 — Boot (15 min)

### Files Created/Edited
- `package.json` - Bun runtime, Vite, React, Tailwind dependencies
- `vite.config.ts` - Vite dev server config with proxy to backend
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript compiler options
- `index.html` - HTML entry point
- `src/server.ts` - Bun.serve HTTP server with /healthz endpoint
- `src/web/main.tsx` - React entry point
- `src/web/App.tsx` - Root component rendering "Hello"
- `src/config.ts` - Zod schema for environment variables
- `.env.example` - Template for required env vars

### End State
- `bun dev` serves http://localhost:3000 with "Hello" page
- GET /healthz returns 200

### Manual Test
```bash
bun dev
curl http://localhost:3000/healthz
```

---

## P2 — Transcribe (25 min)

### Files Created/Edited
- `src/watsonx.ts` - IAM token caching + Granite API client
- `src/stt.ts` - Watson STT HTTP API client (/v1/recognize)
- `src/routes.ts` - POST /api/transcribe endpoint
- `src/web/components/Recorder.tsx` - MediaRecorder UI with Record/Stop buttons

### End State
- Click Record button, speak into microphone
- Click Stop button
- Audio Blob POSTed to /api/transcribe
- Watson STT returns transcript text
- Transcript displayed on screen

### Manual Test
```bash
# In browser: click Record, speak "hello world", click Stop, see transcript
```

---

## P3 — Summarize (20 min)

### Files Created/Edited
- `src/summary.ts` - Granite prompt for structured summary generation
- `src/routes.ts` - POST /api/summarize endpoint
- `src/web/components/Summary.tsx` - Display summary, action items, decisions, follow-ups with Copy button

### End State
- After transcription, click "Summarize" button
- POST /api/summarize sends transcript to Granite
- Granite returns JSON: `{summary, action_items, decisions, follow_ups}`
- UI renders 4 sections with structured data
- "Copy to clipboard" button copies full summary

### Manual Test
```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"transcript":"We discussed the Q4 roadmap. John will handle the API. Sarah takes the frontend. Launch by Dec 15."}'
```

---

## Stack
- **Runtime**: Bun
- **Frontend**: Vite + React + Tailwind CSS
- **Backend**: Bun.serve
- **AI**: IBM watsonx.ai (granite-3-8b-instruct model)
- **STT**: IBM Watson Speech to Text (HTTP API)

## Environment Variables
```
IBM_CLOUD_API_KEY=
WATSONX_PROJECT_ID=
WATSONX_URL=https://us-south.ml.cloud.ibm.com
STT_APIKEY=
STT_URL=