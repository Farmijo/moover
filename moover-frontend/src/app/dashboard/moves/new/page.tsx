'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { moveService } from '@/lib/services';
import { Move } from '@/types/api';

export default function NewMovePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    origin_address: '',
    destination_address: '',
    move_type: 'apartment' as Move['move_type'],
    origin_key_delivery_date: '',
    origin_move_out_date: '',
    destination_key_delivery_date: '',
    status: 'planning' as Move['status']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await moveService.createMove(formData);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: string[] } } };
      const errorMessage = error.response?.data?.errors?.[0] || 'Error al crear la mudanza';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Nueva Mudanza
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Completa los datos básicos de tu mudanza para empezar a organizarla
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Direcciones */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="origin_address" className="block text-sm font-medium text-gray-700">
                Dirección de origen *
              </label>
              <input
                type="text"
                name="origin_address"
                id="origin_address"
                required
                value={formData.origin_address}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Calle, número, ciudad"
              />
            </div>

            <div>
              <label htmlFor="destination_address" className="block text-sm font-medium text-gray-700">
                Dirección de destino *
              </label>
              <input
                type="text"
                name="destination_address"
                id="destination_address"
                required
                value={formData.destination_address}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Calle, número, ciudad"
              />
            </div>
          </div>

          {/* Tipo de mudanza */}
          <div>
            <label htmlFor="move_type" className="block text-sm font-medium text-gray-700">
              Tipo de mudanza
            </label>
            <select
              name="move_type"
              id="move_type"
              value={formData.move_type}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="apartment">Piso/Apartamento</option>
              <option value="house">Casa</option>
              <option value="office">Oficina</option>
              <option value="storage">Trastero</option>
              <option value="other">Otro</option>
            </select>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="destination_key_delivery_date" className="block text-sm font-medium text-gray-700">
                Entrega de llaves destino
              </label>
              <input
                type="date"
                name="destination_key_delivery_date"
                id="destination_key_delivery_date"
                value={formData.destination_key_delivery_date}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="origin_move_out_date" className="block text-sm font-medium text-gray-700">
                Fecha de salida origen
              </label>
              <input
                type="date"
                name="origin_move_out_date"
                id="origin_move_out_date"
                value={formData.origin_move_out_date}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="origin_key_delivery_date" className="block text-sm font-medium text-gray-700">
                Entrega de llaves origen
              </label>
              <input
                type="date"
                name="origin_key_delivery_date"
                id="origin_key_delivery_date"
                value={formData.origin_key_delivery_date}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear mudanza'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
