// File: src/app/api/flag/route.js
export async function GET(request) {
  const sessionId = request.headers.get('x-session-id');
  if (!sessionId || !global.sessions?.[sessionId]) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401
    });
  }

  // This will check the prototype chain for isAdmin
  if (!global.sessions[sessionId].isAdmin) {
    return new Response(JSON.stringify({ error: 'Access denied. Admin required.' }), {
      status: 403
    });
  }

  return new Response(JSON.stringify({ 
    flag: 'flag{Pr0t0typ3_P0llut10n_M4st3r}'
  }));
}
