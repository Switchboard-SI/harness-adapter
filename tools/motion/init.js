#!/usr/bin/env node
/**
 * @switchboard/harness-adapter — Motion toolchain initializer
 *
 * Sets up the Remotion/HyperFrames/GSAP studio scaffold and
 * writes a .env with all API keys needed by the motion tools.
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

const envContent = `# Motion / Video / 3D / AI toolchain env for @switchboard/harness-adapter
# Copy to .env and fill in your keys.

# OpenRouter (used by RAEA, Hermes, Open Design fallback)
OPENROUTER_API_KEY=your_openrouter_key_here

# HarnessRouter
HARNESSROUTER_BASE_URL=http://127.0.0.1:3200/api/harness
HARNESSROUTER_API_KEY=your_harnessrouter_key_here
HARNESSROUTER_API_KEY_FILE=~/.harnessrouter/api-key

# ComfyUI (AI image engine)
COMFYUI_BASE_URL=http://127.0.0.1:8188

# Blender MCP (3D)
BLENDER_MCP_PORT=9876

# Agent Substrate (K8s sandbox)
AGENT_SUBSTRATE_NAMESPACE=agent-substrate
`;

const envPath = join(ROOT, ".env.example");
if (!existsSync(envPath)) {
  writeFileSync(envPath, envContent);
  console.log("Created .env.example — copy to .env and add your keys.");
} else {
  console.log(".env.example already exists, skipping.");
}

const motionDir = join(ROOT, "tools/motion");
mkdirSync(motionDir, { recursive: true });

// GSAP animation helper
writeFileSync(
  join(motionDir, "animate.ts"),
  `import { gsap } from "gsap";

export const fadeIn = (target: string | HTMLElement, duration = 0.6) =>
  gsap.to(target, { opacity: 1, y: 0, duration, ease: "power3.out" });

export const slideUp = (target: string | HTMLElement, duration = 0.6) =>
  gsap.to(target, { opacity: 1, y: 0, duration, ease: "power3.out" });

export const terminalType = (target: string | HTMLElement, text: string, duration = 0.03) =>
  gsap.to(target, {
    duration: text.length * duration,
    onUpdate: () => {},
  });
`
);

console.log("Motion toolchain initialized.");
console.log("Next: edit .env with your keys, then run 'npm run motion:render'.");
