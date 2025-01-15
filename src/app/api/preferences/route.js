// File: src/app/api/preferences/route.js
export async function POST(request) {
  const sessionId = request.headers.get('x-session-id');
  if (!sessionId || !global.sessions?.[sessionId]) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401
    });
  }

  let prefs;
  try {
      prefs = await request.json();
  } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { 
          status: 400 
      });
  }

  // Simple function to check for direct isAdmin assignment
  const hasDirectAdmin = (obj) => {
      return Object.keys(obj).some(key => 
          key === 'isAdmin' || 
          (obj[key] && typeof obj[key] === 'object' && key !== '__proto__' && hasDirectAdmin(obj[key]))
      );
  };

  // Block direct isAdmin assignment
  if (hasDirectAdmin(prefs)) {
      return new Response(JSON.stringify({ 
          error: 'Not Allowed' 
      }), { 
          status: 400 
      });
  }
  
  // Vulnerable recursive merge function
  const merge = (target, source) => {
      for (const key in source) {
          if (typeof source[key] === 'object' && source[key] !== null) {
              if (!target[key]) {
                  target[key] = {};
              }
              merge(target[key], source[key]);
          } else {
              target[key] = source[key];
          }
      }
      return target;
  };

  // Merge into user's session
  merge(global.sessions[sessionId], prefs);

  return new Response(JSON.stringify({ 
      message: 'Preferences updated'
  }));
}
