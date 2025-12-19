const toJson = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: { 'Content-Type': 'application/json' }
});

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return toJson({ error: 'userId required' }, 400);
    }

    const row = await env.DB.prepare('SELECT achievements, modes FROM saves WHERE user_id = ?')
      .bind(userId)
      .first();

    const achievements = row?.achievements ? JSON.parse(row.achievements) : null;
    const modes = row?.modes ? JSON.parse(row.modes) : [];

    return toJson({
      success: true,
      achievements,
      modes,
      updatedAt: row?.updated_at ?? null
    });
  } catch (error) {
    return toJson({ error: `Failed to load achievements: ${error.message}` }, 500);
  }
}

