# 太阳系 3D · Solar System

基于 **Three.js（WebGL）** 构建的真 3D 交互式太阳系模型。所有天体为真实球体几何，物理光照（PointLight）+ Bloom 后处理辉光，行星表面全部由 Canvas **程序化生成纹理**（零图片资源）。

## 特性

- **真 3D 球体**：`SphereGeometry` + `MeshStandardMaterial`，受太阳 `PointLight` 照射产生真实的明暗昼夜分界。
- **程序化纹理**：Value Noise 分形生成岩质地表/气态条纹/地球海陆云层/太阳等离子/土星环透明条带，无任何外部图片。
- **Bloom 辉光**：`UnrealBloomPass` 后处理让太阳与高亮天体发光。
- **专业级天体**：太阳、八大行星、土星环、10 颗主要卫星（嵌套真 3D 绕转）、3 颗矮行星、小行星带、柯伊伯带、哈雷型彗星（椭圆轨道 + 粒子拖尾）。
- **真实周期比例**：公转速度按 NASA 真实年数换算，内行星快、外行星慢；行星按各自速率自转、带轴倾角。
- **丰富交互**：
  - OrbitControls 自由旋转/缩放视角（拖拽 + 滚轮）
  - Raycaster 点击任意天体 → 真实数据面板（直径/距太阳/周期/质量/卫星数/简介）
  - 暂停/播放、0.1×–10× 调速、重置
  - 键盘快捷键
- **健壮**：`prefers-reduced-motion` 降级、响应式 resize、加载页、无障碍 aria。

## 运行

> ⚠️ ES Modules 需通过 HTTP 提供（不支持 `file://` 双击）。

```bash
cd glm-test
python3 -m http.server 8000
# 浏览器访问 http://localhost:8000
```

## 快捷键

| 键 | 功能 |
|---|---|
| `Space` | 暂停 / 播放 |
| `←` / `→` | 减速 / 加速 |
| `R` | 重置视角与时间 |
| `Esc` | 关闭信息面板 |
| 鼠标拖拽 | 旋转 3D 视角 |
| 滚轮 | 缩放 |
| 点击天体 | 查看详情 |

## 架构

```
glm-test/
├─ index.html              # importmap(Three.js CDN) + UI overlay + 加载页
├─ css/
│  ├─ variables.css        # 设计令牌
│  └─ ui.css               # overlay UI（控制栏/信息面板/加载页/响应式）
├─ js/                     # ES Modules
│  ├─ main.js              # Scene/Camera/Renderer/Composer(Bloom) 装配 + 主循环
│  ├─ data.js              # 天体数据（真实天文 + 缩放参数）
│  ├─ textures.js          # Canvas 程序化纹理（噪声/气态条纹/地球/太阳/环）
│  ├─ starfield.js         # 星空 Points
│  ├─ orbits.js            # 轨道线 + 椭圆位置
│  ├─ bodies.js            # 太阳/行星/卫星/环/彗星 mesh 构建
│  ├─ belts.js             # 小行星带/柯伊伯带 Points
│  ├─ engine.js            # Clock 时间累计驱动公转/自转
│  └─ interaction.js       # OrbitControls + Raycaster + 控件 + 键盘
└─ assets/favicon.svg
```

**核心原理**：
- 每颗行星 = 倾角容器（轨道倾角）→ 公转 `pivot`（`rotation.y`，Clock 驱动）→ 行星 mesh（`position.x = 轨道半径`，带轴倾角）。
- 卫星 pivot 挂在行星 mesh 下，自动继承公转位移 → 真 3D 绕行星转。
- 彗星按焦点方程 `r(θ)=a(1-e²)/(1+e·cosθ)` 沿椭圆运动，拖尾背向太阳。
- 调速/暂停仅改时间累计倍率，位置天然连续不跳。
- Three.js r161 经 importmap 从 unpkg CDN 加载，锁版本。

## 数据来源

NASA Planetary Fact Sheet（公转周期、直径、距太阳距离、质量、卫星数）。

## 部署

纯静态，任意静态托管即可（Vercel / Netlify / GitHub Pages / Nginx）：构建命令留空，输出目录即 `glm-test/`。需 HTTPS（CDN 资源）。

## 浏览器兼容

支持 WebGL2 的现代浏览器：Chrome / Edge / Firefox / Safari（桌面与移动端）。
