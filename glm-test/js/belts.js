/* =====================================================================
   belts.js — 小行星带 / 柯伊伯带（Points + 整带慢转 pivot）
   ===================================================================== */
import * as THREE from 'three';
import { belts as BELT_DATA } from './data.js';

export function createBelts(scene) {
  const items = []; // {pivot, speed}

  BELT_DATA.forEach(belt => {
    belt.layers.forEach(layer => {
      const count = layer.count;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const base = new THREE.Color(layer.color);

      const pivot = new THREE.Group();
      // 给每个带一个轻微的初始倾斜与随机相位
      pivot.rotation.x = (Math.random() - 0.5) * 0.06;
      scene.add(pivot);

      for (let i = 0; i < count; i++) {
        const r = layer.rMin + Math.random() * (layer.rMax - layer.rMin);
        const a = Math.random() * Math.PI * 2;
        const yJitter = (Math.random() - 0.5) * (layer.rMax - layer.rMin) * 0.08;
        positions[i * 3] = Math.cos(a) * r;
        positions[i * 3 + 1] = yJitter;
        positions[i * 3 + 2] = Math.sin(a) * r;
        const shade = 0.6 + Math.random() * 0.5;
        colors[i * 3] = base.r * shade;
        colors[i * 3 + 1] = base.g * shade;
        colors[i * 3 + 2] = base.b * shade;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: layer.size, sizeAttenuation: true, vertexColors: true,
        transparent: true, opacity: 0.85, depthWrite: false,
      });
      const pts = new THREE.Points(geo, mat);
      pts.frustumCulled = false;
      pivot.add(pts);

      items.push({ pivot, speed: layer.speed });
    });
  });

  return items;
}
