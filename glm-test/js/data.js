/* =====================================================================
   data.js — 天体数据集（真实天文数据 + Three.js 缩放参数）
   数据来源：NASA Planetary Fact Sheet
   坐标系：Y 轴向上；轨道在 XZ 平面；单位为自定义缩放值。
   ===================================================================== */
import * as THREE from 'three';

// 地球公转一圈对应的「现实秒数」（@ 1×）。其余行星按真实年数比例换算。
export const EARTH_ORBIT_SECONDS = 12;

// —— 行星 / 矮行星 / 彗星 / 太阳 ——
export const bodies = [

  /* ===== 太阳 ===== */
  { id: 'sun', name: '太阳', type: 'star', parent: null, size: 7,
    spin: 0.05, tex: 'star',
    real: { diameter: 1392700, distance: 0, period: '—', mass: '1.989×10³⁰ kg', moons: '8 大行星',
      desc: '太阳系的中心恒星，质量占整个太阳系的 99.86%。通过核心氢聚变释放光与热，是地球生命的能量之源。' } },

  /* ===== 八大行星 ===== */
  { id: 'mercury', name: '水星', type: 'planet', parent: null,
    orbit: { radius: 16, period: 0.241, phase: 0.4, incl: 7.0 },
    size: 0.9, spin: 0.3, axial: 0.03, tex: 'rocky', palette: ['#cfcfcf', '#8c8c8c', '#4a4a4a'],
    real: { diameter: 4879, distance: 57.9, period: '88 天', mass: '3.30×10²³ kg', moons: 0,
      desc: '距离太阳最近、体积最小的行星。没有大气，昼夜温差可达 600℃。' } },

  { id: 'venus', name: '金星', type: 'planet', parent: null,
    orbit: { radius: 22, period: 0.615, phase: 1.9, incl: 3.4 },
    size: 1.25, spin: -0.05, axial: 3.1, tex: 'rocky', palette: ['#f7e2b0', '#c99a52', '#7a4e22'],
    real: { diameter: 12104, distance: 108.2, period: '225 天', mass: '4.87×10²⁴ kg', moons: 0,
      desc: '被浓密二氧化碳云层笼罩，温室效应使表面温度高达 462℃，是太阳系最热的行星。自转方向与公转相反。' } },

  { id: 'earth', name: '地球', type: 'planet', parent: null,
    orbit: { radius: 30, period: 1.0, phase: 3.2, incl: 0 },
    size: 1.3, spin: 1.0, axial: 0.41, tex: 'earth',
    real: { diameter: 12742, distance: 149.6, period: '365.25 天', mass: '5.97×10²⁴ kg', moons: 1,
      desc: '我们的家园，目前已知唯一存在生命的星球。表面 71% 被液态水覆盖，拥有适宜的大气与磁场。' } },

  { id: 'mars', name: '火星', type: 'planet', parent: null,
    orbit: { radius: 38, period: 1.881, phase: 5.1, incl: 1.85 },
    size: 1.0, spin: 0.97, axial: 0.44, tex: 'rocky', palette: ['#e89060', '#b5492a', '#5e1d0e'],
    real: { diameter: 6779, distance: 227.9, period: '687 天', mass: '6.42×10²³ kg', moons: 2,
      desc: '红色星球，表面富含氧化铁。拥有太阳系最高山峰奥林帕斯山，是人类未来探索与移民的重要目标。' } },

  { id: 'jupiter', name: '木星', type: 'planet', parent: null,
    orbit: { radius: 58, period: 11.86, phase: 0.9, incl: 1.3 },
    size: 4.2, spin: 2.3, axial: 0.05, tex: 'gas', palette: ['#e8d2a8', '#c08a55', '#6e4326'],
    real: { diameter: 139820, distance: 778.6, period: '11.86 年', mass: '1.90×10²⁷ kg', moons: 95,
      desc: '太阳系最大行星，气态巨行星。著名的大红斑是一场已持续数百年的巨型风暴。强大的引力守护着内太阳系。' } },

  { id: 'saturn', name: '土星', type: 'planet', parent: null,
    orbit: { radius: 78, period: 29.46, phase: 2.7, incl: 2.5 },
    size: 3.6, spin: 2.1, axial: 0.47, tex: 'gas', palette: ['#f0e0b4', '#cdae74', '#7e6238'], rings: true,
    real: { diameter: 116460, distance: 1433.5, period: '29.46 年', mass: '5.68×10²⁶ kg', moons: 146,
      desc: '以壮丽的光环系统闻名，光环由无数冰粒与岩石碎片组成。密度低于水，是太阳系密度最小的行星。' } },

  { id: 'uranus', name: '天王星', type: 'planet', parent: null,
    orbit: { radius: 94, period: 84.01, phase: 4.4, incl: 0.77 },
    size: 2.4, spin: -1.3, axial: 1.71, tex: 'gas', palette: ['#c8f0ec', '#7fc7c2', '#3a807c'],
    real: { diameter: 50724, distance: 2872.5, period: '84.01 年', mass: '8.68×10²⁵ kg', moons: 28,
      desc: '冰巨星，自转轴几乎「躺」在公转轨道平面上（倾角 98°），呈现独特的侧向滚动式自转。' } },

  { id: 'neptune', name: '海王星', type: 'planet', parent: null,
    orbit: { radius: 108, period: 164.8, phase: 5.9, incl: 1.77 },
    size: 2.3, spin: 1.4, axial: 0.49, tex: 'gas', palette: ['#7aa0ff', '#3a5fd0', '#1a2c70'],
    real: { diameter: 49244, distance: 4495.1, period: '164.8 年', mass: '1.02×10²⁶ kg', moons: 16,
      desc: '最遥远的行星，深蓝色冰巨星。拥有太阳系最强劲的风暴，风速可达 2100 km/h。' } },

  /* ===== 矮行星 ===== */
  { id: 'ceres', name: '谷神星', type: 'dwarf', parent: null,
    orbit: { radius: 49, period: 4.6, phase: 2.2, incl: 10.6 },
    size: 0.4, spin: 0.5, axial: 0.1, tex: 'rocky', palette: ['#d8cdb8', '#a08e72', '#564c3a'],
    real: { diameter: 940, distance: 414, period: '4.6 年', mass: '9.39×10²⁰ kg', moons: 0,
      desc: '位于小行星带中最大的天体，也是其中唯一的矮行星。' } },

  { id: 'pluto', name: '冥王星', type: 'dwarf', parent: null,
    orbit: { radius: 122, period: 248, phase: 1.1, incl: 17.2, ecc: 0.25 },
    size: 0.5, spin: 0.25, axial: 2.1, tex: 'rocky', palette: ['#e8dcc8', '#a8967c', '#5a4e3c'],
    real: { diameter: 2376, distance: 5906, period: '248 年', mass: '1.31×10²² kg', moons: 5,
      desc: '原第九大行星，2006 年被重新归类为矮行星。轨道高度倾斜且偏心，有时比海王星更靠近太阳。' } },

  { id: 'eris', name: '阋神星', type: 'dwarf', parent: null,
    orbit: { radius: 138, period: 558, phase: 3.7, incl: 44, ecc: 0.30 },
    size: 0.5, spin: 0.2, axial: 0.1, tex: 'rocky', palette: ['#f2f2f2', '#b4b4b4', '#6a6a6a'],
    real: { diameter: 2326, distance: 10150, period: '558 年', mass: '1.66×10²² kg', moons: 1,
      desc: '最知名的散射盘矮行星，其发现直接促成了冥王星的重新分类。' } },

  /* ===== 彗星（高偏心率椭圆轨道） ===== */
  { id: 'comet', name: '哈雷型彗星', type: 'comet', parent: null,
    orbit: { radius: 40, period: 76, phase: 0.2, ecc: 0.8 },
    size: 0.35, spin: 0, tex: 'comet',
    real: { diameter: 11, distance: '0.6–35 AU', period: '约 76 年', mass: '约 2.2×10¹⁴ kg', moons: 0,
      desc: '沿高偏心率椭圆轨道运行，接近太阳时挥发形成明亮的彗发与背向太阳的离子尾。' } },
];

/* ===== 主要卫星（parent 指向行星；嵌套 pivot 跟随） ===== */
export const moons = [
  { id: 'moon', name: '月球', parent: 'earth', orbit: { radius: 2.4, periodSec: 5, phase: 0.6 }, size: 0.35, palette: ['#e8e8e8', '#b0b0b0', '#6f6f6f'],
    real: { diameter: 3474, distance: '38.4 万 km(距地球)', period: '27.3 天', mass: '7.34×10²² kg', moons: 0, desc: '地球唯一的天然卫星，潮汐锁定使其始终以同一面朝向地球。' } },
  { id: 'phobos', name: '火卫一', parent: 'mars', orbit: { radius: 1.7, periodSec: 2.5, phase: 1.4 }, size: 0.12, palette: ['#9a8a72', '#6e5f4a', '#3e3426'],
    real: { diameter: 22, distance: '—', period: '0.32 天', mass: '1.07×10¹⁶ kg', moons: 0, desc: '火星较大卫星，正以螺旋方式靠近火星。' } },
  { id: 'deimos', name: '火卫二', parent: 'mars', orbit: { radius: 2.3, periodSec: 5, phase: 4.0 }, size: 0.1, palette: ['#a99880', '#7a6a52', '#403628'],
    real: { diameter: 12, distance: '—', period: '1.26 天', mass: '1.48×10¹⁵ kg', moons: 0, desc: '火星较小、较远的卫星。' } },
  { id: 'io', name: '木卫一', parent: 'jupiter', orbit: { radius: 6.0, periodSec: 3, phase: 0.3 }, size: 0.45, palette: ['#f2e08a', '#c9a23a', '#6e5210'],
    real: { diameter: 3643, distance: '—', period: '1.77 天', mass: '8.93×10²² kg', moons: 0, desc: '太阳系火山活动最剧烈的天体。' } },
  { id: 'europa', name: '木卫二', parent: 'jupiter', orbit: { radius: 7.2, periodSec: 4.5, phase: 2.1 }, size: 0.4, palette: ['#e8dcc0', '#b0a088', '#5e503a'],
    real: { diameter: 3122, distance: '—', period: '3.55 天', mass: '4.80×10²² kg', moons: 0, desc: '冰封表面下存在液态海洋，是寻找地外生命的热点。' } },
  { id: 'ganymede', name: '木卫三', parent: 'jupiter', orbit: { radius: 8.6, periodSec: 7, phase: 4.0 }, size: 0.55, palette: ['#c8bca8', '#8c7e68', '#46402f'],
    real: { diameter: 5268, distance: '—', period: '7.15 天', mass: '1.48×10²³ kg', moons: 0, desc: '太阳系最大卫星，比水星还大。' } },
  { id: 'callisto', name: '木卫四', parent: 'jupiter', orbit: { radius: 10.2, periodSec: 10, phase: 5.5 }, size: 0.5, palette: ['#8a8074', '#5e5648', '#2e281e'],
    real: { diameter: 4821, distance: '—', period: '16.7 天', mass: '1.08×10²³ kg', moons: 0, desc: '陨石坑密度最高的天体之一。' } },
  { id: 'titan', name: '土卫六', parent: 'saturn', orbit: { radius: 6.5, periodSec: 7, phase: 1.0 }, size: 0.5, palette: ['#e6c06a', '#b08238', '#5e4216'],
    real: { diameter: 5150, distance: '—', period: '15.9 天', mass: '1.35×10²³ kg', moons: 0, desc: '拥有浓密大气与液态甲烷湖泊，是土星最大卫星。' } },
  { id: 'triton', name: '海卫一', parent: 'neptune', orbit: { radius: 4.2, periodSec: 5.5, phase: 3.0 }, size: 0.35, palette: ['#d8e0e8', '#9aa8b8', '#56647a'],
    real: { diameter: 2707, distance: '—', period: '5.88 天(逆行)', mass: '2.14×10²² kg', moons: 0, desc: '逆行轨道，可能是被捕获的柯伊伯带天体。' } },
  { id: 'charon', name: '冥卫一', parent: 'pluto', orbit: { radius: 1.3, periodSec: 4, phase: 0.5 }, size: 0.25, palette: ['#b8aca0', '#7e7468', '#3e3a32'],
    real: { diameter: 1212, distance: '—', period: '6.39 天', mass: '1.52×10²¹ kg', moons: 0, desc: '与冥王星互相潮汐锁定，近乎双星系统。' } },
];

// —— 带状天体（Points） ——
export const belts = [
  { id: 'asteroid', name: '小行星带',
    layers: [
      { rMin: 42, rMax: 47, count: 900, size: 0.06, speed: 0.05, color: 0xb8a07a },
      { rMin: 47, rMax: 54, count: 700, size: 0.08, speed: 0.035, color: 0x9a8266 },
    ],
    real: { desc: '位于火星与木星轨道之间，由数百万颗岩石碎块组成。木星引力阻碍了其聚合成行星。' } },
  { id: 'kuiper', name: '柯伊伯带',
    layers: [
      { rMin: 130, rMax: 150, count: 800, size: 0.07, speed: 0.02, color: 0xcfd8e8 },
      { rMin: 150, rMax: 168, count: 600, size: 0.06, speed: 0.015, color: 0xa8b8d0 },
    ],
    real: { desc: '海王星轨道外的环带区域，由冰质天体组成，是短周期彗星的主要来源。' } },
];

export const LOOKUP = {};
[...bodies, ...moons].forEach(b => { LOOKUP[b.id] = b; });
belts.forEach(b => { LOOKUP[b.id] = b; });
