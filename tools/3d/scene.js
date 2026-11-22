#!/usr/bin/env node
/**
 * @switchboard/harness-adapter — 3D scene example (Three.js)
 *
 * Configures a Three.js scene with headless canvas support for Node.js.
 * For browser display, append renderer.domElement to DOM.
 * For headless rendering, use a canvas shim (e.g., 'canvas' npm package).
 */

import * as THREE from "three";

// Headless canvas shim for Node.js
let canvas;
try {
  const { createCanvas } = await import("canvas");
  canvas = createCanvas(1920, 1080);
  globalThis.HTMLCanvasElement = class extends canvas {};
} catch {
  // Canvas not installed — scene config only
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050608);
scene.fog = new THREE.Fog(0x050608, 1, 50);

const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
camera.position.z = 10;

const ambient = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambient);

const pointLight = new THREE.PointLight(0x8b5cf6, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const geometry = new THREE.TorusKnotGeometry(2, 0.7, 100, 16);
const material = new THREE.MeshStandardMaterial({
  color: 0x06b6c4,
  wireframe: true,
  metalness: 0.5,
  roughness: 0.3,
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setSize(1920, 1080);
  renderer.render(scene, camera);
  console.log("Three.js scene rendered (headless):");
} catch {
  console.log("Three.js scene configured (no canvas available for render):");
}

console.log("- Background: #050608 (matches landing page)");
console.log("- Lighting: purple point light + ambient");
console.log("- Object: wireframe TorusKnot (cyan)");
console.log("- Camera: perspective 75deg, position z=10");
