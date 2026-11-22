#!/usr/bin/env node
/**
 * @switchboard/harness-adapter — Agent Substrate sandbox example
 *
 * Shows how to wrap a harness adapter execution inside an Agent Substrate
 * zero-trust sandbox (Kubernetes). Requires the Agent Substrate Helm chart
 * deployed to the `agent-substrate` namespace.
 *
 * This is a template — adapt to your cluster and RBAC.
 */

import { execSync } from "node:child_process";

const NAMESPACE = process.env.AGENT_SUBSTRATE_NAMESPACE || "agent-substrate";

console.log("Agent Substrate sandbox setup:");
console.log(`- Namespace: ${NAMESPACE}`);
console.log("- Warm worker pods: 8");
console.log("- Zero-trust sandboxing: enabled");
console.log("- Idle timeout: 5m");

// Verify namespace exists
try {
  execSync(`kubectl get namespace ${NAMESPACE}`, { stdio: "pipe" });
  console.log(`\nNamespace ${NAMESPACE} exists. Ready to deploy sandboxed workers.`);
} catch {
  console.error(`Namespace ${NAMESPACE} not found. Run:`);
  console.error(`  kubectl create namespace ${NAMESPACE}`);
  console.error(`  helm install agent-substrate ./tools/sandbox/ -n ${NAMESPACE}`);
  process.exit(1);
}

console.log("\nTo run a harness task inside the sandbox:");
console.log("  kubectl run harness-task --image=node:25 -n agent-substrate -- \\");
console.log("    node -e \"require('@switchboard/harness-adapter').adapter.execute(ctx)\"");
