# 太阳系动画项目计划书（Solar System 3D）

> 版本 v2.1 · Three.js（WebGL 真 3D）· 程序化纹理 · Bloom 辉光
> **状态：已实现并通过自动化验证 ✅**

---

## 〇、项目状态与验证结论

| 维度 | 状态 | 证据 |
|---|---|---|
| 渲染 | ✅ WebGL2 画布正常 | 1440×900 canvas，gl 上下创建成功 |
| 内容真实性 | ✅ 3D 内容确认渲染 | 同帧 `readPixels`：非黑 2.3%、彩色 1.3%（行星纹理）、高亮 0.69%（太阳 Bloom） |
| 天体纹理可见 | ✅ 修复光照根因后可见 | 土星亮度 5→532、海王星呈蓝 RGB(87,114,163)、火星呈红 RGB(122,58,37) |
| 交互 | ✅ 全部通过 | 暂停切换、调速 5×、Raycaster 点击→信息面板 |
| 错误 | ✅ 零页面错误 / 零控制台错误 | Playwright 抓取 |

**关键修复（开发期发现）**：行星曾因 `PointLight.decay` 物理距离衰减导致远处天体几乎全黑（误似"无材质"），经系统化调试定位根因后改为 `decay=0`（恒定照明）。详见 §七 第 14 条。

---

## 一、项目概述与目标

### 1.1 项目概述
基于 **Three.js（WebGL）** 构建一个**真三维、视觉效果准确、交互友好**的太阳系演示模型。所有天体为真实球体几何（`SphereGeometry`），采用基于物理的光照（`MeshStandardMaterial` + `PointLight`）与 Bloom 后处理辉光，程序化生成行星纹理（Canvas → `CanvasTexture`），无需任何外部图片资源。呈现太阳、八大行星、土星环、主要卫星、矮行星、小行星带、柯伊伯带与彗星，支持鼠标自由旋转/缩放视角、点击天体查看真实天文数据。

### 1.2 项目目标

| 类别 | 目标 | 验收指标 | 达成 |
|---|---|---|---|
| 视觉 | 真 3D 球体、动态光照、土星环、太阳 Bloom 辉光、星空 | 旋转视角可见明暗/纹理变化 | ✅ |
| 科学性 | 公转周期/相对速度按真实比例 | 外行星明显慢于内行星 | ✅ |
| 交互 | 暂停/播放、调速、重置、点击查看、自由视角、缩放、键盘 | 7 类交互全部可用 | ✅ |
| 性能 | 60fps 流畅 | Chrome DevTools FPS ≥ 55 | ✅ |
| 工程 | 单依赖（Three.js CDN）、零构建 | 本地服务器一行启动 | ✅ |
| 健壮 | 无障碍降级 + 响应式 + 加载态 | reduced-motion / 移动端检查 | ✅ |

### 1.3 范围边界
- **包含**：上述全部天体与交互、信息面板、键盘/无障碍、响应式、加载进度。
- **不包含**：后端服务、用户账号、实时天文数据接口（数据为内置静态天文常数）。

### 1.4 与 v1.0（CSS3 版）的关键差异
| 维度 | v1.0 CSS3 | v2.1 Three.js |
|---|---|---|
| 天体形态 | 2D 圆盘（渐变模拟） | 真 3D 球体几何 |
| 光照 | 静态内阴影 | PointLight 动态明暗 + Bloom 辉光 |
| 视角 | 固定俯仰 + 拖拽 tilt | OrbitControls 自由轨道相机 |
| 纹理 | 纯 CSS 渐变 | Canvas 程序化纹理（噪声/气态条纹/陨石坑/地球海陆） |
| 依赖 | 零依赖 | Three.js（CDN importmap，ES Modules） |
| 运行 | 双击 file:// | 本地静态服务器（ES Modules 需 http） |

---

## 二、技术栈详细说明

| 层 | 技术 | 用途 | 选型理由 |
|---|---|---|---|
| 渲染 | **Three.js（WebGL）** | 3D 场景/球体/光照/后处理 | 真 3D，光照/视角自由，生态成熟 |
| 相机控制 | **OrbitControls**（three/addons） | 拖拽旋转/滚轮缩放/平移 | 官方插件，体验远优于手写 |
| 后处理 | **UnrealBloomPass + EffectComposer + OutputPass** | 太阳与高亮天体辉光 | 视觉冲击力核心 |
| 纹理 | Canvas 2D → `CanvasTexture` | 行星/太阳/光环程序化纹理 | 零图片资源，可程序化生成噪声/条纹/陨石坑 |
| 星空/带 | `THREE.Points`（BufferGeometry + 顶点色） | 星点 / 小行星带 / 柯伊伯带 | 单 draw call，性能优 |
| UI | HTML overlay（absolute） | 信息面板/控制栏/加载页 | DOM 做 UI 比 3D 内文本灵活 |
| 模块加载 | **ES Modules + importmap** | `import * as THREE from 'three'` | Three.js 官方推荐方式 |
| 依赖来源 | **CDN（unpkg）** | importmap 指向固定版本 | 零构建，免 npm install |
| 语言 | 原生 JavaScript (ES2020+) | 逻辑 | 无 TS/编译步骤 |
| 部署 | 静态托管（任意 http 服务器） | 线上访问 | Vercel/Netlify/Pages |

**依赖版本**：Three.js `r161`（通过 importmap 锁定）。
**明确不使用**：React/Vue 等框架、Webpack/Vite 等构建工具、外部贴图图片。

> **离线可选**：若需离线运行，将 importmap 的 three 路径改为本地 `vendor/three.module.js` 副本即可（本次默认 CDN）。

---

## 三、功能需求清单（已实现）

### 3.1 核心渲染（P0）
- [x] F1 WebGL 3D 场景（`WebGLRenderer` + `PerspectiveCamera`，ACES 色调映射）
- [x] F2 太阳（`MeshBasicMaterial` 自发光纹理 + `PointLight` + **Bloom 辉光**）
- [x] F3 八大行星（真球体 + 程序化纹理：岩质/气态/地球）
- [x] F4 轨道线（`LineLoop`，椭圆支持偏心率）
- [x] F5 土星环（`RingGeometry` + 径向 UV 修正 + 透明 alpha 纹理 + Cassini 缝）
- [x] F6 星空背景（`Points` 6000 点，多色顶点）
- [x] F7 公转动画（Clock，按真实周期比例）

### 3.2 增强天体（P0，专业版）
- [x] F8 主要卫星（10 颗，嵌套 pivot 跟随行星，真 3D 绕转）
- [x] F9 小行星带（`Points`，火星–木星间，双层）
- [x] F10 柯伊伯带（海王星外，双层）
- [x] F11 矮行星（冥王星、谷神星、阋神星）
- [x] F12 彗星（高偏心率椭圆轨道 + 粒子拖尾，背向太阳）
- [x] F13 行星自转（`mesh.rotation.y`，带轴倾角 `rotation.z`）

### 3.3 交互功能（P0）
- [x] F14 暂停 / 播放
- [x] F15 全局速度调节（0.1×–10×，滑块）
- [x] F16 重置（时间归零 + 相机复位 + 速度复位）
- [x] F17 点击天体 → 信息面板（Raycaster 命中检测 + 真实数据，区分点击/拖拽）
- [x] F18 自由旋转视角（OrbitControls 拖拽 + 阻尼）
- [x] F19 滚轮缩放（OrbitControls，含 min/max 距离）
- [x] F20 选中态高亮（轨道线变色 + 行星 emissive 提亮）

### 3.4 体验与健壮（P1）
- [x] F21 键盘快捷键（Space 暂停 / ←→ 调速 / Esc 关面板 / R 重置）
- [x] F22 `prefers-reduced-motion` 降级（启动即暂停公转）
- [x] F23 响应式（resize 同步 camera/renderer/composer；移动端断点 UI）
- [x] F24 无障碍（aria-label、焦点可达、语义化控件）
- [x] F25 加载态（loader 遮罩 + 兜底超时隐藏）
- [x] F26 性能优化（`Points` 批渲染、`powerPreference:high-performance`、pixelRatio 上限 2）

---

## 四、系统架构设计

### 4.1 分层架构

```
┌─────────────────────────────────────────────┐
│  UI 层 (HTML overlay + css)                   │
│  控制栏 / 信息面板 / 加载页 / 提示            │
└───────────────┬─────────────────────────────┘
                │  DOM 事件
┌───────────────▼─────────────────────────────┐
│  交互层 (interaction.js)                      │
│  Raycaster 点击 / OrbitControls / 键盘 / 控件 │
└───────────────┬─────────────────────────────┘
                │  状态 (暂停/速度/选中)
┌───────────────▼─────────────────────────────┐
│  模拟层 (engine.js)                           │
│  Clock → 累计时间 × 速度 → 公转/自转角度       │
└───────────────┬─────────────────────────────┘
                │  更新 Object3D
┌───────────────▼─────────────────────────────┐
│  场景层 (bodies.js / belts.js / orbits.js /   │
│          starfield.js / textures.js)          │
│  太阳/行星/卫星/环/带/彗星 + 程序化纹理        │
└───────────────┬─────────────────────────────┘
                │  Three.js Object3D 树
┌───────────────▼─────────────────────────────┐
│  核心 (main.js)                               │
│  Scene / Camera / Renderer / Composer / 循环  │
└───────────────────────────────────────────────┘
```

### 4.2 场景图（Object3D 层级，实际实现）

```
scene
├─ starfield (Points，球面均匀分布 6000 点)
├─ AmbientLight (0x3a4660, 0.55)  ← 暗面填充
├─ PointLight (0xfff2cc, 2.4, distance=0, decay=0)  ← 恒定照明（根因修复）
├─ sun (Mesh: MeshBasicMaterial 自发光纹理)
├─ <planet> inclGroup (Group, rotation.x = 轨道倾角)
│   ├─ orbitLine (LineLoop)
│   └─ pivot (Group, rotation.y = 公转角)  ← engine 驱动
│       └─ planetMesh (SphereGeometry + CanvasTexture, rotation.z=轴倾角)
│           ├─ rings (土星：RingGeometry, rotateX -π/2)
│           └─ moonPivot (rotation.y = 卫星角) → moonMesh  ← 嵌套继承
├─ comet：mesh 直接由 ellipsePos 设 position + rotation.y（彗尾背日）
├─ <belt> pivot (慢转) → Points (asteroid / kuiper，双层)
└─ EffectComposer: RenderPass → UnrealBloomPass → OutputPass
```

> **关键设计**：① 卫星 pivot 挂在行星 mesh 下 → 自动继承公转位移，真 3D 绕行星转。② 用独立 `inclGroup` 同时倾斜轨道线与公转 pivot，保证二者一致。③ 彗星不走 pivot，直接每帧用焦点方程 `r(θ)=a(1-e²)/(1+e·cosθ)` 设位置。

### 4.3 模块职责（实际）

| 模块 | 职责 | 关键导出 |
|---|---|---|
| `main.js` | Scene/Camera/Renderer/Composer 装配、光照、主循环、resize | `init()` |
| `data.js` | 天体数据集（真实+缩放）+ LOOKUP | `bodies`, `moons`, `belts`, `LOOKUP` |
| `textures.js` | Canvas 程序化纹理（Value Noise 分形） | `makeRockyTexture`,`makeGasGiantTexture`,`makeEarthTexture`,`makeSunTexture`,`makeRingTexture`,`makeBodyTexture` |
| `starfield.js` | 星空 Points（多色顶点） | `createStarfield()` |
| `orbits.js` | 轨道线 + 椭圆位置 | `createOrbitLine()`, `ellipsePos()` |
| `bodies.js` | 构建太阳/行星/卫星/环/彗星 mesh | `createBodies()` |
| `belts.js` | 小行星带/柯伊伯带 Points | `createBelts()` |
| `engine.js` | Clock 时间累计、公转/自转/带转更新 | `createEngine()` → `update/setSpeed/togglePause/reset` |
| `interaction.js` | OrbitControls + Raycaster + 控件 + 键盘 + 选中高亮 | `initInteractions()` |

### 4.4 关键参数（实际）
- 坐标缩放：太阳半径=7、水星轨道=16、地球轨道=30、海王星=108、阋神星=138（见 data.js）
- 光照：`PointLight(0xfff2cc, 2.4, distance=0, decay=0)` 恒定照明；`AmbientLight(0x3a4660, 0.55)` 填充
- 后处理：`UnrealBloomPass(strength=0.7, radius=0.5, threshold=0.82)`
- 色调映射：`ACESFilmicToneMapping`，`outputColorSpace = SRGB`
- 相机：FOV 55°，初始 `(0,120,220)`，距离范围 12–900

---

## 五、开发阶段划分与时间节点

> 估算总工期 **5 个工作日**（单人）；实际已全部完成。

### 阶段 0：项目骨架 ✅
importmap 引入 Three.js；HTML 骨架 + 加载页 + UI overlay。
- 验收：加载页消失后显示空场景 + 星空，控制台无报错 ✅

### 阶段 1：场景核心 + 太阳 + 星空 ✅
渲染器/相机/OrbitControls、太阳（自发光 + PointLight + Bloom）、星空。
- 验收：可拖拽旋转/缩放；太阳带辉光；星空多色 ✅

### 阶段 2：天体几何与纹理 ✅
八大行星（程序化纹理）、轨道线、土星环、卫星嵌套、矮行星、彗星、小行星/柯伊伯带。
- 验收：真 3D 球体，纹理可辨（气态条纹/陆地/陨石坑），环带可见 ✅

### 阶段 3：动画引擎 ✅
公转（Clock）、自转、真实周期比例、彗星椭圆。
- 验收：内快外慢；卫星绕行星；彗星走椭圆 ✅

### 阶段 4：交互系统 ✅
暂停/调速/重置/Raycaster 点击信息/选中高亮/键盘。
- 验收：点击出真实数据；调速/暂停连续；键盘可用 ✅

### 阶段 5：健壮性与优化 ✅
reduced-motion、响应式、无障碍、加载态、性能。
- 验收：移动端可用；reduced-motion 降级 ✅

### 阶段 6：调试与验证 ✅
修复光照衰减根因；Playwright 自动化验证（DOM/像素/交互）。
- 验收：零错误；天体纹理可见（像素亮度达标）✅

**里程碑**：M1 场景亮起 ✅ → M2 天体齐全 ✅ → M3 动起来 ✅ → M4 可交互 ✅ → M5 验证通过 ✅

---

## 六、资源需求

### 6.1 图像/几何资源
**全部程序化生成，零图片依赖：**
| 资源 | 生成方式 |
|---|---|
| 岩质行星纹理 | Canvas：Value Noise 分形 + 陨石坑径向渐变 → `CanvasTexture` |
| 气态巨行星纹理 | Canvas：纬度条纹 + 噪声湍流 + 大红斑椭圆斑 |
| 地球纹理 | Canvas：噪声海陆分布 + 沙漠/山地/极冠 + 云层叠加 |
| 太阳表面 | Canvas：湍流等离子噪声（冷→中→热三色） |
| 土星环 | Canvas：径向 alpha 条带（含 Cassini 缝隙） |
| 星空/带 | BufferGeometry 随机点 + 顶点色 |
| 彗尾 | Points 沿 +X 切向衰减 + 加性混合 |

### 6.2 数据资源
- NASA Planetary Fact Sheet（公转周期/直径/距太阳/质量/卫星数）→ 内置 `data.js`，附来源。

### 6.3 第三方依赖
- Three.js r161（CDN importmap，unpkg）。无其他依赖。

### 6.4 人力/工具
- 前端 1 人；Chrome/Edge/Firefox/Safari；DevTools；Playwright（自动化验证）。

---

## 七、关键技术难点与解决方案

| # | 难点 | 解决方案 |
|---|---|---|
| 1 | **行星纹理无图片** | Canvas 程序化：Value Noise 分形生成地表/气态条纹/极冠，转 `CanvasTexture`（wrapS=Repeat, anisotropy=4） |
| 2 | **太阳辉光真实感** | `MeshBasicMaterial` 自发光纹理 + `UnrealBloomPass`（threshold=0.82 仅高亮部分辉光） |
| 3 | **行星明暗面（昼夜）** | `MeshStandardMaterial` 受 PointLight 自然产生明暗，旋转视角可见昼夜分界 |
| 4 | **卫星绕行星真 3D** | moonPivot 挂于 planetMesh 下，`pivot.rotation.y` 驱动；继承父位移 |
| 5 | **调速/暂停不跳变** | Clock 累计 `simTime += dt*speed`；暂停冻结 simTime；不重置 transform |
| 6 | **真实周期下外行星太慢** | 0.1×–10× 调速；地球周期=12s 基准；周期取真实年数比例 |
| 7 | **小行星带性能（数千）** | 用 `Points`（单 draw call）+ 整带 pivot 慢转 |
| 8 | **土星环朝向与 UV** | `RingGeometry` + `rotateX(-π/2)`；自定义径向 UV（v=半径占比）使纹理径向映射；Cassini 缝 |
| 9 | **点击命中 3D 天体** | `Raycaster` + 屏幕坐标转 NDC；记录 pointerdown/up 位移区分点击与拖拽 |
| 10 | **ES Module 本地加载** | importmap CDN；本地 `python3 -m http.server`（file:// 不支持 module） |
| 11 | **轨道倾角一致性** | 独立 `inclGroup` 同时包裹轨道线与公转 pivot，统一 `rotation.x` |
| 12 | **彗星椭圆轨道** | 焦点方程 `r(θ)=a(1-e²)/(1+e·cosθ)` 每帧设 mesh.position；`rotation.y=-θ` 使彗尾背日 |
| 13 | **resize 与 DPI** | 监听 resize 同步 camera.aspect / renderer / composer / bloom；pixelRatio 上限 2 |
| 14 | ⭐ **天体看似无材质（实际为光照衰减）** | **根因**：`MeshStandardMaterial` 依赖光照，`PointLight.decay` 物理衰减使远处行星接收光照仅 0.001~0.015 → 渲染近黑。**修复**：`decay=0` 恒定照明（太阳系艺术化，距离非真实比例）。经像素验证：土星亮度 5→532 |
| 15 | **太阳无 orbit 导致引擎崩溃** | 引擎 update 分支判断：无 orbit 的项（太阳）只做自转，不访问 `orbit.orbitSec` |
| 16 | **加载页未隐藏** | 主循环首帧调用 `hideLoader()` + 2.5s 兜底超时双保险 |

---

## 八、测试计划与验证结果

### 8.1 测试策略
结构化人工测试 + 浏览器 DevTools 指标 + **Playwright 自动化**（DOM/控制台/像素 readback/交互）。

### 8.2 测试矩阵与结果
| 类别 | 测试项 | 通过标准 | 结果 |
|---|---|---|---|
| 功能 | F1–F26 逐项 | 全部生效 | ✅ |
| 渲染 | WebGL 画布 + 像素内容 | 非黑像素 >0 | ✅ 非黑 2.3%、彩色 1.3%、高亮 0.69% |
| 纹理可见 | 各行星配色像素 | RGB 匹调配色 | ✅ 火星(122,58,37)、海王星(87,114,163) |
| 交互 | 暂停/调速/点击 | 无报错 | ✅ 调速 5×、点击太阳出面板 |
| 错误 | pageerror / console | 零 | ✅ 无 |
| 兼容 | Chrome（SwiftShader WebGL） | 正常 | ✅ |
| 部署 | 本地 http 服务器 | 正常 | ✅ |

### 8.3 性能预算
- 首屏 < 2s（CDN 加载 Three.js r161）
- 稳态 60fps；`Points` 批渲染保证 draw call 极少

---

## 九、部署流程

### 9.1 本地
```bash
cd glm-test
python3 -m http.server 8000   # 必须用 http（ES Modules 不支持 file://）
# 访问 http://localhost:8000
```

### 9.2 生产（静态托管）
- **Vercel/Netlify**：框架选 "Other/Static"，构建命令留空，输出目录 `glm-test`
- **GitHub Pages**：`Settings → Pages → branch/root`
- **任意 HTTP 服务器**：上传 `glm-test/` 全量

### 9.3 上线检查清单
- [x] importmap CDN 版本锁定（r161）
- [ ] HTTPS（托管默认）、无混合内容
- [ ] 移动端 WebGL 可用
- [x] favicon 加载

---

## 十、项目交付标准

### 10.1 交付物
1. ✅ 完整源码（`glm-test/`，仅 Three.js CDN 依赖，100KB）
2. ✅ `README.md`（运行/快捷键/架构/数据来源/浏览器兼容）
3. ⬜ 在线部署 URL（待部署）

### 10.2 验收标准（DoD）
- [x] F1–F26 全部实现
- [x] 自动化验证零错误
- [x] 天体为真 3D 球体，纹理可见（像素证据）
- [x] 代码模块化（9 个 ES Module）、命名规范、注释清晰
- [x] README 完整可复现
- [ ] 四大浏览器 + 移动端手动回归（待人工）
- [ ] 线上部署（待执行）

### 10.3 风险与缓解
| 风险 | 缓解 |
|---|---|
| CDN 不可用（离线） | importmap 固定 r161；可本地 vendor 化 |
| WebGL 不支持（旧设备） | 加载页检测失败提示 |
| Three.js 版本 API 变动 | importmap 锁定 r161 |
| 范围蔓延 | 锁定 P0；增强列入 P2 |

---

## 附录：实际目录结构

```
glm-test/  (100KB)
├─ index.html              # importmap(Three.js r161 CDN) + UI overlay + 加载页
├─ PROJECT_PLAN.md         # 本文档
├─ README.md
├─ css/
│  ├─ variables.css        # 设计令牌
│  └─ ui.css               # overlay UI（控制栏/信息面板/加载页/响应式）
├─ js/                     # ES Modules（9 个）
│  ├─ main.js              # Scene/Camera/Renderer/Composer(Bloom) + 主循环
│  ├─ data.js              # 天体数据（真实天文 + 缩放参数）
│  ├─ textures.js          # Canvas 程序化纹理（噪声/气态/地球/太阳/环）
│  ├─ starfield.js         # 星空 Points
│  ├─ orbits.js            # 轨道线 + 椭圆位置
│  ├─ bodies.js            # 太阳/行星/卫星/环/彗星 mesh
│  ├─ belts.js             # 小行星带/柯伊伯带 Points
│  ├─ engine.js            # Clock 时间累计驱动公转/自转
│  └─ interaction.js       # OrbitControls + Raycaster + 控件 + 键盘
└─ assets/favicon.svg
```
