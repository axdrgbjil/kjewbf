// File: src/app/api/login/route.js
export async function POST(request) {
    const { username, password } = await request.json();
  
    // Simple user database
    const users = {
      user: {
        password: 'prohacker123',
        isAdmin: false
      }
    };
  
    if (!users[username] || users[username].password !== password) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401
      });
    }
  
    const sessionId = Math.random().toString(36).substring(7);
    global.sessions = global.sessions || {};
    global.sessions[sessionId] = { ...users[username] };
  
    return new Response(JSON.stringify({ sessionId }));
  }
  