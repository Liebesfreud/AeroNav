# AeroNav

AeroNav 是一个简洁的个人导航页项目，用来管理常用链接、分组和界面偏好。

## 功能简介

- 导航首页：展示和搜索链接
- 分组与链接管理：支持新增、删除、排序
- 设置页：支持主题、密度、打开方式等配置
- 数据导入/导出：可备份和恢复 JSON 数据
- 后端接口：基于 Cloudflare Workers
- 数据存储：使用 Cloudflare D1

## 技术栈

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Cloudflare Workers
- Cloudflare D1
- Zod
- Tailwind CSS

## 页面

- `/`：导航首页
- `/settings`：设置页
- `/widgets`：组件页

## 本地开发

先安装依赖：

```bash
npm install
```

启动前端开发环境：

```bash
npm run dev
```

启动 Cloudflare Worker 本地环境：

```bash
npm run cf:dev
```

## 数据库迁移

执行本地 D1 迁移：

```bash
npm run db:migrate:local
```

执行远程 D1 迁移：

```bash
npm run db:migrate:remote
```

如果你修改了 migration 文件，但本地 `.wrangler/state` 里的数据库已经是旧结构，需要继续新增 migration，而不是只改旧 migration 文件。

## 构建

```bash
npm run build
```

## 部署到 Cloudflare

这个项目部署目标是 **Cloudflare Workers + Workers Assets + D1**，不是 Cloudflare Pages。

### 部署前准备

1. 安装依赖

```bash
npm install
```

2. 登录 Cloudflare

```bash
npx wrangler login
```

3. 创建 D1 数据库

```bash
npx wrangler d1 create aeronav-db
```

执行后会得到一个 `database_id`。

4. 把 `wrangler.jsonc` 里的占位值替换成真实 D1 ID：

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "aeronav-db",
    "database_id": "你的真实 database_id",
    "migrations_dir": "migrations"
  }
]
```

5. 先构建前端

```bash
npm run build
```

6. 执行远程 D1 migration

```bash
npm run db:migrate:remote
```

7. 部署 Worker

```bash
npm run cf:deploy
```

### Access 认证说明

这个项目默认依赖 **Cloudflare Access** 保护页面访问。

如果没有在 Cloudflare 控制台为该站点配置 Access：
- 页面请求会返回未授权提示页
- API 也无法拿到正常身份信息

也就是说，**部署成功不等于可以直接访问页面**，还需要在 Cloudflare Zero Trust / Access 里为该应用配置访问策略。

### 推荐上线顺序

```bash
npm run build
npm run db:migrate:remote
npm run cf:deploy
```

## API 概览

主要接口包括：

- `GET /api/bootstrap`
- `POST /api/groups`
- `PATCH /api/groups/:id`
- `DELETE /api/groups/:id`
- `POST /api/links`
- `PATCH /api/links/:id`
- `DELETE /api/links/:id`
- `POST /api/reorder`
- `GET /api/export`
- `POST /api/import`

## 项目结构

```text
src/
  app/         应用入口与路由
  features/    页面与功能模块
  lib/         API 与通用逻辑
  hooks/       React Hooks
worker/        Cloudflare Worker 后端
migrations/    D1 数据库迁移
```

## 说明

这是一个前后端一体的导航站项目：前端负责界面与交互，Worker 提供 API，D1 负责持久化存储。
