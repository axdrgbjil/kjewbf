// File: src/app/api/login/route.js
export async function POST(request) {
  const { username, password } = await request.json();

  const users = {
    user: {
      password: 'prohacker123'
    }
  };

  if (!users[username] || users[username].password !== password) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401
    });
  }

  const sessionId = Math.random().toString(36).substring(7);
  global.sessions = global.sessions || {};
  
  // Create a regular object with standard prototype
  global.sessions[sessionId] = Object.create({}, {
      username: { value: username, enumerable: true },
      preferences: { value: {}, enumerable: true, writable: true }
  });

  return new Response(JSON.stringify({ sessionId }));
}
