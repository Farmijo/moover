'use client';

import Link from 'next/link';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-6 border border-purple-200 shadow-sm">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Política de Privacidad de Moover
          </h1>
          <p className="text-lg text-gray-600 font-medium">(versión prototipo)</p>
          <p className="text-sm text-gray-500 mt-2">Última actualización: agosto 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="mb-10">
              <p className="text-lg text-gray-700 leading-relaxed">
                En <span className="font-semibold text-purple-600">Moover</span> respetamos tu privacidad. 
                Esta aplicación solo recoge y almacena tu dirección de correo electrónico con la única 
                finalidad de permitirte acceder a tu cuenta y guardar tu progreso en la planificación de mudanzas.
              </p>
            </div>

            {/* ¿Qué datos recogemos? */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">¿Qué datos recogemos?</h2>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <p className="text-gray-700">Tu dirección de correo electrónico al registrarte</p>
              </div>
            </section>

            {/* ¿Para qué usamos tus datos? */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">¿Para qué usamos tus datos?</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                  <p className="text-gray-700 font-medium mb-2">Para identificarte como usuario y guardar tu configuración</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>No los utilizamos para fines comerciales</li>
                    <li>No los compartimos con terceros</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ¿Dónde se almacenan? */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🔐</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">¿Dónde se almacenan?</h2>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <p className="text-gray-700">En un servidor seguro gestionado por <span className="font-semibold">Render.com</span></p>
              </div>
            </section>

            {/* ¿Cuánto tiempo los conservamos? */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">⏰</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">¿Cuánto tiempo los conservamos?</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                  <p className="text-gray-700 font-medium mb-2">Mientras mantengas tu cuenta activa</p>
                  <p className="text-gray-600">Puedes solicitar la eliminación de tus datos en cualquier momento</p>
                </div>
              </div>
            </section>

            {/* ¿Cómo puedes ejercer tus derechos? */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">✉️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">¿Cómo puedes ejercer tus derechos?</h2>
              </div>
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                <p className="text-gray-700 mb-3">
                  Si deseas eliminar tu cuenta o solicitar información sobre tus datos, puedes contactarnos a:
                </p>
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-red-200">
                  <span className="text-lg">📧</span>
                  <a 
                    href="mailto:farmijo16@gmail.com" 
                    className="font-semibold text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    farmijo16@gmail.com
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <Link 
            href="/auth/signup" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <span>←</span>
            Volver al registro
          </Link>
        </div>
      </div>
    </div>
  );
}
