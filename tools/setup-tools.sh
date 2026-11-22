#!/usr/bin/env bash
# =============================================================================
# harness-adapter — Complete toolchain setup
# =============================================================================
# Installs and configures all motion/video/3d/AI/agent/sandbox/design tools
# referenced alongside the @switchboard/harness-adapter package.
#
# Categories:
#   motion     — GSAP (timeline animations)
#   video      — Remotion, HyperFrames, FFmpeg (encode/compositing)
#   3d         — Three.js, Blender MCP
#   ai-image   — ComfyUI
#   agent-ui   — oh-my-hermes (Hermes desktop client)
#   sandbox    — Agent Substrate (K8s zero-trust agent sandboxing)
#   design     — Open Design (AI design studio)
# =============================================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

log()  { printf '\033[1;34m[setup]\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m[ok]\033[0m  %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$*"; }

# ---------------------------------------------------------------------------
# 0. Prerequisites
# ---------------------------------------------------------------------------
log "Checking prerequisites..."

for cmd in node npm npx docker kubectl ffmpeg; do
  if command -v "$cmd" >/dev/null 2>&1; then
    ok "$cmd found: $(command -v "$cmd")"
  else
    warn "$cmd not found — install it manually before continuing"
  fi
done

# ---------------------------------------------------------------------------
# 1. Install npm dependencies
# ---------------------------------------------------------------------------
log "Installing npm dependencies..."
npm install
ok "npm dependencies installed"

# ---------------------------------------------------------------------------
# 2. Motion — GSAP
# ---------------------------------------------------------------------------
log "Setting up GSAP (timeline animations)..."
cat > tools/motion/gsap.config.js <<'EOF'
// GSAP timeline config for harness-adapter motion UI
export const gsapConfig = {
  duration: 0.6,
  ease: "power3.inOut",
  stagger: 0.1,
};
EOF
ok "GSAP configured (tools/motion/gsap.config.js)"

# ---------------------------------------------------------------------------
# 3. Video — Remotion + HyperFrames + FFmpeg
# ---------------------------------------------------------------------------
log "Setting up video toolchain (Remotion, HyperFrames, FFmpeg)..."

# Remotion starter config
mkdir -p tools/video/remotion-studio/src
cat > tools/video/remotion-studio/package.json <<'EOF'
{
  "name": "harness-adapter-remotion-studio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "remotion studio",
    "build": "remotion render packages/composition/index.ts Out/index.html --codec h264 --fps 30 --image-format jpeg --quality 100"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "remotion": "^4.0.0"
  }
}
EOF

cat > tools/video/remotion-studio/tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
EOF

cat > tools/video/remotion-studio/src/index.ts <<'EOF'
import { registerRoot } from "remotion";
import { Composition } from "./composition";

registerRoot(Composition);
EOF

cat > tools/video/remotion-studio/src/composition.ts <<'EOF'
import { Composition } from "remotion";

export const Composition = () => {
  return (
    <Composition
      id="harness-adapter-intro"
      component={Intro}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

const Intro = () => {
  return (
    <div style={{ width: "100%", height: "100%", background: "#050608" }}>
      <h1 style={{ color: "#8b5cf6" }}>@switchboard/harness-adapter</h1>
    </div>
  );
};
EOF

# HyperFrames config
cat > tools/video/hyperframes.config.json <<'EOF'
{
  "composition": "harness-adapter-demo",
  "output": "video",
  "format": "mp4",
  "fps": 30,
  "resolution": [1920, 1080],
  "template": "terminal-preview"
}
EOF

# FFmpeg presets
cat > tools/video/ffmpeg-presets.json <<'EOF'
{
  "h264-high": "-c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k",
  "pro-res": "-c:v prores_ks -profile:v 3 -c:a pcm_s24le",
  "webm-vp9": "-c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus",
  "gif": "-vf 'fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse' -loop 0"
}
EOF
ok "Video toolchain configured (tools/video/)"

# ---------------------------------------------------------------------------
# 4. 3D — Three.js + Blender MCP
# ---------------------------------------------------------------------------
log "Setting up 3D toolchain (Three.js, Blender MCP)..."
cat > tools/3d/scene.config.js <<'EOF'
// Three.js scene config for harness-adapter 3D visuals
export const sceneConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  background: 0x050608,
  fog: 0x050608,
  camera: { fov: 75, near: 0.1, far: 1000 },
  lighting: { ambient: 0x404040, point: 0xffffff },
};
EOF

cat > tools/3d/blender-mcp-config.json <<'EOF'
{
  "blenderPath": "/Applications/Blender.app/Contents/MacOS/Blender",
  "mcpPort": 9876,
  "pythonScriptsDir": "./tools/3d/blender-scripts",
  "autoConnect": true
}
EOF
ok "3D toolchain configured (tools/3d/)"

# ---------------------------------------------------------------------------
# 5. AI Image — ComfyUI
# ---------------------------------------------------------------------------
log "Setting up ComfyUI config..."
cat > tools/ai-image/comfyui-config.json <<'EOF'
{
  "baseURL": "http://127.0.0.1:8188",
  "workflowsDir": "./tools/ai-image/workflows",
  "modelsDir": "./tools/ai-image/models",
  "defaultWorkflow": "terminal-preview",
  "timeoutSeconds": 120
}
EOF
ok "ComfyUI configured (tools/ai-image/comfyui-config.json)"

# ---------------------------------------------------------------------------
# 6. Agent UI — oh-my-hermes
# ---------------------------------------------------------------------------
log "Setting up oh-my-hermes config..."
cat > tools/agent-ui/hermes-config.json <<'EOF'
{
  "appName": "oh-my-hermes",
  "endpoints": {
    "claude": "http://127.0.0.1:3000/api/harness",
    "codex": "http://127.0.0.1:3000/api/harness",
    "hermes": "http://127.0.0.1:3000/api/harness",
    "openhands": "http://127.0.0.1:3000/api/harness"
  },
  "acpTools": ["claude", "codex", "hermes", "omh", "OmO", "DSH", "ETC"],
  "defaultModel": "openrouter/nvidia/nemotron-3-ultra-550b-a55b:free"
}
EOF
ok "oh-my-hermes configured (tools/agent-ui/hermes-config.json)"

# ---------------------------------------------------------------------------
# 7. Sandbox — Agent Substrate (K8s)
# ---------------------------------------------------------------------------
log "Setting up Agent Substrate K8s namespace..."
kubectl create namespace agent-substrate --dry-run=client -o yaml | kubectl apply -f - || warn "kubectl apply skipped (cluster may not be reachable)"
cat > tools/sandbox/agent-substrate-values.yaml <<'EOF'
replicaCount: 1
image:
  repository: agent-substrate/agent-substrate
  tag: v0.1.0
resources:
  limits:
    cpu: "4"
    memory: "8Gi"
  requests:
    cpu: "2"
    memory: "4Gi"
sandbox:
  zeroTrust: true
  warmWorkerPods: 8
  idleTimeout: "5m"
EOF
ok "Agent Substrate K8s values created (tools/sandbox/agent-substrate-values.yaml)"

# ---------------------------------------------------------------------------
# 8. Design — Open Design
# ---------------------------------------------------------------------------
log "Setting up Open Design config..."
cat > tools/design/open-design-config.json <<'EOF'
{
  "studioName": "harness-adapter-design-studio",
  "aiProvider": "openrouter",
  "defaultModel": "openrouter/nvidia/nemotron-3.5-super-vl:free",
  "features": ["no-subscription", "ai-design", "component-export"],
  "outputDir": "./tools/design/output"
}
EOF
ok "Open Design configured (tools/design/open-design-config.json)"

# ---------------------------------------------------------------------------
# 9. Master motion config (unified)
# ---------------------------------------------------------------------------
log "Writing unified motion config..."
cat > tools/motion.config.js <<'EOF'
// Unified motion toolchain config for @switchboard/harness-adapter
export const motionConfig = {
  gsap: {
    duration: 0.6,
    ease: "power3.inOut",
  },
  remotion: {
    fps: 30,
    width: 1920,
    height: 1080,
  },
  hyperframes: {
    output: "video",
    format: "mp4",
  },
  ffmpeg: {
    preset: "h264-high",
  },
  threejs: {
    background: 0x050608,
  },
  comfyui: {
    baseURL: "http://127.0.0.1:8188",
  },
  hermes: {
    defaultModel: "openrouter/nvidia/nemotron-3-ultra-550b-a55b:free",
  },
};
EOF
ok "Unified motion config written (tools/motion.config.js)"

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
ok "All tool categories configured."
log ""
log "Next steps:"
log "  1. Review tools/ directory for per-category configs"
log "  2. Run 'npm run motion:init' to initialize motion studio"
log "  3. For ComfyUI: install from https://github.com/comfyanonymous/ComfyUI"
log "  4. For Blender MCP: install Blender and run the MCP server"
log "  5. For oh-my-hermes: git clone https://github.com/rlaope/oh-my-hermes"
log "  6. For Agent Substrate: kubectl apply -f tools/sandbox/"
EOF
chmod +x tools/setup-tools.sh
ok "Master setup script created (tools/setup-tools.sh)"
