# PUBG 地图查询工具

一个简洁实用的 PUBG 地图查询工具，支持查看所有 PUBG 地图，提供流畅的缩放和拖拽交互体验。

![PUBG Map Viewer](https://img.shields.io/badge/PUBG-Map%20Viewer-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.2-purple)

## ✨ 功能特性

- 🗺️ **9 张官方地图**：艾伦格、米拉玛、萨诺、维寒迪、卡拉金、泰戈、帝斯顿、帕拉莫、荣都
- 🎨 **PUBG 游戏风格**：深色主题，橙黄色强调色，还原游戏视觉体验
- 🔍 **智能缩放**：以鼠标位置为中心的缩放，自动适应容器大小
- 🖱️ **拖拽平移**：按住鼠标左键拖动查看地图细节
- 🔄 **自动重置**：切换地图时自动重置缩放和位置
- 📱 **响应式设计**：完美适配桌面和移动设备

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
pnpm build
```

构建产物将输出到 `dist/` 目录。

### 预览生产版本

```bash
pnpm preview
```

## 📖 使用说明

### 查看地图

1. **切换地图**：点击顶部的地图标签
2. **缩放地图**：滚动鼠标滚轮（以鼠标位置为中心）
3. **移动地图**：按住鼠标左键拖动
4. **重置视图**：点击"重置"按钮恢复默认视图

### 缩放范围

- 最小：50%（0.5x）
- 默认：100%（自动适应容器）
- 最大：300%（3x）

### 添加自定义地图

地图图片存放在 `/public` 目录下。如需添加或更换地图：

1. 将地图图片（JPG/PNG）放到 `/public` 目录
2. 编辑 `src/data/maps.ts`，添加或修改地图配置：

```typescript
{
  id: 'custom-map',
  name: '自定义地图',
  nameEn: 'Custom Map',
  size: '8km x 8km',
  image: '/custom-map.jpg'  // 图片路径，相对于 /public
}
```

## 📁 项目结构

```
pubg/
├── public/                    # 静态资源目录
│   ├── 艾伦格.jpeg
│   ├── 米拉玛.jpeg
│   ├── 萨诺.jpeg
│   └── ...                    # 其他地图图片
├── src/
│   ├── components/            # React 组件
│   │   ├── MapViewer.tsx      # 地图查看器核心组件
│   │   ├── MapViewer.css
│   │   ├── MapTabs.tsx        # 地图标签切换组件
│   │   └── MapTabs.css
│   ├── data/
│   │   └── maps.ts            # 地图数据配置
│   ├── types/
│   │   └── map.ts             # TypeScript 类型定义
│   ├── App.tsx                # 主应用组件
│   ├── App.css
│   ├── main.tsx               # 应用入口
│   └── index.css              # 全局样式（PUBG 主题）
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🛠️ 技术栈

- **React 19** - UI 框架
- **TypeScript 5.9** - 类型安全
- **Vite 7.2** - 构建工具
- **CSS3** - 样式（CSS Variables + Flexbox）

## 🎯 核心实现

### 地图查看器组件

地图查看器实现了以下核心功能：

- **自动适应容器**：根据容器和图片尺寸自动计算初始缩放比例
- **以鼠标为中心的缩放**：通过坐标变换算法实现精准的鼠标位置缩放
- **拖拽平移**：支持拖动查看地图的任意区域
- **状态管理**：使用 React Hooks 管理缩放、位置和拖拽状态

### 缩放配置

可以在 `src/components/MapViewer.tsx` 中调整缩放参数：

```typescript
const ZOOM_CONFIG: ZoomConfig = {
  minScale: 0.5,      // 最小缩放比例
  maxScale: 3,        // 最大缩放比例
  scaleStep: 0.25     // 每次滚轮缩放 25%
};
```

## 🌐 浏览器支持

- ✅ Chrome/Edge (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 🔧 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器（支持 HMR）
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 运行 ESLint 检查
pnpm lint
```

---

**Enjoy exploring PUBG maps! 🎮**

