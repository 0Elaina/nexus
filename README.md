# Nexus

基于前后端分离架构的现代化个人独立博客系统。包含游客只读浏览/检索，以及单博主管理员登录鉴权后的文章全生命周期管理、分类与标签多对多维护。

---

## 技术栈

- **前端**：React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + Radix UI + TanStack Query v5 + Zustand + Motion + md-editor-rt
- **后端**：Spring Boot 4.x + MyBatis-Plus + H2 文件数据库 (`./data/blogdb`) + Redis (本地 6380 端口，Lettuce + StringRedisTemplate)
- **协议契约**：标准 RESTful + 统一响应包装 `Result<T>` + 前端反向代理 `/api`

---

## 工程目录结构

```text
nexus/
├── backend/                  # 后端工程 (Maven 多模块单体 Modular Monolith)
│   ├── pom.xml               # 聚合根 POM (nexus-parent)
│   ├── nexus-common/         # 通用切片 (Result / Page / Exception / UserContext / AOP)
│   ├── nexus-category/       # 分类业务切片 (Entity / Mapper / Service / Controller)
│   ├── nexus-tag/            # 标签业务切片 (Entity / Mapper / Service / Controller / Redis 旁路)
│   ├── nexus-article/        # 文章聚合根 (Article / ArticleTag / 削峰落库 / 单控制器)
│   ├── nexus-user/           # 用户领域切片 (SysUser / 资料 / 博主脱敏名片)
│   ├── nexus-auth/           # 认证切片 (JWT / Redis 黑名单注销 / TokenInterceptor)
│   └── nexus-app/            # 主启动入口、全站宏观数据 BFF 门面与 schema.sql
├── frontend/                 # 前端工程 (Vite + React 19)
│   ├── src/
│   │   ├── features/         # 垂直业务切片 (article / tag / category / home / auth / user / site)
│   │   ├── components/       # 公共 UI 与 Layout (AdminLayout / FloatingNav / ToyDock)
│   │   ├── config/           # 动效、布局标尺与设计令牌
│   │   ├── lib/              # api-client (Axios 拦截器)
│   │   └── routes/           # React Router 路由声明
│   └── package.json
└── CONTEXT.md                # 项目唯一全局上下文与架构里程碑记录
```

---

## 本地快速启动

### 1. 前置依赖
- JDK 21+
- Node.js 20+ & pnpm
- Redis 服务（本地运行于 `6380` 端口）

### 2. 启动后端服务
```bash
cd backend
# Windows
./mvnw.cmd spring-boot:run -pl nexus-app
# Linux / macOS
./mvnw spring-boot:run -pl nexus-app
```
后端服务默认监听端口：`http://localhost:8080`

### 3. 启动前端展台
```bash
cd frontend
pnpm install
pnpm dev
```
前端服务默认监听端口：`http://localhost:5173`

---

## 初始管理员账号

- **用户名**：`admin`
- **默认密码**：`admin123`
