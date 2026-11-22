#!/usr/bin/env node
/**
 * @switchboard/harness-adapter — Open Design example
 *
 * Placeholder for Open Design (AI design studio) integration.
 * Configured via tools/design/open-design-config.json.
 */

const config = {
  studioName: "harness-adapter-design-studio",
  aiProvider: "openrouter",
  defaultModel: "openrouter/nvidia/nemotron-3.5-super-vl:free",
  outputDir: "./tools/design/output",
};

console.log("Open Design studio config:");
console.log(JSON.stringify(config, null, 2));
console.log("\nTo use: install Open Design from https://github.com/nexu-io/open-design");
console.log("Then point it at this config directory and generate UI mockups for the adapter.");
