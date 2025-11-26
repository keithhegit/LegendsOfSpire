### 注册登陆流程开发计划：后端注入 (The Backend Injection)



**当前状态**: 前端 UI 完备 (React/Vite). **目标**: 在根目录下新增 `functions/` 目录，实现 D1 数据库交互和身份验证 API。



#### 📅 阶段一：环境配置与数据库建模 (Configuration & Schema)



- **1.1 Wrangler 配置**: 在项目根目录创建/修改 `wrangler.toml`，这是连接前端与后端的桥梁。
- **1.2 数据库创建**: 使用 CLI 创建 D1 数据库并记录 ID。
- **1.3 表结构注入**: 编写 `schema.sql` 并执行初始化，建立 `users` 表。



#### 📅 阶段二：Edge 密码学基础 (Edge Crypto Layer)



- **2.1 编写加密工具**: 由于 Edge Runtime 没有 Node.js 环境，必须在 `functions/utils/crypto.js` 中使用原生 **Web Crypto API** 封装一套 `hash` 和 `verify` 工具（这是最难点，也是为了安全必须做的）。



#### 📅 阶段三：API 逻辑实现 (API Implementation)



- **3.1 注册接口 (`/api/auth/register`)**: 接收前端 JSON -> 调用加密工具 -> 写入 D1。
- **3.2 登录接口 (`/api/auth/login`)**: 接收前端 JSON -> 查询 D1 -> 验证 Hash -> 返回结果。



#### 📅 阶段四：前端对接 (Frontend Integration)



- **4.1 替换 AuthService**: 修改您现有的 `authService.js`，将 Mock 逻辑替换为 `fetch('/api/auth/...')`。
- **4.2 本地联调**: 使用 `wrangler pages dev` 启动全栈环境进行测试。

------



### 🚀 执行：第一步 (Stage 1 & 2 代码)



既然您是老手，我直接给您**核心配置文件**和**最棘手的加密工具代码**。请按顺序操作：



#### 1. 项目根目录配置 (`wrangler.toml`)



请在根目录新建或更新此文件。**关键是将 `database_id` 替换为您实际创建的 ID。**

Ini, TOML

```
# wrangler.toml
name = "legends-of-spire"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist" # 假设您是用 Vite 构建，输出目录通常是 dist

# 绑定 D1 数据库
[[d1_databases]]
binding = "DB" # 代码里通过 context.env.DB 访问
database_name = "legends-db"
database_id = "请在终端运行 npx wrangler d1 create legends-db 获取此ID"
```



#### 2. 数据库结构 (`schema.sql`)



保存到根目录。

SQL

```
-- schema.sql
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id TEXT PRIMARY KEY,           -- UUID
  email TEXT UNIQUE NOT NULL,    -- 登录邮箱
  username TEXT NOT NULL,        -- 游戏昵称
  password_hash TEXT NOT NULL,   -- 密文
  salt TEXT NOT NULL,            -- 盐值
  created_at INTEGER DEFAULT (unixepoch())
);
```

*执行命令*: `npx wrangler d1 execute legends-db --local --file=./schema.sql`



#### 3. 核心加密工具 (`functions/utils/crypto.js`)



**这是 Cloudflare Edge 环境专用的加密模块**。请创建目录 `functions/utils` 并存入此文件。

JavaScript

```
// functions/utils/crypto.js

// 将字符串转为 Uint8Array
const textEncoder = new TextEncoder();

/**
 * 生成随机盐值 (Hex 格式)
 */
export function generateSalt(length = 16) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return [...array].map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 使用 PBKDF2 算法对密码进行哈希
 * @param {string} password - 用户输入的明文密码
 * @param {string} salt - 随机盐值
 * @returns {Promise<string>} - 返回 Hex 格式的哈希值
 */
export async function hashPassword(password, salt) {
  // 1. 导入密码作为 Key
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  // 2. 生成 Hash
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: textEncoder.encode(salt),
      iterations: 100000, // 迭代次数，越高越安全但越慢
      hash: "SHA-256",
    },
    keyMaterial,
    256 // 生成 256 位 (32 字节) 的 hash
  );

  // 3. 转为 Hex 字符串返回
  return [...new Uint8Array(derivedBits)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 验证密码
 */
export async function verifyPassword(inputPassword, storedSalt, storedHash) {
  const inputHash = await hashPassword(inputPassword, storedSalt);
  return inputHash === storedHash;
}
```



#### 4. 注册接口 (`functions/api/auth/register.js`)



利用上面的工具，实现注册逻辑。

JavaScript

```
// functions/api/auth/register.js
import { generateSalt, hashPassword } from '../../utils/crypto';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { email, username, password } = await request.json();

    if (!email || !password || !username) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // 1. 检查邮箱是否已存在
    const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (existing) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });
    }

    // 2. 生成 ID 和 加密密码
    const userId = crypto.randomUUID();
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    // 3. 写入数据库
    await env.DB.prepare(
      "INSERT INTO users (id, email, username, password_hash, salt) VALUES (?, ?, ?, ?, ?)"
    ).bind(userId, email, username, passwordHash, salt).run();

    return new Response(JSON.stringify({ 
      success: true, 
      user: { id: userId, email, username } 
    }), { status: 201 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
```

这是**后端登录接口**和**前端对接层**的代码。

请注意：登录接口复用了我们刚才创建的 `crypto.js` 工具，确保在 Edge 环境下验证密码的安全性。



### 1. 后端登录接口 (`functions/api/auth/login.js`)



接收前端传来的邮箱和密码，去 D1 查库，提取出存好的 `salt` 和 `password_hash` 进行比对。

JavaScript

```
// functions/api/auth/login.js
import { verifyPassword } from '../../utils/crypto';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "请输入邮箱和密码" }), { status: 400 });
    }

    // 1. 从 D1 查找用户 (取出 hash, salt 和基本信息)
    const user = await env.DB.prepare(
      "SELECT id, username, email, password_hash, salt FROM users WHERE email = ?"
    ).bind(email).first();

    if (!user) {
      // 为了安全，模糊错误信息，防止枚举账号
      return new Response(JSON.stringify({ error: "账号或密码错误" }), { status: 401 });
    }

    // 2. 验证密码 (使用之前封装的 Web Crypto 逻辑)
    const isValid = await verifyPassword(password, user.salt, user.password_hash);

    if (!isValid) {
      return new Response(JSON.stringify({ error: "账号或密码错误" }), { status: 401 });
    }

    // 3. 登录成功，返回用户信息
    // 注意：绝对不要返回 password_hash 和 salt
    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    return new Response(JSON.stringify({ 
      success: true, 
      user: userInfo 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "服务器内部错误: " + err.message }), { status: 500 });
  }
}
```

------



### 2. 前端服务对接层 (`src/services/authService.js`)



这将替换掉您原来的 Mock 版本。现在的 Service 是一个纯粹的 API 搬运工，负责把 React 的请求发给上面的 Functions。

JavaScript

```
// src/services/authService.js

// Cloudflare Pages Functions 的 API 前缀
const API_BASE = '/api/auth';

export const authService = {
  /**
   * 用户登录
   * @param {string} email 
   * @param {string} password 
   */
  async login(email, password) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '登录失败');
    }

    // 登录成功后，通常我们会把用户信息存入 localStorage 以便刷新后保持状态
    // (虽然是后端验证，但前端需要知道"谁登录了"来显示名字)
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  /**
   * 用户注册
   * @param {string} username 
   * @param {string} email 
   * @param {string} password 
   */
  async register(username, email, password) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '注册失败');
    }

    // 注册成功自动登录
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  /**
   * 登出
   */
  logout() {
    localStorage.removeItem('user');
    // 如果之后做了服务器端 Session (Set-Cookie)，这里还需要调一个 API 去清除 Cookie
  },

  /**
   * 获取当前缓存的用户信息 (用于页面刷新后恢复状态)
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
```

------



### 🚀 也就是现在 (Now)



您现在的项目结构应该包含：

1. `functions/utils/crypto.js` (核心加密)
2. `functions/api/auth/register.js` (注册接口)
3. `functions/api/auth/login.js` (登录接口)
4. `src/services/authService.js` (前端调用)

**接下来的动作**： 请在终端启动全栈开发环境进行测试：

Bash

```
# 记得把 'legends-db' 换成您 wranger.toml 里写的一样的名字
npx wrangler pages dev . --d1 DB=legends-db
```

启动后，访问 `http://localhost:8788`，点击您的登录界面。

- **注册测试**: 输入新邮箱，观察 Console 是否显示 201 Created。
- **数据库验证**: 您可以在另一个终端运行 `npx wrangler d1 execute legends-db --local --command "SELECT * FROM users"`，看看刚刚注册的人是不是真的进库了（密码应该是乱码一样的 Hash）。