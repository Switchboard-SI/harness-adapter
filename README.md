# @switchboard/harness-adapter

[![CI](https://github.com/Switchboard-SI/harness-adapter/actions/workflows/ci.yml/badge.svg)](https://github.com/Switchboard-SI/harness-adapter/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@switchboard/harness-adapter.svg)](https://www.npmjs.com/package/@switchboard/harness-adapter)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-green.svg)](https://nodejs.org)

> A [Paperclip](https://github.com/paperclipai/paperclip) `ServerAdapterModule` that runs agents on
> [HarnessRouter](https://github.com/HarnessRouter/harnessrouter) over the Unified Harness Protocol
> (UHP).

[View the landing page →](https://switchboard-si.github.io/harness-adapter/)

---

## What it does

HarnessRouter routes an agent task to a configured harness (Claude Code, Codex, Hermes, Aider,
OpenHands…) and returns an OpenAI Responses-compatible stream. Paperclip speaks a different adapter
contract. This package is the translation layer: one Paperclip run becomes one UHP task, with
conversation continuity, cancellation, usage and error classification mapped onto Paperclip's
execution contract — nothing more, nothing invented.

```
┌─────────────────┐     UHP task       ┌──────────────────────┐
│   Paperclip     │ ─────────────────▶ │  HarnessRouter + UHP │
│   (your app)    │    adapter layer   │  (Claude Code, Codex,  │
│                 │                    │   Hermes, Aider…)      │
└─────────────────┘ ◀───────────────── └──────────────────────┘
                 streamed result
```

## Install

```bash
npm install @switchboard/harness-adapter
```

## Requirements

- Node.js 20+
- A HarnessRouter Community Edition instance (or any server that passes the UHP conformance suite)
- A HarnessRouter **CE API key** — created in the console under **API Keys**, not the console
  password and not the model-provider key

## Configuration

Pass the config when registering the adapter with Paperclip:

```ts
{
  "baseUrl": "http://127.0.0.1:3200/api/harness",
  "apiKeyFile": "~/.harnessrouter/api-key",
  "harnessId": "hermes",
  "timeoutSeconds": 900
}
```

| Key | Default | Notes |
| --- | --- | --- |
| `baseUrl` | `http://localhost:3000/api/harness` | The **console** API root. Not the internal gateway port `8080` — that one is loopback-only inside the container and is not reachable from outside. |
| `apiKey` | `$HARNESSROUTER_API_KEY` | Preferred: leave unset and supply through the environment. |
| `apiKeyFile` | `$HARNESSROUTER_API_KEY_FILE`, then `~/.harnessrouter/api-key` | Read only when neither `apiKey` nor `HARNESSROUTER_API_KEY` is set. `chmod 600` the file and it never enters Paperclip's database or shell history. `~` is expanded. |
| `harnessId` | server default | Which configured harness runs the task. |
| `model` | harness default | Passed through to the harness. |
| `instructions` | a short Paperclip reminder | System instructions for the run. |
| `timeoutSeconds` | `900` | Agent tasks run for minutes; do not set this to `30`. |
| `maxRetries` | `2` | Retries apply to request failures only, never to a task that already started. |
| `protocolVersion` | client default | Pinned UHP version to request. Verified against the server in `testEnvironment()`. |

## What the mapping guarantees

- **A failed request is not a failed task.** A non-2xx response carries a UHP error envelope and is
  classified (`configuration`, `provider_quota`, `transient_upstream`). A task that ran and failed
  arrives as HTTP 200 with `status: "failed"` — retrying it would run the agent (and the bill) a
  second time.
- **A dropped stream is not a failed task.** If the SSE connection ends early, the adapter reads the
  stored response back by id. The stream is an optimisation; the stored response is the truth.
- **Sessions are response ids.** `previous_response_id` continues the conversation. The id is scoped
  to the server and harness that minted it; a mismatched id starts a fresh conversation instead of
  failing the run.
- **Idempotency keys are deterministic per Paperclip run**, so a retry of the same run cannot start
  the same work twice.
- **A task is retried only when nothing ran.** If the request fails before the first event arrives,
  the adapter retries up to `maxRetries` under the same idempotency key. Once any event has been
  seen, it never retries on its own — the work may already be underway.
- **Secrets stay out of logs.** Tool-call arguments are never rendered — only the tool name.

## Using it in Paperclip

```ts
import adapter from "@switchboard/harness-adapter";

// Register `adapter` alongside Paperclip's built-in adapters.
// Its `type` is "harnessrouter".
```

## `testEnvironment()`

Performs three probes and never writes anything: unauthenticated UHP discovery, an authenticated
harness listing, and — when `harnessId` is set — a check that the harness exists. Call it at startup
to validate configuration before accepting runs.

## Development

```bash
git clone https://github.com/Switchboard-SI/harness-adapter.git
cd harness-adapter
npm install
npm test        # 55 tests, no network or Docker required
npm run typecheck
npm run build   # emits dist/ with type declarations
```

Tests run the real `harnessrouterjs` client against a small in-process UHP server
(`test/mock-uhp.ts`), so the HTTP path is exercised rather than stubbed.

CI runs on Node 20, 22 and 24.

### Live smoke test

With a HarnessRouter instance and an API key:

```bash
HARNESSROUTER_BASE_URL=http://127.0.0.1:3200/api/harness \
HARNESSROUTER_API_KEY=... \
npm run smoke -- codex
```

Runs discovery, `testEnvironment()`, and one real streamed task.

## Compatibility

| Component | Version |
| --- | --- |
| HarnessRouter CE | `0.40.2` (image digest `sha256:ffc595937898c902824e815086d4b51044a9a466dcc20467ea4543e8f6d28f70`) |
| UHP | server default `2026-10-04` (also accepts `2026-09-28`, `2026-09-12`, `2026-08-11`) |
| harnessrouterjs | `0.1.0` |
| @paperclipai/adapter-utils | `2026.1106.0` |
| Node.js | `>=20` |

## Security

- The API key belongs in the environment, a `chmod 600` file, or Paperclip's config store — never
  in browser code. The adapter never logs the key; diagnostics name only the file it read.
- Keep the console bound to loopback (`-p 127.0.0.1:3000:3000`). Public deployment needs TLS and a
  reachable console URL; see HarnessRouter's own deployment guide.
- Report vulnerabilities privately rather than in a public issue: see [SECURITY.md](SECURITY.md).

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md).

## License

[Apache-2.0](LICENSE). Copyright Switchboard.

---

<div align="center">
  Built with <a href="https://github.com/paperclipai/paperclip">Paperclip</a> ·
  <a href="https://github.com/HarnessRouter/harnessrouter">HarnessRouter</a> ·
  <a href="https://github.com/Switchboard-SI">Switchboard</a>
</div>
