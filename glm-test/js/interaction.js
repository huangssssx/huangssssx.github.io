/* =====================================================================
   interaction.js — OrbitControls + Raycaster 点击 + 控件 + 键盘 + 选中高亮
   ===================================================================== */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LOOKUP } from './data.js';

export function initInteractions({ camera, renderer, scene, clickables, orbitLines, engine, initialCamPos, initialTarget }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let selectedId = null;

  /* ---------- OrbitControls ---------- */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.6;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 12;
  controls.maxDistance = 900;
  if (initialCamPos) camera.position.copy(initialCamPos);
  if (initialTarget) controls.target.copy(initialTarget);
  controls.update();

  /* ---------- 信息面板 ---------- */
  const panel = document.getElementById('infoPanel');
  const dom = {
    swatch: panel.querySelector('.ip-swatch'),
    name: panel.querySelector('.ip-name'),
    type: panel.querySelector('.ip-type'),
    data: panel.querySelector('.ip-data'),
    desc: panel.querySelector('.ip-desc'),
    close: panel.querySelector('.ip-close'),
  };

  function typeLabel(t) {
    return ({ star: '恒星', planet: '行星', dwarf: '矮行星', moon: '卫星', comet: '彗星', belt: '小天体环带' })[t] || t;
  }
  function fmt(n) { return typeof n === 'number' ? n.toLocaleString('en-US') : n; }

  function showInfo(id) {
    const b = LOOKUP[id];
    if (!b) return;
    const r = b.real || {};
    const rows = [];
    if (r.diameter != null) rows.push(['直径', typeof r.diameter === 'number' ? fmt(r.diameter) + ' km' : r.diameter]);
    if (r.distance != null) rows.push(['距太阳', typeof r.distance === 'number' ? fmt(r.distance) + ' Mkm' : r.distance]);
    if (r.period != null) rows.push(['公转周期', r.period]);
    if (r.mass != null) rows.push(['质量', r.mass]);
    if (r.moons != null) rows.push(['卫星数', r.moons]);
    if (r.desc != null && !rows.length) rows.push(['说明', r.desc]);

    const grad = b.palette
      ? `radial-gradient(circle at 30% 30%, ${b.palette[0]}, ${b.palette[2]})`
      : (b.id === 'sun' ? 'radial-gradient(circle,#fff8d8,#ffae3a,#ff6a08)' : '#666');
    dom.swatch.setAttribute('style', 'background:' + grad + ';');
    dom.name.textContent = b.name;
    dom.type.textContent = typeLabel(b.type);
    dom.data.innerHTML = '<dl>' + rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('') + '</dl>';
    dom.desc.textContent = r.desc || '';
    panel.classList.add('open');

    // 高亮
    if (selectedId && selectedId !== id) clearSelection();
    selectedId = id;
    if (orbitLines[id]) orbitLines[id].material.opacity = 0.9, orbitLines[id].material.color.set(0x6cc6ff);
    const mesh = clickables.find(m => m.userData.bodyId === id);
    if (mesh && mesh.material.emissive) {
      mesh.userData._origEmissive = mesh.userData._origEmissive || mesh.material.emissive.getHex();
      mesh.material.emissive.setHex(0x224466);
    }
  }

  function clearSelection() {
    Object.values(orbitLines).forEach(l => { l.material.opacity = 0.35; l.material.color.set(0x3a4a7a); });
    clickables.forEach(m => {
      if (m.userData._origEmissive != null && m.material.emissive) {
        m.material.emissive.setHex(m.userData._origEmissive);
      }
    });
  }

  function closeInfo() {
    panel.classList.remove('open');
    clearSelection();
    selectedId = null;
  }

  /* ---------- Raycaster 点击 ---------- */
  let downX = 0, downY = 0;
  renderer.domElement.addEventListener('pointerdown', e => { downX = e.clientX; downY = e.clientY; });
  renderer.domElement.addEventListener('pointerup', e => {
    // 区分点击与拖拽
    if (Math.abs(e.clientX - downX) > 5 || Math.abs(e.clientY - downY) > 5) return;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickables, false);
    if (hits.length) showInfo(hits[0].object.userData.bodyId);
  });

  /* ---------- 控件 ---------- */
  const btnPlay = document.getElementById('btnPlay');
  const speedEl = document.getElementById('speed');
  const speedVal = document.getElementById('speedVal');
  const btnReset = document.getElementById('btnReset');

  btnPlay.addEventListener('click', () => {
    const paused = engine.togglePause();
    btnPlay.textContent = paused ? '播放' : '暂停';
  });
  speedEl.addEventListener('input', () => {
    const v = parseFloat(speedEl.value);
    engine.setSpeed(v);
    speedVal.textContent = v.toFixed(1) + '×';
  });
  btnReset.addEventListener('click', () => {
    engine.reset();
    camera.position.copy(initialCamPos);
    controls.target.copy(initialTarget);
    speedEl.value = 1; speedVal.textContent = '1.0×'; engine.setSpeed(1);
  });
  dom.close.addEventListener('click', closeInfo);

  function adjustSpeed(delta) {
    const v = Math.max(parseFloat(speedEl.min), Math.min(parseFloat(speedEl.max), parseFloat(speedEl.value) + delta));
    speedEl.value = v; speedEl.dispatchEvent(new Event('input'));
  }

  window.addEventListener('keydown', e => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    switch (e.key) {
      case ' ': e.preventDefault(); btnPlay.click(); break;
      case 'ArrowRight': adjustSpeed(0.2); break;
      case 'ArrowLeft': adjustSpeed(-0.2); break;
      case 'Escape': closeInfo(); break;
      case 'r': case 'R': btnReset.click(); break;
    }
  });

  return { controls, showInfo, closeInfo };
}
