/* =====================================================================
   starfield.js — 星空背景（Points，多层 + 顶点色）
   ===================================================================== */
import * as THREE from 'three';

export function createStarfield(radius = 2400, count = 6000) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  // 星色调色板（白为主，少量蓝/黄/红）
  const tints = [
    [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1],
    [0.7, 0.82, 1.0],   // 蓝
    [1.0, 0.92, 0.72],  // 黄
    [1.0, 0.78, 0.72],  // 红
  ];

  for (let i = 0; i < count; i++) {
    // 球面均匀分布
    const u = Math.random(), v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * (0.85 + Math.random() * 0.15);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const tint = tints[(Math.random() * tints.length) | 0];
    const bright = 0.5 + Math.random() * 0.5;
    colors[i * 3] = tint[0] * bright;
    colors[i * 3 + 1] = tint[1] * bright;
    colors[i * 3 + 2] = tint[2] * bright;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 2.2,
    sizeAttenuation: false,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = -1;
  return points;
}
