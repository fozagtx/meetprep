# Meetly — Agent Instructions

Project rules for Bob when working in this repo.

## What this is

A web app for meeting preparation, real-time transcription, and AI summaries,
wired into the user's local Obsidian vault. Built for the IBM Bob Hackathon —
must showcase IBM Bob IDE as a core development tool and must use IBM Watson
Speech-to-Text + IBM watsonx.ai (granite-3-8b-instruct) as runtime services.

Flow: user connects their Obsidian vault (browser File System Access API) →
records a meeting, audio is POSTed to Watson STT for transcription → stop
produces a structured summary via watsonx.ai Granite → save writes a new `.md`
back into the vault.

Real IBM services only. No mock STT, no fake Granite responses. If env vars
aren't set, the relevant endpoint returns a clear error — never fake a result.

## Stack

- Runtime: Bun 1.3+
- Web: Vite + React + Tailwind
- Transcription: IBM Watson Speech-to-Text (HTTP `/v1/recognize`)
- LLM: IBM watsonx.ai REST, model `ibm/granite-3-8b-instruct`
- Auth: IBM Cloud IAM bearer token (server-side only), cached 50 min
- Vault: browser `showDirectoryPicker()` — vault never leaves the user's machine

## Naming

camelCase for identifiers AND filenames. Never kebab-case or snake_case.

## Code quality

- `bun run typecheck` before considering done — must be clean.
- No `any`. Real types.
- No `process.env.X` outside `config.ts`.
- No silent `catch {}` — always log or rethrow.
- Zod-validate all LLM JSON responses before returning to the client.

## Env vars

```
IBM_CLOUD_API_KEY     required; used to exchange for IAM bearer token
WATSONX_PROJECT_ID    required; from watsonx.ai project Manage tab
WATSONX_URL           default 'https://us-south.ml.cloud.ibm.com' (Dallas)
STT_APIKEY            required; from watsonx-Hackathon STT service credentials
STT_URL               required; from watsonx-Hackathon STT service credentials
```

`.env` is gitignored. `.env.example` is committed with empty values.

## Banned models

Per the IBM Bob hackathon guide, do not use:
- `llama-3-405b-instruct`
- `mistral-medium-2502`, `mistral-medium-2505`
- `mistral-small-3-1-24b-instruct-2503`

Default and only model for v1: `ibm/granite-3-8b-instruct`.

## Anti-patterns

- Monorepo or workspaces. One `package.json`, one Bun process.
- Mocking STT or Granite. Fail loud if env vars are missing.
- Sending the IBM Cloud API key to the browser. IAM exchange is server-side only.
- Reading `process.env` outside `config.ts`.
- Embeddings / vector stores in v1. Keyword overlap is enough.
- Storing transcripts or summaries on the server. Everything lives in the vault.
- Committing `.env` or anything in `bob_sessions/` that contains an API key.

## Gotchas

- File System Access API only works on Chromium-based browsers. Brave needs shields off for localhost.
- Granite sometimes returns JSON wrapped in ```json fences. Strip fences before `JSON.parse`.
- Bun `--watch` does NOT reload `.env` automatically — kill and restart `bun dev` after editing env vars.
- IBM IAM grant_type must be exactly `urn:ibm:params:oauth:grant-type:apikey`.

## Hackathon requirements

- Bob IDE is a core component. All non-trivial code is written via Bob.
- Export every task session into `bob_sessions/` for judging.
- 40 Bobcoin hard cap.
- $80 IBM Cloud credit cap.
