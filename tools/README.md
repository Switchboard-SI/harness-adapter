# @switchboard/harness-adapter — Motion / Video / 3D / AI toolchain

This directory contains the complete set of code-driven media tools referenced
alongside the adapter, grouped by category.

## Categories

| Category | Tools | Purpose |
|----------|-------|---------|
| `motion/` | GSAP | Timeline animations for UI |
| `video/` | Remotion, HyperFrames, FFmpeg | Render HTML/React to MP4, encode/composite |
| `3d/` | Three.js, Blender MCP | 3D scenes and Claude-driven Blender |
| `ai-image/` | ComfyUI | Stable Diffusion image generation |
| `agent-ui/` | oh-my-hermes | Desktop terminal for Hermes/Claude/Codex/OpenHands |
| `sandbox/` | Agent Substrate | K8s zero-trust sandbox for agent workloads |
| `design/` | Open Design | AI design studio (no subscription) |

## Quick start

```bash
# Install everything
npm run tools:setup

# Initialize motion studio
npm run motion:init

# Render a demo video (FFmpeg)
npm run video:encode

# Generate a 3D scene (Three.js)
npm run 3d:scene

# Generate an AI image (ComfyUI)
npm run ai:image

# Run Hermes desktop client
npm run agent:desktop
```

## Environment

Copy `.env.example` to `.env` and fill in your keys:

```
OPENROUTER_API_KEY=sk-or-...
HARNESSROUTER_API_KEY=...
HARNESSROUTER_BASE_URL=http://127.0.0.1:3200/api/harness
COMFYUI_BASE_URL=http://127.0.0.1:8188
```

## How it fits with the adapter

The harness adapter runs one Paperclip run as one UHP task. The motion tools
let you record, render, and composite those runs into polished demo videos,
explainer films, and 3D visuals — matching the workflow of RAEA, HyperFrames,
Remotion, and onetake.

## Individual tool setup notes

- **ComfyUI**: `git clone https://github.com/comfyanonymous/ComfyUI && cd ComfyUI && pip install -r requirements.txt && python main.py`
- **Blender MCP**: Install Blender, then run the MCP server on port 9876
- **oh-my-hermes**: `git clone https://github.com/rlaope/oh-my-hermes` — desktop app for Hermes/Claude/Codex/OpenHands
- **Agent Substrate**: `helm install agent-substrate ./tools/sandbox/ -n agent-substrate`
- **Open Design**: `git clone https://github.com/nexu-io/open-design`
