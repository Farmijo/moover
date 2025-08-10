import Link from 'next/link';

export default function EmptyDashboardState() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">🏠</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Comienza tu primera mudanza!
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          No tienes ninguna mudanza activa. Crea una nueva mudanza para empezar 
          a organizar tu proceso de mudanza.
        </p>
        <Link
          href="/dashboard/moves/new"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <span className="mr-2">+</span>
          Crear nueva mudanza
        </Link>
      </div>
    </div>
  );
}
