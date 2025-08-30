'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const [error, setError] = useState('');
  const [isPrivateBetaError, setIsPrivateBetaError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsPrivateBetaError(false);
    
    if (!acceptPrivacyPolicy) {
      setError('Debes aceptar la política de privacidad para continuar');
      return;
    }
    
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
      const error = err as { response?: { status?: number; data?: { error?: string; errors?: string[] } } };
      
      // Manejar específicamente el error de beta privada
      if (error.response?.status === 403) {
        setIsPrivateBetaError(true);
        setError(error.response.data?.error || 'Acceso restringido a beta privada');
      } else {
        const errorMessage = error.response?.data?.errors?.[0] || 
                           error.response?.data?.error || 
                           'Error al crear la cuenta';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-6 border border-purple-200">
            <span className="text-3xl">🏠</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Crear cuenta en Moover
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <span className="text-blue-500 text-lg mr-2">🔒</span>
              <div>
                <p className="text-sm font-medium text-blue-800">Beta Privada</p>
                <p className="text-xs text-blue-700">Solo usuarios con invitación pueden registrarse</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            O{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-purple-600 hover:text-blue-600 transition-colors duration-200"
            >
              inicia sesión si ya tienes cuenta →
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white rounded-xl shadow-xl p-8 border border-gray-100" onSubmit={handleSubmit}>
          {error && (
            <div className={`px-6 py-4 rounded-xl ${
              isPrivateBetaError 
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200' 
                : 'bg-gradient-to-r from-red-50 to-red-50 border border-red-200'
            }`}>
              <div className="flex items-start">
                <span className={`text-lg mr-3 mt-0.5 ${
                  isPrivateBetaError ? 'text-blue-500' : 'text-red-500'
                }`}>
                  {isPrivateBetaError ? '🔒' : '⚠️'}
                </span>
                <div className="flex-1">
                  <p className={`font-medium ${
                    isPrivateBetaError ? 'text-blue-800' : 'text-red-800'
                  }`}>
                    {isPrivateBetaError ? 'Beta Privada' : 'Error'}
                  </p>
                  <p className={`text-sm mt-1 ${
                    isPrivateBetaError ? 'text-blue-700' : 'text-red-700'
                  }`}>
                    {isPrivateBetaError 
                      ? 'Moover está actualmente en beta privada. Solo usuarios con invitación pueden registrarse. Si crees que deberías tener acceso, contacta al administrador.'
                      : error
                    }
                  </p>
                </div>
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-600 transition-all duration-200 text-gray-900"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-600 transition-all duration-200 text-gray-900"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-600 transition-all duration-200 text-gray-900"
                placeholder="Confirmar contraseña"
              />
            </div>
          </div>

          {/* Privacy Policy Checkbox */}
          <div className="flex items-start gap-3">
            <input
              id="acceptPrivacyPolicy"
              name="acceptPrivacyPolicy"
              type="checkbox"
              required
              checked={acceptPrivacyPolicy}
              onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-300 border-gray-300 rounded"
            />
            <label htmlFor="acceptPrivacyPolicy" className="text-sm text-gray-700">
              Al registrarte, aceptas nuestra{' '}
              <Link 
                href="/privacidad" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-purple-600 hover:text-blue-600 underline transition-colors duration-200"
              >
                Política de Privacidad
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-6 border-0 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              {loading ? 'Creando cuenta... ⏳' : 'Crear cuenta ✨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
