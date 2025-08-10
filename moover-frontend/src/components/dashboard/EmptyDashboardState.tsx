import Link from 'next/link';

export default function EmptyDashboardState() {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100">
      <div className="px-8 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#7C3AED]/20 to-[#3B82F6]/20 rounded-full flex items-center justify-center border border-[#7C3AED]/20">
          <span className="text-3xl">🏠</span>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent mb-3">
          ¡Comienza tu primera mudanza!
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
          No tienes ninguna mudanza activa. Crea una nueva mudanza para empezar 
          a organizar tu proceso de mudanza.
        </p>
        <Link
          href="/dashboard/moves/new"
          className="inline-flex items-center px-8 py-4 border-0 text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <span className="mr-2">✨</span>
          Crear nueva mudanza
        </Link>
      </div>
    </div>
  );
}
