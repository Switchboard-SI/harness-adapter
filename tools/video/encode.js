#!/usr/bin/env node
/**
 * @switchboard/harness-adapter — Video render example
 *
 * Demonstrates rendering a short MP4 using the configured toolchain
 * (Remotion composition + FFmpeg encode preset).
 */

import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "examples/rendered");
mkdirSync(OUT, { recursive: true });

const outputPath = join(OUT, "harness-adapter-demo.mp4");

// Minimal FFmpeg encode: generate a colorbar test video using the
// configured h264-high preset (from tools/video/ffmpeg-presets.json).
const ffmpegCmd = `ffmpeg -y -f lavfi -i testsrc2=duration=5:size=1920x1080:rate=30 -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k "${outputPath}"`;

console.log("Rendering demo video with FFmpeg (h264-high preset)...");
try {
  execSync(ffmpegCmd, { stdio: "inherit" });
  console.log(`\nRendered: ${outputPath}`);
  console.log("Open it to see the output.");
} catch (err) {
  console.error("FFmpeg render failed:", err.message);
  process.exit(1);
}
