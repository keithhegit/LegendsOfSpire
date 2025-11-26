import { generateSalt, hashPassword } from '../../utils/crypto.js';

const toJson = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: { 'Content-Type': 'application/json' }
});

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { email, username, password } = body || {};

    if (!email || !username || !password) {
      return toJson({ error: 'Missing required fields' }, 400);
    }

    const check = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (check) {
      return toJson({ error: 'User already exists' }, 409);
    }

    const userId = crypto.randomUUID();
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    await env.DB.prepare(
      'INSERT INTO users (id, email, username, password_hash, salt) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, email, username, passwordHash, salt).run();

    return toJson({
      success: true,
      user: { id: userId, email, username }
    }, 201);
  } catch (error) {
    return toJson({ error: `Registration failed: ${error.message}` }, 500);
  }
}

