// File: src/app/api/preferences/route.js
export async function POST(request) {
    const sessionId = request.headers.get('x-session-id');
    if (!sessionId || !global.sessions?.[sessionId]) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      });
    }
  
    const prefs = await request.json();
    
    // Vulnerable merge function
    const merge = (target, source) => {
      for (let key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
          if (!target[key]) target[key] = {};
          merge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };
  
    // Merge preferences into session (vulnerable to prototype pollution)
    merge(global.sessions[sessionId], prefs);
  
    return new Response(JSON.stringify({ message: 'Preferences updated' }));
  }
  