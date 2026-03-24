# 深圳市福田产业投资服务有限公司信息化系统

## 项目简介

福田产投信息化系统是一套面向资产租赁、园区运营、企业孵化的一体化管理平台，实现业务全流程数字化管控，提升运营效率与决策科学性。

## 技术栈

- **前端框架**: Vue 3.4 + Vite 5
- **UI组件库**: Element Plus 2.4
- **状态管理**: Pinia 2.1
- **路由管理**: Vue Router 4.2
- **图表库**: ECharts 5.4
- **HTTP请求**: Axios 1.6
- **样式预处理**: Sass

## 功能模块

### 1. 基础数据管理
- 资产台账管理 - 园区资产数字化档案
- 租户档案管理 - 租户360°档案管理
- 基础字典管理 - 系统核心基础数据维护

### 2. 资产租赁管理
- **租赁台账** - 与 `materials/租赁台账（新）.xlsx` 同步的六类工作表明细（导入见 `npm run import:ledger`）
- 租赁合同管理 - 由「新一代产业园」「泰然立城」产业入驻台账融合的合同列表
- 租金收缴管理 - 账单生成、收款记录、逾期催缴
- 续约与退租管理 - 合同续约、退租流程管理

### 3. 园区运营管理
- 园区日常管理 - 公告发布、公共资源管理
- 设施报修管理 - 报修工单处理与跟踪
- 园区巡检管理 - 巡检计划与记录管理
- 租户服务管理 - 服务需求响应与处理

### 4. 企业孵化平台
- 入驻管理 - 孵化企业入驻申请与审核
- 孵化服务管理 - 定制化孵化服务跟踪
- 毕业与退出管理 - 毕业审核与退出流程

### 5. 数据分析
- 数据概览 - 核心KPI指标实时监控
- 报表中心 - 多维度业务报表生成

### 6. 系统管理
- 用户管理 - 系统用户账号管理
- 角色权限管理 - 角色与权限配置
- 操作日志 - 系统操作记录追溯
- 数据备份 - 数据备份与恢复

## 项目结构

```
福田信息化系统/
├── .vscode/
│   └── settings.json       # VS Code / Live Server：网站根目录指向 dist（须先 build）
├── index.html              # Vite 入口（须由开发服务器或构建流程使用，勿单独 file:// 打开）
├── vite.config.js          # Vite 配置（base 为相对路径；开发/预览默认端口 5500）
├── vercel.json               # Vercel SPA 回退
├── netlify.toml              # Netlify 构建与 SPA 回退（Git 连接部署）
├── public/_redirects         # Netlify Drop 上传 dist 时的 SPA 回退（构建进 dist）
├── materials/               # 业务素材（如《租赁台账（新）.xlsx》）
├── scripts/                 # 工具脚本（export_lease_ledger.py 导出台账 JSON）
├── public/data/             # 静态数据（lease-ledger.json，由脚本生成）
├── dist/                    # 生产构建输出目录（npm run build 生成）
└── src/
```

```
src/
├── api/                    # API接口层
│   ├── index.js           # Axios配置
│   └── modules/           # 各模块API
│       ├── asset.js       # 资产管理API
│       ├── tenant.js      # 租户管理API
│       ├── contract.js    # 合同管理API
│       ├── rent.js        # 租金管理API
│       ├── park.js        # 园区运营API
│       ├── incubation.js  # 孵化服务API
│       ├── analysis.js    # 数据分析API
│       ├── leaseLedger.js # 租赁台账 JSON（fetch public/data）
│       └── system.js      # 系统管理API
├── layouts/               # 布局组件
│   └── MainLayout.vue     # 主布局
├── router/                # 路由配置
│   └── index.js
├── stores/                # 状态管理
│   └── user.js            # 用户状态
├── styles/                # 全局样式
│   └── index.scss         # 主题样式
├── views/                 # 页面组件
│   ├── login/             # 登录页
│   ├── dashboard/         # 首页仪表盘
│   ├── basic/             # 基础数据管理
│   │   ├── assets/        # 资产台账
│   │   ├── tenants/       # 租户档案
│   │   └── dictionary/    # 基础字典
│   ├── lease/             # 资产租赁管理
│   │   ├── ledger/        # 租赁台账（Excel 全量）
│   │   ├── contracts/     # 合同管理（台账融合）
│   │   ├── rent/          # 租金收缴
│   │   └── renewal/       # 续约退租
│   ├── park/              # 园区运营管理
│   │   ├── daily/         # 日常管理
│   │   ├── repair/        # 设施报修
│   │   ├── inspection/    # 园区巡检
│   │   └── service/       # 租户服务
│   ├── incubation/        # 企业孵化平台
│   │   ├── admission/     # 入驻管理
│   │   ├── service/       # 孵化服务
│   │   └── graduation/    # 毕业退出
│   ├── analysis/          # 数据分析
│   │   ├── overview/      # 数据概览
│   │   └── reports/       # 报表中心
│   └── system/            # 系统管理
│       ├── users/         # 用户管理
│       ├── roles/         # 角色权限
│       ├── logs/          # 操作日志
│       └── backup/        # 数据备份
├── App.vue                # 根组件
└── main.js                # 入口文件
```

## 设计规范

### 主题配色
- **主色（暖金色）**: #BF933B - 品牌标识、核心操作、选中状态
- **辅助色（深蓝色）**: #042178 - 导航栏、侧边栏、主标题
- **成功色（深绿色）**: #286634 - 正向数据指标
- **危险色（红色）**: #D52A1E - 负向数据指标

### UI设计原则
- 简洁专业的企业级界面风格
- 数据可视化清晰直观
- 操作流程简化，降低学习成本
- 响应式设计，适配多终端

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖
```bash
npm install
```

### 登录（演示账号）

当前前端在无后端模式下校验账号密码，默认：

- 用户名：`admin`
- 密码：`admin123456`

未登录访问业务页会自动跳转登录页；退出请使用右上角「退出登录」。

### 更新租赁台账数据（Excel 变更后）

将 `materials/租赁台账（新）.xlsx` 替换或更新后执行：

```bash
npm run import:ledger
```

会重新生成 `public/data/lease-ledger.json`，前端「租赁台账 / 租赁合同 / 租金收缴」均读取该文件。

### 启动开发服务器

默认在 **http://127.0.0.1:5500** 启动（与常见 Live Server 端口一致）。请使用本命令做日常开发，**不要**用 Live Server 打开项目根目录的源码 `index.html`（无法解析 `vue` 等模块）。

```bash
npm run dev
```

### 使用 Live Server（5500）时

若仍使用 VS Code 的 **Live Server** 扩展访问 `http://127.0.0.1:5500`：

1. 先在项目根目录执行 **`npm run build`** 生成 `dist`。
2. 本仓库已配置 `.vscode/settings.json`，将 Live Server 的网站根目录设为 **`dist`**（不是项目根目录）。
3. 用 Live Server 打开后，访问 `http://127.0.0.1:5500/` 或 `http://127.0.0.1:5500/index.html` 即为打包后的页面。

注意：不要用 Live Server 打开**未构建**的仓库根目录 `index.html`，否则仍会白屏或控制台报无法解析模块。

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

### 部署到公网（长期：Vercel / Netlify）

两种方式任选其一。部署前本地确认构建无报错：`npm run build`。

#### 方式 A：Vercel（推荐，与 Vue/Vite 兼容好）

1. 打开 [vercel.com](https://vercel.com) 用 GitHub/GitLab/Bitbucket 注册并登录。  
2. **通过网页导入仓库（推荐）**  
   - Dashboard → **Add New…** → **Project** → Import 你的 Git 仓库。  
   - Framework Preset 选 **Vite**，Build Command：`npm run build`，Output Directory：`dist`。  
   - Deploy。成功后得到 **`https://你的项目名.vercel.app`** 一类地址。  
3. **或通过 CLI（适合本机已装 Node）**  
   ```bash
   npm i -g vercel
   cd 项目根目录
   vercel login
   vercel          # 首次按提示链接项目
   vercel --prod   # 生产环境
   ```  
4. 仓库根目录已包含 **`vercel.json`**，用于 History 模式下刷新子路径（如 `/dashboard`）不 404。

#### 方式 B：Netlify

**B1：连接 Git 自动构建**  
1. 打开 [app.netlify.com](https://app.netlify.com) 登录 → **Add new site** → **Import an existing project**。  
2. 选仓库，构建设置：**Build command** `npm run build`，**Publish directory** `dist`。  
3. 根目录 **`netlify.toml`** 已配置 SPA 回退，部署完成后使用站点默认域名（如 `*.netlify.app`）。

**B2：仅上传构建产物（Drop）**  
1. 本地执行 `npm run build`。  
2. 打开 [Netlify Drop](https://app.netlify.com/drop)，把 **`dist` 整个文件夹**拖入页面。  
3. **`public/_redirects`** 会在构建时复制到 **`dist/_redirects`**，用于 SPA 路由；若你手动打包请确认 `dist` 内含 `_redirects` 文件。

#### 部署后注意事项

- 本项目 `axios` 的 `baseURL` 为 `/api`，线上若无后端，相关接口会失败；登录与租赁台账等已走前端本地逻辑/静态 JSON 的页面可正常使用。  
- 若需自定义域名，在 Vercel / Netlify 项目 **Domains** 里按提示添加 DNS 解析即可。

### 关于用浏览器直接打开 HTML

本项目为 **Vite + Vue** 工程。若用 `file://` 直接打开**项目根目录**的 `index.html`，页面会空白：脚本地址为 `/src/main.js`，在本地文件协议下无法正确加载，且浏览器无法像 Vite 一样解析 `node_modules` 中的模块。

正确方式：

1. **开发**：在项目根目录执行 `npm run dev`，通过终端提示的本地地址访问。
2. **查看打包结果**：先执行 `npm run build`，再打开 **`dist/index.html`**（已配置相对资源路径）；或使用 `npm run preview` 在本地 HTTP 服务中预览（路由更稳定）。

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 版权信息

© 2024 深圳市福田产业投资服务有限公司 版权所有

