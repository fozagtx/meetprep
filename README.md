# meetprep

A web app that records meetings, transcribes them with **IBM Watson Speech-to-Text**, summarizes them with **IBM watsonx.ai (Granite)**, and saves the summary as a Markdown note in your Obsidian vault.

Built for the **IBM Bob Hackathon** using **IBM Bob IDE** as the primary development tool.

## What it does

1. Connect your local Obsidian vault (browser File System Access API — vault never leaves your machine).
2. Record a meeting from your mic.
3. Get a live transcript via IBM Watson STT.
4. Generate a structured summary (`summary`, `action_items`, `decisions`, `follow_ups`) via watsonx.ai `granite-3-8b-instruct`.
5. Save the summary as a new `.md` file in the vault's `/Meetings` folder.

## Stack

- **Runtime:** Bun
- **Web:** Vite + React + Tailwind
- **Transcription:** IBM Watson Speech-to-Text (HTTP `/v1/recognize`)
- **LLM:** IBM watsonx.ai `ibm/granite-3-8b-instruct`
- **Auth:** IBM Cloud IAM bearer token (server-side only, cached 50 min)
- **Vault:** browser `showDirectoryPicker()` — files stay local

## Requirements

- [Bun](https://bun.sh) 1.3+
- A **Chromium-based browser** (Chrome, Edge, Arc). Brave works if you disable shields for `localhost`. Firefox and Safari are not supported — they don't implement the File System Access API.
- An IBM Cloud account with access to:
  - **Watson Speech-to-Text** instance
  - **watsonx.ai** project (region: Dallas)

## Setup

```bash
git clone https://github.com/fozagtx/meetprep.git
cd meetprep
bun install
cp .env.example .env
# fill in the 5 values in .env (see below)
bun dev
```

Open <http://localhost:3000>.

## Environment variables

| Var | Where to get it |
|---|---|
| `IBM_CLOUD_API_KEY` | IBM Cloud → **Manage → Access (IAM) → API keys → Create** |
| `WATSONX_PROJECT_ID` | <https://dataplatform.cloud.ibm.com/projects> → open your project → **Manage** tab → **General** |
| `WATSONX_URL` | `https://us-south.ml.cloud.ibm.com` (Dallas region) |
| `STT_APIKEY` | IBM Cloud → **Resource list → Speech to Text instance → Service credentials** → `apikey` |
| `STT_URL` | Same place → `url` |

## How it works

```
Browser                       Bun server                IBM Cloud
───────                       ──────────                ─────────
Mic → MediaRecorder ──POST──> /api/transcribe ──HTTP──> Watson STT
                              (audio Blob)              (returns transcript)
                                   ↓
                              transcript text
                                   ↓
"Summarize" ───────POST──────> /api/summarize ──HTTPS─> watsonx.ai
                              (transcript)              Granite
                                   ↓
                              { summary, action_items,
                                decisions, follow_ups }
                                   ↓
"Save to vault" ─────write────> Obsidian /Meetings/meeting-YYYY-MM-DD-HHMM.md
                (browser FS API, never touches server)
```

## Project structure

```
src/
  server.ts                Bun.serve — static + JSON API
  routes.ts                request router
  config.ts                zod env validation
  watsonx.ts               IAM token cache + Granite client
  stt.ts                   Watson STT HTTP client
  summary.ts               transcript → structured summary
  web/
    main.tsx, App.tsx
    hooks/useVault.ts
    components/Recorder.tsx, Summary.tsx,
               VaultPicker.tsx, SaveToVault.tsx
```

## Hackathon notes

- Built with IBM Bob IDE — see `bob_sessions/` for task session reports.
- Project plan in `docs/plan.md`.
- Agent instructions for Bob in `AGENTS.md`.
- Model used: `ibm/granite-3-8b-instruct` (default). Banned hackathon models (llama-3-405b, mistral-medium, mistral-small-3-1) are not used.

## License

MIT
