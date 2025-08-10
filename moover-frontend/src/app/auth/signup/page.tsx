'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: string[] } } };
      const errorMessage = error.response?.data?.errors?.[0] || 'Error al crear la cuenta';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-[#7C3AED]/20 to-[#3B82F6]/20 rounded-xl flex items-center justify-center mb-6 border border-[#7C3AED]/20">
            <span className="text-3xl">🏠</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent mb-3">
            Crear cuenta en Moover
          </h2>
          <p className="text-gray-600">
            O{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-[#7C3AED] hover:text-[#3B82F6] transition-colors duration-200"
            >
              inicia sesión si ya tienes cuenta →
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white rounded-xl shadow-xl p-8 border border-gray-100" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-gradient-to-r from-[#F87171]/10 to-[#F87171]/5 border border-[#F87171]/30 text-gray-800 px-6 py-4 rounded-xl">
              <div className="flex items-center">
                <span className="text-[#F87171] text-lg mr-3">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED] transition-all duration-200 text-gray-900"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED] transition-all duration-200 text-gray-900"
                placeholder="Contraseña (mínimo 6 caracteres)"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED] transition-all duration-200 text-gray-900"
                placeholder="Confirmar contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-6 border-0 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED]/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              {loading ? 'Creando cuenta... ⏳' : 'Crear cuenta ✨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
