# @switchboard/harness-adapter — Examples

Integration examples showing how the adapter works with the motion/video/3d toolchain.

## Files

| File | Description |
|------|-------------|
| `demo-run.ts` | Full adapter run → record terminal → render MP4 |
| `motion-composition.ts` | Remotion composition using adapter output |
| `three-dashboard.tsx` | Three.js 3D dashboard of agent runs |

## Demo: run → record → render

```ts
import { createHarnessRouterAdapter } from "../dist/index.js";
import { execSync } from "node:child_process";
import fs from "node:fs";

// 1. Run a task via the adapter
const adapter = createHarnessRouterAdapter();
const result = await adapter.execute(ctx);

// 2. Record the terminal output as a video (OpenScreen/onetake style)
// 3. Encode with FFmpeg (npm run video:encode)
// 4. Composite with Remotion/HyperFrames
```

## 3D dashboard

Use `tools/3d/scene.js` to render a live 3D view of active agent runs,
sessions, and token usage — updating over WebSocket from the adapter.
