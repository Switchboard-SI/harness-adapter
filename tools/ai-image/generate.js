#!/usr/bin/env node
/**
 * @switchboard/harness-adapter — AI image generation (ComfyUI)
 *
 * Sends a simple prompt to ComfyUI to generate an image.
 * Requires ComfyUI running at http://127.0.0.1:8188
 */

import fetch from "node-fetch";

const BASE = process.env.COMFYUI_BASE_URL || "http://127.0.0.1:8188";

const prompt = {
  "3": {
    inputs: {
      text: "terminal interface, dark mode, purple and cyan glow, developer tool UI, 4k",
      clip: ["1", 0],
    },
    class_type: "CLIPTextEncode",
  },
  "4": {
    inputs: {
      width: 1024,
      height: 1024,
      batch_size: 1,
    },
    class_type: "EmptyLatentImage",
  },
  "5": {
    inputs: {
      model_name: "sdxl_base_1.0.safetensors",
    },
    class_type: "CheckpointLoaderSimple",
  },
  "6": {
    inputs: {
      seed: Math.floor(Math.random() * 1000000),
      steps: 20,
      cfg: 7,
      sampler_name: "euler",
      scheduler: "normal",
      denoise: 1,
      model: ["5", 0],
      positive: ["3", 0],
      negative: ["7", 0],
      latent_image: ["4", 0],
    },
    class_type: "KSampler",
  },
  "7": {
    inputs: {
      text: "blurry, low quality, distorted, text, watermark",
      clip: ["1", 0],
    },
    class_type: "CLIPTextEncode",
  },
  "8": {
    inputs: {
      samples: ["6", 0],
      vae: ["5", 2],
    },
    class_type: "VAEDecode",
  },
  "9": {
    inputs: {
      filename_prefix: "harness-adapter",
      images: ["8", 0],
    },
    class_type: "SaveImage",
  },
};

async function main() {
  try {
    const res = await fetch(`${BASE}/prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    console.log("ComfyUI prompt queued:");
    console.log(JSON.stringify(data, null, 2));
    console.log(`View at ${BASE}/history/${data.prompt_id}`);
  } catch (err) {
    console.error("ComfyUI not reachable at", BASE);
    console.error("Install ComfyUI: git clone https://github.com/comfyanonymous/ComfyUI");
    process.exit(1);
  }
}

main();
