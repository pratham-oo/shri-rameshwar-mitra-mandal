'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple credential check
    // In production, you'd want to hash this or use environment variables
    const validUsername = 'rameshwar mitra mandal';
    const validPassword = 'maladcha morya';

    if (username.toLowerCase() === validUsername && password === validPassword) {
      // Set a session cookie/token
      document.cookie = 'admin_auth=true; path=/; max-age=86400'; // 24 hours
      router.push('/admin');
    } else {
      setError('❌ चुकीचे युझरनेम किंवा पासवर्ड');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-8 text-center">
            <div className="text-5xl mb-3">🔐</div>
            <h1 className="text-2xl font-bold text-white marathi-text mb-2">
              प्रशासन लॉगिन
            </h1>
            <p className="text-orange-100 text-sm">
              कृपया लॉगिन करा
            </p>
          </div>

          {/* Login Form */}
          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  युझरनेम
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="rameshwar mitra mandal"
                  disabled={loading}
                  autoComplete="off"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  पासवर्ड
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'लॉगिन होत आहे...' : 'लॉगिन करा 🚪'}
              </button>
            </form>

            {/* Info Message */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                हे पेज फक्त अधिकृत व्यक्तींसाठी आहे
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}