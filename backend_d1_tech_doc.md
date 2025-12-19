# Backend Architecture on Cloudflare Pages + D1

This document summarizes a reusable pattern for building lightweight authentication and game-state APIs with Cloudflare Pages Functions and the D1 SQLite-compatible database. Although the examples reference the Legends of the Spire project, the architecture is generic and can be applied to any Jamstack-style frontend that requires persistent user accounts and per-user save data.

---

## 1. High-Level Overview

| Concern                | Implementation                                                                                  |
|------------------------|-------------------------------------------------------------------------------------------------|
| Hosting                | Cloudflare Pages serves the React/Vite bundle.                                                  |
| Serverless APIs        | Cloudflare Pages Functions (`/functions/api/*`) handle HTTP requests.                            |
| Database               | Cloudflare D1 (SQLite-compatible) stores user credentials and metadata.                          |
| Authentication         | Email + password via PBKDF2-HMAC-SHA256 (Web Crypto) with per-user salt + high iteration count. |
| Session State          | Minimal: client stores JWT-less user object in `localStorage`; APIs remain stateless.            |
| Game Saves             | Stored client-side (localStorage) under user-scoped keys; server can be extended later.          |

This setup avoids running a traditional server. Cloudflare handles TLS termination, static hosting, and execution of serverless functions next to the data (D1) for low latency.

---

## 2. Repository Structure

```
root/
├── src/                         # React app (Vite)
├── functions/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.js
│   │   │   └── register.js
│   └── utils/
│       └── crypto.js            # PBKDF2 helpers using Web Crypto API
├── schema.sql                   # D1 schema (users table, optional metadata tables)
├── wrangler.toml                # Cloudflare Pages + D1 binding config
└── ...                          # scripts, docs, etc.
```

Key points:

* `functions/api/**` maps to `/api/**` routes when deployed on Cloudflare Pages. These functions run on the edge, with access to `env.DB` (the bound D1 database).
* `wrangler.toml` defines the binding between the Pages project and the D1 database (see section 4).
* `schema.sql` is applied once via `wrangler d1 execute <DB_NAME> --local --file=schema.sql`.

---

## 3. Authentication Flow

### 3.1 Registration (`functions/api/auth/register.js`)

1. Parse JSON body containing `{ email, username, password }`.
2. Validate input (length, format, uniqueness).
3. Generate salt via `crypto.getRandomValues`.
4. Derive password hash using PBKDF2-HMAC-SHA256 with ≥ 100,000 iterations.
5. Insert `{ id, email, username, password_hash, salt, created_at }` into D1.
6. Return a sanitized user object (no hash/salt) to the client.

### 3.2 Login (`functions/api/auth/login.js`)

1. Parse credentials from JSON body.
2. Fetch user row by email.
3. Recompute PBKDF2 hash using stored salt + iteration count.
4. Compare buffers using constant-time comparison.
5. On success, return minimal user payload (id, email, username, createdAt).

### 3.3 Client-Side Session

* The frontend stores the returned user object in `localStorage` (e.g., `authService.setCurrentUser`).
* Each page load checks for `localStorage` and hydrates the UI.
* For higher security, consider issuing JWTs or binding to Cloudflare Access tokens, but for non-sensitive game demos a simple client-side session is acceptable.

---

## 4. Cloudflare Configuration

### 4.1 `wrangler.toml`

```toml
name = "lot-spire"
main = "functions/[[path]].js"
compatibility_date = "2023-10-01"

[vars]
PBKDF2_ITERATIONS = "150000"

[[d1_databases]]
binding = "DB"                # accessible as env.DB in functions
database_name = "lot-spire"
database_id = "xxxxx-xxxxx"   # from `wrangler d1 create`
```

Deploy with:

```bash
wrangler pages deploy --project-name=lot-spire ./dist
```

### 4.2 Local Development

```bash
# 1. Start Pages + Functions + D1 emulator
wrangler pages dev . --d1=DB=lot-spire

# 2. Initialize schema (once)
wrangler d1 execute lot-spire --local --file=./schema.sql
```

The dev server proxies `/api/*` requests to the local Pages Functions runtime and persists data into the local D1 instance.

---

## 5. D1 Schema Design

`schema.sql` example:

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

For game projects, user inventory, achievements, or cloud saves can be added later via additional tables (e.g., `saves(user_id TEXT, slot INTEGER, data TEXT, updated_at INTEGER)`).

---

## 6. Cloud-Side Game State Strategy

Currently, the live project keeps the heavy game progress (map state, deck list, relics, etc.) in `localStorage` using a namespaced key such as `SAVE_KEY_${userId}`. This avoids database writes on every turn. Recommended best practices:

* **Namespaced keys**: `SAVE_KEY_<userId>` prevents cross-account leakage on shared browsers.
* **Compression**: Use `lz-string` or similar when storing large JSON.
* **Sync hooks**: When a user authenticates, the client reads the local save and optionally offers to upload to D1. This can be introduced later if multi-device sync is required.

---

## 7. Security Considerations

1. **Password hashing**: Use robust PBKDF2 settings. In `functions/utils/crypto.js`:
   ```js
   export async function hashPassword(password, salt, iterations = Number(env.PBKDF2_ITERATIONS)) {
     const enc = new TextEncoder();
     const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
     const key = await crypto.subtle.deriveBits(
       { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
       keyMaterial,
       256
     );
     return Buffer.from(key).toString('base64');
   }
   ```
2. **Rate limiting**: Cloudflare Workers KV or durable objects can store login attempt counters per IP/email.
3. **Transport security**: Cloudflare terminates TLS; avoid sending credentials over HTTP.
4. **CORS**: Pages Functions automatically share origin with the frontend; if exposing APIs elsewhere, configure CORS headers.
5. **Secrets**: Keep iteration counts and future JWT secrets in `wrangler.toml` `[vars]` or Cloudflare dashboard environment variables.

---

## 8. Extending the Model

* **Multi-project reuse**: Copy the `functions/api/auth` module, `authService` client wrapper, and `utils/crypto.js` into new repos. Only `schema.sql` and `wrangler.toml` need project-specific tweaks.
* **Admin tools**: Use `wrangler d1 execute <db>` to run ad-hoc SQL queries or build a minimal dashboard via another Pages Function.
* **Session hardening**: Introduce short-lived JWTs stored in `HttpOnly` cookies via Cloudflare Workers, or integrate Cloudflare Access for SSO.
* **Server-side saves**: Add `POST /api/save` and `GET /api/save` endpoints that write JSON to D1 or R2. Keep payload small (< 1 MB) to stay within edge limits.
* **Background jobs**: For cron-like tasks (e.g., nightly cleanup), use Cloudflare Workers with scheduled triggers hitting the same D1 database.

---

## 9. Deployment Checklist

1. `wrangler d1 create <db-name>` → record `database_id`.
2. Update `wrangler.toml` with new binding and environment variables.
3. Run `wrangler d1 execute <db-name> --file=schema.sql`.
4. `npm run build` (or `pnpm build`) to generate `dist/`.
5. `wrangler pages deploy --project-name=<project>` or set up GitHub integration for automatic deploys.
6. Verify `/api/auth/register` and `/api/auth/login` endpoints via `curl` or Thunder Client.
7. Smoke-test the frontend: login, refresh, ensure `localStorage` persists user and save data.

---

## 10. Conclusion

By combining Cloudflare Pages, Pages Functions, and D1, we achieve a fully serverless backend for authentication and lightweight data persistence. The pattern scales from hobby projects to mid-sized games or SaaS dashboards without managing servers. Reuse this document as a blueprint when bootstrapping new projects: copy the repo layout, adapt the schema, and customize the API routes as needed. Once the foundation is in place, you can layer on additional features such as leaderboards, payment webhooks, or analytics—all within the same Cloudflare environment. 


