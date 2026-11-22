# @switchboard/harness-adapter — Examples

Integration examples for the adapter and the optional tooling in `tools/`.

## Files

| File | Description |
|------|-------------|
| `basic-usage.ts` | Minimal adapter run with config |

## Basic usage

```ts
import { createHarnessRouterAdapter } from "../dist/index.js";

const adapter = createHarnessRouterAdapter();
const result = await adapter.execute(ctx, {
  baseUrl: "http://127.0.0.1:3200/api/harness",
  apiKeyFile: "~/.harnessrouter/api-key",
  harnessId: "codex",
  timeoutSeconds: 900,
});

console.log(result);
```

## Optional tooling (not installed by default)

The `tools/` directory contains standalone scripts for motion, video, 3D, and AI image generation. These are **not** dependencies of the adapter and are not required to run it.

```bash
# Motion (GSAP/Remotion)
npm run motion:init      # scaffold a composition
# npm run motion:render  # requires tools/motion/render.js (not included)

# Video (FFmpeg)
# npm run video:encode   # requires tools/video/encode.js (not included)
# npm run video:compositing  # requires tools/video/compositing.js (not included)

# 3D (Three.js/Blender)
# npm run 3d:scene       # requires tools/3d/scene.js (not included)

# AI Image (ComfyUI)
# npm run ai:image       # requires tools/ai-image/generate.js (not included)

# Agent desktop (Hermes)
# npm run agent:desktop  # requires tools/agent-ui/hermes.js (not included)
```

To use any of the `tools/` scripts, install their dependencies first:

```bash
bash tools/setup-tools.sh
```

See `tools/README.md` for details.