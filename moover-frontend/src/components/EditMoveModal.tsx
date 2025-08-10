'use client';

import { useState, useEffect } from 'react';
import { Move } from '@/types/api';

interface EditMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (moveData: Partial<Move>) => void;
  move: Move;
  isUpdating: boolean;
}

export default function EditMoveModal({
  isOpen,
  onClose,
  onSave,
  move,
  isUpdating
}: EditMoveModalProps) {
  const [formData, setFormData] = useState({
    origin_address: '',
    destination_address: '',
    move_type: 'apartment' as 'apartment' | 'house' | 'office' | 'storage' | 'other',
    origin_key_delivery_date: '',
    origin_move_out_date: '',
    destination_key_delivery_date: '',
    status: 'planning' as 'planning' | 'in_progress' | 'completed'
  });

  const [errors, setErrors] = useState<string[]>([]);

  // Actualizar el formulario cuando cambie la mudanza
  useEffect(() => {
    if (move) {
      setFormData({
        origin_address: move.origin_address || '',
        destination_address: move.destination_address || '',
        move_type: move.move_type as 'apartment' | 'house' | 'office' | 'storage' | 'other' || 'apartment',
        origin_key_delivery_date: move.origin_key_delivery_date || '',
        origin_move_out_date: move.origin_move_out_date || '',
        destination_key_delivery_date: move.destination_key_delivery_date || '',
        status: move.status as 'planning' | 'in_progress' | 'completed' || 'planning'
      });
    }
  }, [move]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validaciones básicas
    const newErrors: string[] = [];
    
    if (!formData.origin_address.trim()) {
      newErrors.push('La dirección de origen es requerida');
    }
    
    if (!formData.destination_address.trim()) {
      newErrors.push('La dirección de destino es requerida');
    }

    // Validar fechas
    const today = new Date().toISOString().split('T')[0];
    
    if (formData.origin_move_out_date && formData.origin_move_out_date < today) {
      newErrors.push('La fecha de salida no puede ser en el pasado');
    }
    
    if (formData.origin_key_delivery_date && formData.origin_key_delivery_date < today) {
      newErrors.push('La fecha de entrega de llaves del origen no puede ser en el pasado');
    }
    
    if (formData.destination_key_delivery_date && formData.destination_key_delivery_date < today) {
      newErrors.push('La fecha de entrega de llaves del destino no puede ser en el pasado');
    }

    // Validar orden de fechas
    if (formData.origin_key_delivery_date && formData.origin_move_out_date && 
        formData.origin_move_out_date > formData.origin_key_delivery_date) {
      newErrors.push('La fecha de salida no puede ser posterior a la entrega de llaves del origen');
    }

    if (formData.destination_key_delivery_date && formData.origin_move_out_date &&
        formData.destination_key_delivery_date > formData.origin_move_out_date) {
      newErrors.push('La entrega de llaves del destino debe ser anterior a la fecha de salida');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Editar Mudanza #{move.id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isUpdating}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Errores */}
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Por favor corrige los siguientes errores:
                  </h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Dirección de origen */}
              <div className="sm:col-span-2">
                <label htmlFor="origin_address" className="block text-sm font-medium text-gray-700">
                  Dirección de origen *
                </label>
                <input
                  type="text"
                  id="origin_address"
                  name="origin_address"
                  value={formData.origin_address}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ej: Calle Principal 123, Madrid"
                  disabled={isUpdating}
                />
              </div>

              {/* Dirección de destino */}
              <div className="sm:col-span-2">
                <label htmlFor="destination_address" className="block text-sm font-medium text-gray-700">
                  Dirección de destino *
                </label>
                <input
                  type="text"
                  id="destination_address"
                  name="destination_address"
                  value={formData.destination_address}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ej: Avenida Secundaria 456, Barcelona"
                  disabled={isUpdating}
                />
              </div>

              {/* Tipo de mudanza */}
              <div>
                <label htmlFor="move_type" className="block text-sm font-medium text-gray-700">
                  Tipo de mudanza
                </label>
                <select
                  id="move_type"
                  name="move_type"
                  value={formData.move_type}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isUpdating}
                >
                  <option value="apartment">Piso/Apartamento</option>
                  <option value="house">Casa</option>
                  <option value="office">Oficina</option>
                  <option value="storage">Trastero</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              {/* Estado */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isUpdating}
                >
                  <option value="planning">Planificando</option>
                  <option value="in_progress">En progreso</option>
                  <option value="completed">Completada</option>
                </select>
              </div>

              {/* Fecha de entrega de llaves origen */}
              <div>
                <label htmlFor="origin_key_delivery_date" className="block text-sm font-medium text-gray-700">
                  Entrega llaves origen
                </label>
                <input
                  type="date"
                  id="origin_key_delivery_date"
                  name="origin_key_delivery_date"
                  value={formData.origin_key_delivery_date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isUpdating}
                />
              </div>

              {/* Fecha de salida */}
              <div>
                <label htmlFor="origin_move_out_date" className="block text-sm font-medium text-gray-700">
                  Fecha de salida
                </label>
                <input
                  type="date"
                  id="origin_move_out_date"
                  name="origin_move_out_date"
                  value={formData.origin_move_out_date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isUpdating}
                />
              </div>

              {/* Fecha de entrega de llaves destino */}
              <div className="sm:col-span-2">
                <label htmlFor="destination_key_delivery_date" className="block text-sm font-medium text-gray-700">
                  Entrega llaves destino
                </label>
                <input
                  type="date"
                  id="destination_key_delivery_date"
                  name="destination_key_delivery_date"
                  value={formData.destination_key_delivery_date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isUpdating}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                disabled={isUpdating}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
