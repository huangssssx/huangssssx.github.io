/* =====================================================================
   orbits.js — 轨道线（LineLoop）+ 椭圆位置计算
   ===================================================================== */
import * as THREE from 'three';

const TAU = Math.PI * 2;

/** 创建圆形/椭圆轨道线（XZ 平面） */
export function createOrbitLine(radius, ecc = 0, color = 0x3a4a7a, opacity = 0.35, segments = 256) {
  const a = radius;
  const b = radius * Math.sqrt(1 - ecc * ecc); // 半短轴
  const pts = [];
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * TAU;
    pts.push(new THREE.Vector3(Math.cos(t) * a, 0, Math.sin(t) * b));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const line = new THREE.LineLoop(geo, mat);
  return line;
}

/** 椭圆轨道上的位置（焦点在原点：r(θ)=a(1-e²)/(1+e·cosθ)） */
export function ellipsePos(out, a, ecc, angle) {
  const r = a * (1 - ecc * ecc) / (1 + ecc * Math.cos(angle));
  out.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
  return out;
}
