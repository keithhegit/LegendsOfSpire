const toJson = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: { 'Content-Type': 'application/json' }
});

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { userId, achievements, modes } = body || {};

    if (!userId) {
      return toJson({ error: 'userId required' }, 400);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const achievementsJson = achievements ? JSON.stringify(achievements) : null;
    const modesJson = modes ? JSON.stringify(modes) : null;

    await env.DB.prepare(`
      INSERT INTO saves (user_id, achievements, modes, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET achievements = excluded.achievements,
        modes = excluded.modes,
        updated_at = excluded.updated_at
    `)
      .bind(userId, achievementsJson, modesJson, timestamp)
      .run();

    return toJson({ success: true });
  } catch (error) {
    return toJson({ error: `Failed to persist achievements: ${error.message}` }, 500);
  }
}

