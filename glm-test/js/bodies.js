/* =====================================================================
   bodies.js — 构建太阳/行星/卫星/环/彗星，返回引擎可驱动的注册表
   ===================================================================== */
import * as THREE from 'three';
import { bodies as BODY_DATA, moons as MOON_DATA, EARTH_ORBIT_SECONDS } from './data.js';
import { makeBodyTexture, makeRingTexture } from './textures.js';
import { createOrbitLine, ellipsePos } from './orbits.js';

const TAU = Math.PI * 2;
const _v = new THREE.Vector3();

export function createBodies(scene) {
  // 引擎注册项
  const items = [];        // {pivot, mesh, spin, orbit:{...}, isComet, a, ecc}
  const clickables = [];   // 可被 Raycaster 命中的 mesh（含 userData.bodyId）
  const orbitLines = {};   // id -> LineLoop（用于高亮）
  const meshById = {};     // id -> mesh（用于卫星嵌套查找 / 选中）
  let sunMesh = null;

  function addClickable(mesh, id) {
    mesh.userData.bodyId = id;
    clickables.push(mesh);
  }

  /* ---------- 太阳 ---------- */
  const sun = BODY_DATA.find(b => b.type === 'star');
  {
    const geo = new THREE.SphereGeometry(sun.size, 64, 48);
    const tex = makeBodyTexture(sun);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    sunMesh = new THREE.Mesh(geo, mat);
    sunMesh.name = 'sun';
    addClickable(sunMesh, sun.id);
    scene.add(sunMesh);
    items.push({ pivot: null, mesh: sunMesh, spin: sun.spin, orbit: null, isComet: false });
    meshById[sun.id] = sunMesh;
  }

  /* ---------- 行星 / 矮行星 / 彗星 ---------- */
  BODY_DATA.filter(b => b.type !== 'star').forEach(b => {
    // 倾角容器（同时倾斜轨道线 + 公转 pivot，保持一致）
    const inclGroup = new THREE.Group();
    if (b.orbit.incl) inclGroup.rotation.x = THREE.MathUtils.degToRad(b.orbit.incl);
    scene.add(inclGroup);

    // 轨道线
    if (b.type !== 'comet') {
      const line = createOrbitLine(b.orbit.radius, 0);
      inclGroup.add(line);
      orbitLines[b.id] = line;
    } else {
      const line = createOrbitLine(b.orbit.radius, b.orbit.ecc, 0x4a6a9a, 0.25);
      inclGroup.add(line);
      orbitLines[b.id] = line;
    }

    // 公转 pivot
    const pivot = new THREE.Group();
    inclGroup.add(pivot);

    // 行星网格
    const geo = new THREE.SphereGeometry(b.size, 48, 32);
    const tex = makeBodyTexture(b);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: b.tex === 'gas' ? 0.9 : 0.95,
      metalness: 0.0,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = b.id;
    if (b.axial) mesh.rotation.z = b.axial; // 轴倾角
    addClickable(mesh, b.id);

    if (b.type === 'comet') {
      // 椭圆：每帧用 ellipsePos 更新位置
      pivot.add(mesh);
      items.push({ pivot, mesh, spin: 0, orbit: b.orbit, isComet: true, a: b.orbit.radius, ecc: b.orbit.ecc });
    } else {
      mesh.position.x = b.orbit.radius;
      pivot.add(mesh);
      const orbitSec = b.orbit.period * EARTH_ORBIT_SECONDS;
      items.push({ pivot, mesh, spin: b.spin, orbit: { ...b.orbit, orbitSec }, isComet: false });
    }
    meshById[b.id] = mesh;

    // 土星环
    if (b.rings) {
      const inner = b.size * 1.4, outer = b.size * 2.4;
      const ringGeo = new THREE.RingGeometry(inner, outer, 96, 1);
      // 修正径向 UV（使纹理 v 对应半径）
      fixRingUV(ringGeo, inner, outer);
      const ringMat = new THREE.MeshBasicMaterial({
        map: makeRingTexture(b.palette),
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;             // 平铺到轨道面
      ring.rotation.z = b.axial || 0;             // 随轴倾角
      mesh.add(ring);
    }

    // 彗尾
    if (b.type === 'comet') {
      const tail = makeCometTail(b.size);
      mesh.add(tail);
    }
  });

  /* ---------- 卫星（嵌套到父行星 mesh 下） ---------- */
  MOON_DATA.forEach(m => {
    const parent = meshById[m.parent];
    if (!parent) return;
    const pivot = new THREE.Group();
    parent.add(pivot);

    const geo = new THREE.SphereGeometry(m.size, 24, 16);
    const tex = makeBodyTexture({ tex: 'rocky', palette: m.palette, id: m.id });
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = m.id;
    mesh.position.x = m.orbit.radius;
    addClickable(mesh, m.id);
    pivot.add(mesh);
    meshById[m.id] = mesh;

    items.push({ pivot, mesh, spin: 0.3, orbit: { ...m.orbit, orbitSec: m.orbit.periodSec }, isComet: false });
  });

  return { items, clickables, orbitLines, meshById, sunMesh };
}

/* ---------- 土星环 UV 修正 ---------- */
function fixRingUV(geo, inner, outer) {
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.sqrt(v.x * v.x + v.y * v.y);
    const t = (r - inner) / (outer - inner);
    uv.setXY(i, (Math.atan2(v.y, v.x) / TAU + 0.5), t);
  }
  uv.needsUpdate = true;
}

/* ---------- 彗尾（背向太阳的拖尾 Points） ---------- */
function makeCometTail(size) {
  const N = 60;
  const positions = new Float32Array(N * 3);
  const alphas = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    positions[i * 3] = size * 0.6 + t * size * 14; // +X 背向太阳（行星 -X 朝日）
    positions[i * 3 + 1] = (Math.random() - 0.5) * size * 1.4 * (1 - t);
    positions[i * 3 + 2] = (Math.random() - 0.5) * size * 1.4 * (1 - t);
    alphas[i] = (1 - t) * 0.8;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  const mat = new THREE.PointsMaterial({
    color: 0x9fdfff, size: size * 0.9, transparent: true, opacity: 0.6,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(geo, mat);
  return pts;
}

export { TAU };
