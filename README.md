# @switchboard/harness-adapter

**Paperclip runs. HarnessRouter executes.**

An adapter, not another control plane. Paperclip owns the UI (Kanban, diff, token meter); this repo is server-side glue that turns one Paperclip run into one UHP task on HarnessRouter.

## Install

```bash
npm i @switchboard/harness-adapter
# peer: @paperclipai/adapter-utils
```

## Quick start

```ts
import adapter from "@switchboard/harness-adapter";

// Register with Paperclip
export default {
  type: adapter.type,              // "harnessrouter"
  execute: adapter.execute,
  testEnvironment: adapter.testEnvironment,
};

// Per-run config (all optional; sensible defaults shown)
adapter.execute(ctx, {
  baseUrl: "http://127.0.0.1:3200/api/harness",
  apiKeyFile: "~/.harnessrouter/api-key",
  harnessId: "codex",
  timeoutSeconds: 900,
});
```

## Configuration

All fields are optional and resolved in this order: `adapterConfig` → environment variable → default.

| Field | Env var | Default | Description |
|-------|---------|---------|-------------|
| `baseUrl` | `HARNESSROUTER_BASE_URL` | `http://localhost:3000/api/harness` | HarnessRouter console API root (not the internal gateway port) |
| `apiKey` | `HARNESSROUTER_API_KEY` | — | Inline key (not recommended; see `apiKeyFile`) |
| `apiKeyFile` | `HARNESSROUTER_API_KEY_FILE` | `~/.harnessrouter/api-key` | Path to a `chmod 600` file containing the key |
| `harnessId` | `HARNESSROUTER_HARNESS_ID` | `null` (server default) | Target harness (e.g. `codex`, `claude-code`, `hermes`) |
| `model` | — | `null` (server default) | Override the harness model |
| `instructions` | — | `""` | Additional system instructions appended to the prompt |
| `timeoutSeconds` | — | `900` (15 min) | Overall task timeout |
| `maxRetries` | — | `3` | Retries before first UHP event arrives |
| `protocolVersion` | — | `null` (auto) | Explicit UHP version; validated at startup |

## Environment variables

```bash
# Required unless apiKey or apiKeyFile is set in adapterConfig
HARNESSROUTER_API_KEY=sk-...
# Optional overrides
HARNESSROUTER_BASE_URL=http://127.0.0.1:3200/api/harness
HARNESSROUTER_HARNESS_ID=codex
HARNESSROUTER_API_KEY_FILE=~/.harnessrouter/api-key
```

## Compatibility matrix

| Paperclip | @paperclipai/adapter-utils | HarnessRouter | UHP |
|-----------|----------------------------|---------------|-----|
| `≥2026.11` | `≥2026.1106.0` | `≥0.1.0` | `v1` |

The adapter is tested against the public `harnessrouterjs@0.1.0` client. If the server reports an unsupported protocol version, `testEnvironment` surfaces it as an error.

## Semantics guarantees

| Guarantee | Implementation |
|-----------|----------------|
| **Failed request ≠ failed task** | Non-2xx → UHP error envelope (retryable). HTTP 200 with `status: "failed"` → result, never retried. |
| **Dropped stream recovery** | If SSE ends early and we have a `responseId` *and* this is not a resumed run, `GET /v1/responses/{id}` reads the stored response. |
| **Conversation continuity** | `previous_response_id` is derived from Paperclip's session codec. Mismatched `baseUrl`/`harnessId` invalidates the id and starts fresh. |
| **Secrets stay out of logs** | Key resolution order: `adapterConfig.apiKey` → `HARNESSROUTER_API_KEY` → file. Tool arguments never logged; only tool names. |
| **Smart retries** | Retries only before first event arrives, under a deterministic idempotency key per run (`paperclip-{runId}`). |
| **testEnvironment()** | Three read-only probes: UHP discovery, authenticated harness listing, harness existence. |

## Development

```bash
npm test        # 55 tests (vitest, in-process mock UHP)
npm run typecheck  # tsc --noEmit (clean)
npm run build   # tsc → dist/
```

### Smoke test (requires live HarnessRouter)

```bash
HARNESSROUTER_BASE_URL=http://127.0.0.1:3200/api/harness \
node scripts/smoke.mjs codex
```

## Why not Paperclip's built-in adapters?

Paperclip ships adapters for OpenAI, Anthropic, and a generic HTTP target. This adapter exists because:

1. **HarnessRouter is a multi-harness gateway** — one endpoint routes to Codex, Claude Code, Hermes, Aider, OpenHands. The adapter encodes that routing (`harnessId`) and the UHP semantics (streaming, `previous_response_id`, idempotency keys, usage, error envelopes).
2. **UHP ≠ Responses API** — UHP has its own event stream (`response.output_text.delta`, `response.completed`, error envelopes with `retryable`), cancellation (`DELETE /v1/responses/{id}`), and stored-response recovery (`GET /v1/responses/{id}`). The adapter maps these 1:1 to Paperclip's contract.
3. **Operator ergonomics** — API keys live in a `chmod 600` file, never in Paperclip's DB or shell history. `testEnvironment` gives three green checks before a run starts.
4. **No UI duplication** — Paperclip owns Kanban, diff view, token meter, session history. This adapter does not ship a dashboard.

## License

Apache-2.0 © Switchboard