#!/usr/bin/env node
/**
 * @switchboard/harness-adapter — Hermes desktop client example (oh-my-hermes)
 *
 * Demonstrates connecting to Hermes / Claude / Codex / OpenHands via the
 * harness adapter, matching the oh-my-hermes ACP tool surface.
 */

import { createHarnessRouterAdapter, normalizeConfig, resolveApiKey } from "../dist/index.js";

const harnessId = process.argv[2] ?? "hermes";

async function main() {
  const config = normalizeConfig(
    { harnessId },
    { env: process.env }
  );

  const key = resolveApiKey(config);
  if (!key.apiKey) {
    console.error(`No API key. Set HARNESSROUTER_API_KEY or write one to ${key.apiKeyFile}`);
    process.exit(2);
  }

  const adapter = createHarnessRouterAdapter();

  const env = await adapter.testEnvironment({
    companyId: "hermes-desktop",
    adapterType: "harnessrouter",
    config,
  });

  console.log(`testEnvironment: ${env.status}`);
  for (const check of env.checks) {
    console.log(`  [${check.level}] ${check.code}: ${check.message}`);
  }

  if (env.status === "fail") process.exit(1);

  const result = await adapter.execute({
    runId: `hermes-${Date.now()}`,
    agent: {
      id: "hermes-agent",
      companyId: "hermes-desktop",
      name: "Hermes CLI",
      adapterType: "harnessrouter",
      adapterConfig: config,
    },
    runtime: { sessionId: null, sessionParams: null, sessionDisplayId: null, taskKey: null },
    config,
    context: { prompt: "Reply with exactly: hermes online" },
    onLog: async (_stream, chunk) => process.stdout.write(chunk),
    onEvent: async () => {},
  });

  console.log(`\nexitCode=${result.exitCode} model=${result.model ?? "?"}`);
  if (result.errorMessage) console.error(`error: ${result.errorCode} — ${result.errorMessage}`);
  process.exit(result.exitCode === 0 ? 0 : 1);
}

main();
