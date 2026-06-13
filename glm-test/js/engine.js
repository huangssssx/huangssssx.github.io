/* =====================================================================
   engine.js — Clock 时间累计驱动的公转/自转引擎
   调速/暂停只改倍率与累计，位置天然连续不跳。
   ===================================================================== */
import { ellipsePos } from './orbits.js';

const TAU = Math.PI * 2;

export function createEngine(bodyItems, beltItems) {
  let simTime = 0;
  let speed = 1;
  let paused = false;
  const _v = new (class {
    constructor() { this.x = 0; this.y = 0; this.z = 0; }
    set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  })();

  function setSpeed(v) { speed = v; }
  function setPaused(p) { paused = p; }
  function togglePause() { paused = !paused; return paused; }
  function reset() { simTime = 0; apply(); }

  function apply() {
    for (const it of bodyItems) {
      if (it.isComet) {
        const angle = (simTime / (it.orbit.period * 12)) * TAU + (it.orbit.phase || 0);
        ellipsePos(_v, it.a, it.ecc, angle);
        it.mesh.position.set(_v.x, 0, _v.z);
        it.mesh.rotation.y = -angle; // 彗尾背向太阳
      } else if (it.orbit && it.pivot) {
        const angle = (simTime / it.orbit.orbitSec) * TAU + (it.orbit.phase || 0);
        it.pivot.rotation.y = angle;
      }
      if (it.spin && it.mesh) it.mesh.rotation.y = simTime * it.spin;
    }
    for (const b of beltItems) {
      b.pivot.rotation.y = simTime * b.speed;
    }
  }

  function update(dt) {
    if (!paused) simTime += dt * speed;

    for (const it of bodyItems) {
      if (it.isComet) {
        const angle = (simTime / (it.orbit.period * 12)) * TAU + (it.orbit.phase || 0);
        ellipsePos(_v, it.a, it.ecc, angle);
        it.mesh.position.set(_v.x, 0, _v.z);
        it.mesh.rotation.y = -angle; // 彗尾背向太阳
      } else if (it.orbit && it.pivot) {
        const angle = (simTime / it.orbit.orbitSec) * TAU + (it.orbit.phase || 0);
        it.pivot.rotation.y = angle;
        if (it.spin) it.mesh.rotation.y = simTime * it.spin; // 自转
      } else if (it.spin && it.mesh) {
        it.mesh.rotation.y = simTime * it.spin; // 太阳等无轨道项的自转
      }
    }
    for (const b of beltItems) {
      b.pivot.rotation.y = simTime * b.speed;
    }
  }

  // 初始定位
  apply();

  return {
    update, reset, setSpeed, setPaused, togglePause, apply,
    getState: () => ({ simTime, speed, paused }),
  };
}
