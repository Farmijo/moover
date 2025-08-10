import Link from 'next/link';

export default function EmptyMoveState() {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-medium text-gray-900">Mudanza no encontrada</h3>
      <p className="mt-1 text-sm text-gray-500">
        No se pudo cargar la información de esta mudanza.
      </p>
      <div className="mt-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
