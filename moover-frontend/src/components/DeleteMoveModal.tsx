'use client';

import { useState } from 'react';
import { Move } from '@/types/api';

interface DeleteMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  move: Move;
  isDeleting: boolean;
}

export default function DeleteMoveModal({
  isOpen,
  onClose,
  onConfirm,
  move,
  isDeleting
}: DeleteMoveModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const expectedText = 'ELIMINAR';

  if (!isOpen) return null;

  const canDelete = confirmText === expectedText && !isDeleting;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg 
                className="h-6 w-6 text-red-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isDeleting}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="mt-2 px-7 py-3">
            <h3 className="text-lg font-medium text-gray-900 text-center">
              ¿Estás seguro?
            </h3>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Esta acción no se puede deshacer. Se eliminará permanentemente la mudanza y todos sus datos asociados.
            </p>

            {/* Move details */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900">Mudanza a eliminar:</h4>
              <p className="text-sm text-gray-600 mt-1">
                <strong>ID:</strong> #{move.id}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Desde:</strong> {move.origin_address}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Hacia:</strong> {move.destination_address}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Estado:</strong> 
                <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  move.status === 'planning' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : move.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {move.status === 'planning' && 'Planificando'}
                  {move.status === 'in_progress' && 'En progreso'}
                  {move.status === 'completed' && 'Completada'}
                </span>
              </p>
            </div>

            {/* Warning for in-progress moves */}
            {move.status === 'in_progress' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      ⚠️ Mudanza en progreso
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Esta mudanza está marcada como &quot;en progreso&quot; y no puede ser eliminada por seguridad. 
                      Si necesitas eliminarla, primero cambia su estado a &quot;planificando&quot; o &quot;completada&quot;.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation input */}
            {move.status !== 'in_progress' && (
              <div className="mt-4">
                <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700">
                  Para confirmar, escribe <strong>ELIMINAR</strong> en el siguiente campo:
                </label>
                <input
                  type="text"
                  id="confirmText"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="ELIMINAR"
                  disabled={isDeleting}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="items-center px-4 py-3">
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              {move.status !== 'in_progress' && (
                <button
                  onClick={onConfirm}
                  disabled={!canDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar mudanza'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
