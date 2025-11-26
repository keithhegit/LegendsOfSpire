import { verifyPassword } from '../../utils/crypto.js';

const toJson = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: { 'Content-Type': 'application/json' }
});

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return toJson({ error: 'Email and password required' }, 400);
    }

    const user = await env.DB.prepare(
      'SELECT id, username, email, password_hash, salt FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      return toJson({ error: 'Account or password incorrect' }, 401);
    }

    const isValid = await verifyPassword(password, user.salt, user.password_hash);
    if (!isValid) {
      return toJson({ error: 'Account or password incorrect' }, 401);
    }

    return toJson({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }, 200);
  } catch (error) {
    return toJson({ error: `Login failed: ${error.message}` }, 500);
  }
}

