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
