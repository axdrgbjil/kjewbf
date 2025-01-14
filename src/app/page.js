'use client';
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [preferences, setPreferences] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setSessionId(data.sessionId);
        setStatus('Logged in successfully');
        setError('');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Failed to login');
    }
  };

  const updatePreferences = async () => {
    try {
      let prefsObj = {};
      try {
        prefsObj = JSON.parse(preferences);
      } catch {
        setError('Invalid JSON format');
        return;
      }

      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        body: JSON.stringify(prefsObj),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('Preferences updated');
        setError('');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Failed to update preferences');
    }
  };

  const getFlag = async () => {
    try {
      const res = await fetch('/api/flag', {
        headers: {
          'X-Session-Id': sessionId,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setFlag(data.flag);
        setError('');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Failed to get flag');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        

        {error && (
          <div className="mb-4 p-3 bg-red-800 text-red-400 rounded">
            {error}
          </div>
        )}

        {status && !error && (
          <div className="mb-4 p-3 bg-green-800 text-green-400 rounded">
            {status}
          </div>
        )}

        {!sessionId ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Login
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">User Preferences (JSON)</label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 h-32 font-mono text-sm"
                placeholder="Enter preferences in JSON format..."
              />
            </div>
            <div className="space-x-2">
              <button
                onClick={updatePreferences}
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Update Preferences
              </button>
              <button
                onClick={getFlag}
                className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500"
              >
                Get Flag
              </button>
            </div>

            {flag && (
              <div className="mt-4 p-4 bg-black text-green-400 font-mono rounded">
                {flag}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-sm text-gray-400">
          <p>Hint: Sometimes the properties you set might affect more than you think...</p>
        </div>
      </div>
    </main>
  );
}
