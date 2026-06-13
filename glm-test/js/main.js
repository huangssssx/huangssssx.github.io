/* =====================================================================
   main.js — 装配 Scene/Camera/Renderer/Composer，构建天体，启动循环
   ===================================================================== */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { createStarfield } from './starfield.js';
import { createBodies } from './bodies.js';
import { createBelts } from './belts.js';
import { createEngine } from './engine.js';
import { initInteractions } from './interaction.js';

const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init() {
  /* ---------- 渲染器 ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.getElementById('scene').appendChild(renderer.domElement);

  /* ---------- 场景 / 相机 ---------- */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05060f);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 6000);
  const initialCamPos = new THREE.Vector3(0, 120, 220);
  const initialTarget = new THREE.Vector3(0, 0, 0);

  /* ---------- 光照 ----------
     decay=0：恒定照明（太阳系艺术化，距离非真实比例，需所有行星均被照亮）。
     intensity 经 ACES 色调映射后约为肉眼舒适值；ambient 提供暗面填充避免纯黑。 */
  scene.add(new THREE.AmbientLight(0x3a4660, 0.55));
  const sunLight = new THREE.PointLight(0xfff2cc, 2.4, 0, 0);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  /* ---------- 星空 ---------- */
  scene.add(createStarfield(2400, 6000));

  /* ---------- 天体 ---------- */
  const { items, clickables, orbitLines, meshById, sunMesh } = createBodies(scene);
  const beltItems = createBelts(scene);

  /* ---------- 引擎 ---------- */
  const engine = createEngine(items, beltItems);
  if (reducedMotion) engine.setPaused(true);

  /* ---------- 后处理（Bloom） ---------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.7,   // strength
    0.5,   // radius
    0.82   // threshold（仅太阳等高亮物体辉光）
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* ---------- 交互 ---------- */
  const { controls } = initInteractions({
    camera, renderer, scene, clickables, orbitLines, engine,
    initialCamPos, initialTarget,
  });

  /* ---------- 主循环 ---------- */
  const clock = new THREE.Clock();
  let hidden = false;
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.1);
    engine.update(dt);
    controls.update();
    composer.render();
    if (!hidden) hideLoader();
  }
  animate();

  // 加载页隐藏兜底（防首帧异常）
  setTimeout(hideLoader, 2500);

  /* ---------- 响应式 ---------- */
  window.addEventListener('resize', () => {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
    bloom.setSize(w, h);
  });
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  loader.classList.add('hidden');
  setTimeout(() => loader.remove(), 500);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
