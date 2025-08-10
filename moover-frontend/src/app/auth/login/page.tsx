'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-6 flex items-center justify-center bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full gap-y-8 space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-[#7C3AED]/20 to-[#3B82F6]/20 rounded-lg flex items-center justify-center mb-6 border border-[#7C3AED]/20 shadow-md">
            <span className="text-3xl">🏠</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent mb-3">
            Inicia sesión en Moover
          </h2>
          <p className="text-gray-600">
            O{' '}
            <Link 
              href="/auth/signup" 
              className="font-medium text-[#7C3AED] hover:text-[#3B82F6] transition-colors duration-200"
            >
              crea una cuenta nueva →
            </Link>
          </p>
        </div>
        
        <form className="mt-8 gap-y-6 space-y-6 bg-white rounded-lg shadow-md p-8 border border-gray-100" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-gradient-to-r from-[#F87171]/10 to-[#F87171]/5 border border-[#F87171]/30 text-gray-800 px-6 py-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-[#F87171] text-lg mr-3">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <div className="gap-y-6 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED] transition-all duration-200 text-gray-900"
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED] transition-all duration-200 text-gray-900"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-6 border-0 text-base font-semibold rounded-lg text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED]/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              {loading ? 'Iniciando sesión... ⏳' : 'Iniciar sesión ✨'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
