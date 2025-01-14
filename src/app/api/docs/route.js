// File: src/app/api/docs/route.js
export async function GET() {
    return new Response(JSON.stringify({
      documentation: {
        title: "User Preferences API",
        description: "Internal documentation for preference management system",
        version: "1.0.0-beta",
        endpoints: {
          "/api/preferences": {
            method: "POST",
            description: "Updates user preferences using our custom deepMerge function",
            code_snippet: `
              function merge(target, source) {
                for (let key in source) {
                  if (typeof source[key] === 'object') {
                    if (!target[key]) target[key] = {};
                    merge(target[key], source[key]);
                  } else {
                    target[key] = source[key];
                  }
                }
                return target;
              }
            `,
            example_request: {
              theme: "dark",
              notifications: {
                email: true,
                push: false
              }
            }
          }
        },
      }
    }));
  }