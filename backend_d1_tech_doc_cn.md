# 基于 Cloudflare Pages + D1 的后端架构说明

本文档是一个可复用的技术方案，用于在不自建服务器的前提下，实现账号登录、注册与轻量级数据持久化。示例来自 Legends of the Spire，但整体结构适用于任何需要账号体系与用户进度的 Web 项目。

---

## 1. 总体架构

| 关注点      | 方案                                                                 |
|-------------|----------------------------------------------------------------------|
| 资源托管    | Cloudflare Pages 部署 React/Vite 产物。                              |
| API         | Cloudflare Pages Functions 处理 `/api/**` 请求。                      |
| 数据库      | Cloudflare D1（SQLite 兼容）存放用户凭证及元数据。                    |
| 认证        | 邮箱 + 密码，使用 PBKDF2-HMAC-SHA256（Web Crypto）+ 随机盐。          |
| 会话        | 前端 `localStorage` 缓存用户对象，API 保持无状态。                   |
| 进度存档    | 目前保存在客户端 `localStorage`，后续可扩展到 D1/R2。                |

该架构无需传统应用服务器，利用 Cloudflare 的边缘网络同时解决 TLS、静态托管与无服务器计算。

---

## 2. 目录结构

```
root/
├─ src/                        # React/Vite 前端
├─ functions/
│  ├─ api/
│  │   ├─ auth/login.js
│  │   └─ auth/register.js
│  └─ utils/crypto.js          # PBKDF2 工具
├─ schema.sql                  # D1 数据表定义
├─ wrangler.toml               # Pages + D1 绑定配置
└─ ...
```

* `functions/api/**` 会映射到 Cloudflare Pages 的 `/api/**` 路径。
* `wrangler.toml` 描述了 D1 绑定与环境变量。
* `schema.sql` 在本地或云端通过 `wrangler d1 execute` 初始化。

---

## 3. 认证流程

### 3.1 注册

1. 前端 POST `{ email, username, password }` 到 `/api/auth/register`。
2. 服务端校验参数、检查邮箱/用户名唯一性。
3. `crypto.getRandomValues` 生成随机盐。
4. 使用 PBKDF2-HMAC-SHA256（≥100,000 次迭代）计算哈希。
5. 将 `id, email, username, password_hash, salt, created_at` 写入 D1。
6. 返回脱敏后的用户对象。

### 3.2 登录

1. 前端提交 `{ email, password }`。
2. 从 D1 查询用户记录及盐值。
3. 重复 PBKDF2 计算并与存储的哈希对比（常量时间比较）。
4. 返回用户基础信息。

### 3.3 前端会话

* 将用户对象保存到 `localStorage`，刷新页面时由 `authService` 重新加载。
* 若需更高安全性，可改用 JWT 或 Cloudflare Access，但对演示项目而言简化方案即可。

---

## 4. Cloudflare 配置

### 4.1 `wrangler.toml`

```toml
name = "lot-spire"
main = "functions/[[path]].js"
compatibility_date = "2023-10-01"

[vars]
PBKDF2_ITERATIONS = "150000"

[[d1_databases]]
binding = "DB"
database_name = "lot-spire"
database_id = "xxxx-xxxx"
```

部署命令：`wrangler pages deploy --project-name=lot-spire ./dist`

### 4.2 本地调试

```bash
wrangler pages dev . --d1=DB=lot-spire        # 启动前端+Functions+D1
wrangler d1 execute lot-spire --local --file=schema.sql   # 初始化表结构
```

---

## 5. D1 数据表

`schema.sql` 示例：

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

后续可以按需添加 `saves`、`inventory` 等表，支持云端存档或排行榜。

---

## 6. 客户端存档策略

当前项目将游戏进度（地图、卡组、金币等）序列化为 JSON，存入 `localStorage` 的 `SAVE_KEY_${userId}`：

* **命名隔离**：不同账号对应不同 key，避免多用户冲突。
* **压缩**：推荐使用 `lz-string` 等库减少体积。
* **未来扩展**：可在登录后引导用户同步到 D1/R2，实现多设备共享。

---

## 7. 安全注意事项

1. **PBKDF2**：确保迭代次数设在 100k 以上，并通过环境变量控制。
2. **速率限制**：可使用 Cloudflare KV 或 Durable Objects 存储登录尝试计数。
3. **HTTPS**：Pages 默认启用 TLS，无需额外配置。
4. **CORS**：若仅由同域前端调用，可保持默认；跨域场景需显式返回 `Access-Control-Allow-Origin`。
5. **敏感信息**：盐值、哈希等永远不要返回给客户端；日志也应避免记录密码。

---

## 8. 可复用与扩展

* **横向复制**：将 `functions/api/auth`、`authService`、`crypto.js` 直接迁移到新项目，仅需调整 `schema.sql` 与 `wrangler.toml`。
* **管理工具**：通过 `wrangler d1 execute` 或单独的管理界面执行 SQL。
* **高级特性**：可以增加 JWT、Cloudflare Access、服务器端存档、支付回调等，仍然在 Cloudflare 生态内部完成。
* **定时任务**：可用 Cloudflare Workers + Cron 触发器处理定时清理或统计。

---

## 9. 部署清单

1. `wrangler d1 create <db-name>` → 复制 `database_id`。
2. 更新 `wrangler.toml` 并设置 `[vars]`。
3. `wrangler d1 execute <db-name> --file=schema.sql` 初始化表结构。
4. `npm run build` 生成 `dist/`。
5. `wrangler pages deploy` 或连接 GitHub 自动部署。
6. 用 `curl`/Thunder Client 测试 `/api/auth/register`、`/api/auth/login`。
7. 前端登录、刷新，确认 `localStorage` 会话生效。

---

## 10. 结论

借助 Cloudflare Pages + Functions + D1，可以在成本极低、部署简单的前提下完成完整的账号系统和轻量后端。该方案：

* 免运维：无需自管服务器或容器。
* 延迟低：API 与数据库位于同一区域的边缘节点。
* 易复制：将本文档与示例代码作为模板，快速启动新的产品原型或游戏项目。

若需要更复杂的功能（排行榜、商店、推送等），可以在现有基础上逐步拓展，而不必更换底层平台。


