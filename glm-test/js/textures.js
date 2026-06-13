/* =====================================================================
   textures.js — Canvas 程序化纹理生成器（零图片依赖）
   value noise → fractal → 行星/太阳/光环纹理
   ===================================================================== */
import * as THREE from 'three';

/* ---------- 工具 ---------- */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 2D 周期性 value noise（网格 modulo → 经度无缝衔接） */
function makeNoise(seed) {
  const rnd = mulberry32(seed);
  const N = 96;
  const grid = new Float32Array(N * N);
  for (let i = 0; i < grid.length; i++) grid[i] = rnd();
  const at = (x, y) => grid[((y % N + N) % N) * N + ((x % N + N) % N)];
  const smooth = t => t * t * (3 - 2 * t);
  const noise = (u, v) => {
    const x = u * N, y = v * N;
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const fx = smooth(x - x0), fy = smooth(y - y0);
    const a = at(x0, y0), b = at(x0 + 1, y0), c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
  };
  return (u, v, oct = 5) => {
    let amp = 1, freq = 1, sum = 0, norm = 0;
    for (let o = 0; o < oct; o++) { sum += noise(u * freq, v * freq) * amp; norm += amp; amp *= 0.5; freq *= 2; }
    return sum / norm;
  };
}

const W = 1024, H = 512;

function newCanvas() {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  return { c, ctx: c.getContext('2d') };
}
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function rgbCss(a) { return 'rgb(' + (a[0] | 0) + ',' + (a[1] | 0) + ',' + (a[2] | 0) + ')'; }

function finalize(canvas, srgb = true) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ---------- 岩质行星 ---------- */
export function makeRockyTexture(palette, seed = 7) {
  const { c, ctx } = newCanvas();
  const noise = makeNoise(seed);
  const hi = hexToRgb(palette[0]), mid = hexToRgb(palette[1]), lo = hexToRgb(palette[2]);
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H;
      const n = noise(u, v, 5);
      let col;
      if (n < 0.5) col = mix(lo, mid, n / 0.5);
      else col = mix(mid, hi, (n - 0.5) / 0.5);
      const i = (y * W + x) * 4;
      img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // 陨石坑
  const rnd = mulberry32(seed * 13 + 1);
  for (let k = 0; k < 120; k++) {
    const cx = rnd() * W, cy = rnd() * H, rr = rnd() * 9 + 2;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
    g.addColorStop(0, 'rgba(0,0,0,0.32)');
    g.addColorStop(0.7, 'rgba(0,0,0,0.10)');
    g.addColorStop(0.9, 'rgba(255,255,255,0.14)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.fill();
  }
  return finalize(c);
}

/* ---------- 气态巨行星（水平条纹 + 湍流） ---------- */
export function makeGasGiantTexture(palette, seed = 11) {
  const { c, ctx } = newCanvas();
  const noise = makeNoise(seed);
  const bands = [
    hexToRgb(palette[0]), hexToRgb(palette[1]), hexToRgb(palette[2]),
    mix(hexToRgb(palette[1]), hexToRgb(palette[0]), 0.5),
  ];
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H;
      // 用噪声扰动纬度，制造湍流条纹
      const turb = noise(u, v, 4) - 0.5;
      const lat = v + turb * 0.06;
      const f = (Math.sin(lat * Math.PI * 7) * 0.5 + 0.5);
      const idx = f * (bands.length - 1);
      const i0 = Math.floor(idx), i1 = Math.min(bands.length - 1, i0 + 1);
      let col = mix(bands[i0], bands[i1], idx - i0);
      const shade = 0.85 + noise(u * 2, v * 8, 3) * 0.3;
      const i = (y * W + x) * 4;
      img.data[i] = col[0] * shade; img.data[i + 1] = col[1] * shade; img.data[i + 2] = col[2] * shade; img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // 大红斑/风暴斑
  const rnd = mulberry32(seed * 17 + 3);
  for (let k = 0; k < 4; k++) {
    const cx = rnd() * W, cy = H * (0.3 + rnd() * 0.4), rr = rnd() * 26 + 12;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
    g.addColorStop(0, 'rgba(180,70,40,0.5)');
    g.addColorStop(1, 'rgba(180,70,40,0)');
    ctx.fillStyle = g;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1.6, 1);
    ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  return finalize(c);
}

/* ---------- 地球（海洋 + 陆地 + 极冠） ---------- */
export function makeEarthTexture(seed = 21) {
  const { c, ctx } = newCanvas();
  const noise = makeNoise(seed);
  const ocean = [24, 70, 150], deep = [10, 38, 90];
  const land = [60, 120, 50], desert = [180, 150, 80], mountain = [110, 90, 60];
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H;
      const n = noise(u, v, 6);
      const lat = Math.abs(v - 0.5) * 2; // 0 赤道 ~1 极点
      let col;
      if (n < 0.5) {
        col = mix(deep, ocean, n / 0.5);
      } else {
        const t = (n - 0.5) / 0.5;
        col = t < 0.5 ? mix(land, desert, lat) : mix(desert, mountain, (t - 0.5) / 0.5);
      }
      // 极冠
      if (lat > 0.82) col = mix(col, [235, 240, 245], Math.min(1, (lat - 0.82) / 0.12));
      const i = (y * W + x) * 4;
      img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // 云层叠加
  const cn = makeNoise(seed + 99);
  ctx.globalAlpha = 0.35;
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
    const v = cn(x / W, y / H, 4);
    if (v > 0.56) { ctx.fillStyle = 'rgba(255,255,255,' + ((v - 0.56) * 1.4) + ')'; ctx.fillRect(x, y, 2, 2); }
  }
  ctx.globalAlpha = 1;
  return finalize(c);
}

/* ---------- 太阳（湍流等离子） ---------- */
export function makeSunTexture(seed = 33) {
  const { c, ctx } = newCanvas();
  const noise = makeNoise(seed);
  const img = ctx.createImageData(W, H);
  const hot = [255, 248, 200], mid = [255, 180, 60], cool = [255, 110, 20];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H;
      const n = noise(u, v, 6);
      let col = n < 0.5 ? mix(cool, mid, n / 0.5) : mix(mid, hot, (n - 0.5) / 0.5);
      const i = (y * W + x) * 4;
      img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return finalize(c);
}

/* ---------- 土星环（径向条带 alpha） ---------- */
export function makeRingTexture(palette = ['#f0e0b4', '#cdae74', '#7e6238']) {
  const RW = 8, RH = 256;
  const c = document.createElement('canvas');
  c.width = RW; c.height = RH;
  const ctx = c.getContext('2d');
  const a = hexToRgb(palette[0]), b = hexToRgb(palette[1]), d = hexToRgb(palette[2]);
  const rnd = mulberry32(5);
  const img = ctx.createImageData(RW, RH);
  for (let y = 0; y < RH; y++) {
    const t = y / (RH - 1);
    // 多段透明度：内薄、中亮、Cassini 缝、外渐隐
    let alpha = 0;
    if (t > 0.06 && t < 0.96) {
      alpha = 0.85;
      if (t > 0.55 && t < 0.62) alpha = 0.15;          // Cassini 缝
      alpha *= 0.6 + rnd() * 0.4;
    }
    let col = t < 0.5 ? mix(d, b, t / 0.5) : mix(b, a, (t - 0.5) / 0.5);
    for (let x = 0; x < RW; x++) {
      const i = (y * RW + x) * 4;
      img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = alpha * 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

/* ---------- 派发 ---------- */
export function makeBodyTexture(b) {
  switch (b.tex) {
    case 'gas': return makeGasGiantTexture(b.palette, hashSeed(b.id));
    case 'earth': return makeEarthTexture(hashSeed(b.id));
    case 'star': return makeSunTexture(hashSeed(b.id));
    case 'comet': return makeRockyTexture(['#dff6ff', '#7fcfff', '#3a7090'], hashSeed(b.id));
    case 'rocky':
    default: return makeRockyTexture(b.palette, hashSeed(b.id));
  }
}

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h) + 1;
}
