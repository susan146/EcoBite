# EcoBite 🌱

🔗 在线演示: https://ecobite-inky.vercel.app/

低碳饮食碳足迹追踪与食谱推荐 Web 应用。用户可查看食谱的碳排放数据，发现低碳替代方案，呼应 SDG12 负责任消费目标。

## 🌟 功能特性

- **食谱浏览**：按早/午/晚餐分类浏览低碳食谱
- **碳足迹可视化**：直观显示每道菜的碳排放量和等级
- **每日餐食规划**：选择今日餐食，自动计算总碳排放
- **周碳足迹仪表盘**：基于真实选择生成折线图、环形图、柱状图
- **低碳替代建议**：为每道菜提供更低碳的替代方案
- **收藏功能**：收藏喜欢的食谱（localStorage 持久化）

## 🛠️ 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 19.x |
| 路由 | React Router | 7.x |
| 语言 | TypeScript | 5.6.x |
| 构建工具 | Vite | 8.x |
| 样式 | Tailwind CSS | 3.x |
| 图表 | Recharts | 2.x |
| 包管理 | pnpm | 9.x |

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 http://localhost:5000/

### 构建生产版本

```bash
pnpm build
```

## 📁 项目结构

```
├── src/                # 前端源码
│   ├── components/     # 可复用组件
│   │   ├── Header/     # 顶部导航栏
│   │   ├── RecipeCard/ # 食谱卡片
│   │   └── SearchBar/  # 搜索栏
│   ├── pages/          # 页面组件
│   │   ├── HomePage/   # 首页：食谱卡片墙 + 餐食选择
│   │   ├── Dashboard/  # 仪表盘：碳足迹图表
│   │   └── Favorites/  # 收藏页
│   ├── data/           # 数据层
│   │   ├── types.ts    # TypeScript 类型定义
│   │   ├── recipes.ts  # 碳足迹工具函数
│   │   └── mockRecipes.ts # 模拟食谱数据
│   └── hooks/          # 自定义 Hooks
│       ├── useFavorites.ts # 收藏管理
│       └── useMealPlan.ts  # 餐食规划
├── public/             # 静态资源（食谱图片）
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 📊 数据说明

- 碳排放因子基于真实数据参考：
  - 牛肉：27 kg CO₂e/kg
  - 鸡肉：6 kg CO₂e/kg
  - 蔬菜：2 kg CO₂e/kg
- 所有数据使用 localStorage 持久化，纯前端实现，无需后端数据库

## 🎯 SDG 目标

本项目呼应 **SDG12 负责任消费和生产**，旨在帮助用户了解饮食对环境的影响，做出更可持续的消费选择。

## 📄 License

MIT
