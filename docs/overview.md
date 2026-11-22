# @switchboard/harness-adapter

A Paperclip `ServerAdapterModule` that runs agents on HarnessRouter over UHP.

- **Registry:** https://www.npmjs.com/package/@switchboard/harness-adapter
- **Source:** https://github.com/Switchboard-SI/harness-adapter
- **Docs:** https://github.com/Switchboard-SI/harness-adapter#readme
- **Landing page:** https://switchboard-si.github.io/harness-adapter/

## Overview

One Paperclip run becomes one Unified Harness Protocol (UHP) task. The adapter translates
Paperclip's `ServerAdapterModule` contract into HarnessRouter requests, handling conversation
continuity (`previous_response_id`), cancellation, usage reporting, error classification,
idempotency, and stored-response recovery when SSE streams drop.

## Supported harnesses

Claude Code, Codex, Hermes, Aider, OpenHands — anything HarnessRouter can route to.

## Installation

```bash
npm install @switchboard/harness-adapter
```

## Quick example

```ts
import adapter from "@switchboard/harness-adapter";

// Register with Paperclip. The adapter's `type` is "harnessrouter".
```

## Configuration

| Key | Default | Notes |
| --- | --- | --- |
| `baseUrl` | `http://localhost:3000/api/harness` | HarnessRouter console API root |
| `apiKey` | `$HARNESSROUTER_API_KEY` | From env (preferred) |
| `apiKeyFile` | `~/.harnessrouter/api-key` | Key file, `chmod 600` |
| `harnessId` | server default | Target harness |
| `model` | harness default | Model override |
| `timeoutSeconds` | `900` | Task timeout |
| `maxRetries` | `2` | Pre-task retry count |

## Development

```bash
npm install
npm test        # no network or Docker
npm run typecheck
npm run build
```

## License

Apache-2.0. See LICENSE.

## Security

See SECURITY.md for vulnerability reporting.
