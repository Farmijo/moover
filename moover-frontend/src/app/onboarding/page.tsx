'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { moveService, roomService } from '@/lib/services';

interface MoveFormData {
  origin_address: string;
  destination_address: string;
  origin_key_delivery_date: string;
  origin_move_out_date: string;
  destination_key_delivery_date: string;
}

interface RoomData {
  name: string;
  room_type: string;
  description: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // Start with info page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateWarning, setDateWarning] = useState('');
  
  // Animation states
  const [showHeader, setShowHeader] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showButton, setShowButton] = useState(false);
  
  // Move form data
  const [moveData, setMoveData] = useState<MoveFormData>({
    origin_address: '',
    destination_address: '',
    origin_key_delivery_date: '',
    origin_move_out_date: '',
    destination_key_delivery_date: ''
  });
  
  // Rooms data
  const [rooms, setRooms] = useState<RoomData[]>([]);
  
  const roomTypes = [
    'living_room',
    'dining_room', 
    'kitchen',
    'bedroom',
    'bathroom',
    'office',
    'garage',
    'storage',
    'other'
  ];

  const getRoomTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      living_room: 'Sala de estar',
      dining_room: 'Comedor',
      kitchen: 'Cocina',
      bedroom: 'Dormitorio',
      bathroom: 'Baño',
      office: 'Oficina',
      garage: 'Garaje',
      storage: 'Trastero',
      other: 'Otro'
    };
    return labels[type] || type;
  };

  // Animation sequence for step 0
  useEffect(() => {
    if (currentStep === 0) {
      // Reset all animations
      setShowHeader(false);
      setShowCards(false);
      setShowSteps(false);
      setShowButton(false);

      // Start animation sequence
      const timer1 = setTimeout(() => setShowHeader(true), 200);
      const timer2 = setTimeout(() => setShowCards(true), 800);
      const timer3 = setTimeout(() => setShowSteps(true), 1400);
      const timer4 = setTimeout(() => setShowButton(true), 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [currentStep]);

  // Validate dates whenever moveData changes
  useEffect(() => {
    const validateDates = () => {
      const { origin_key_delivery_date, origin_move_out_date, destination_key_delivery_date } = moveData;
      
      // Convert dates to Date objects for comparison (only if they exist)
      const keyDeliveryDate = origin_key_delivery_date ? new Date(origin_key_delivery_date) : null;
      const moveOutDate = origin_move_out_date ? new Date(origin_move_out_date) : null;
      const destKeyDate = destination_key_delivery_date ? new Date(destination_key_delivery_date) : null;

      // Check if origin key delivery is after move out date
      if (keyDeliveryDate && moveOutDate && keyDeliveryDate > moveOutDate) {
        return 'La fecha de entrega de llaves de origen no puede ser posterior a la fecha de mudanza';
      }

      // Check if destination key delivery is before move out date
      if (destKeyDate && moveOutDate && destKeyDate < moveOutDate) {
        return 'La fecha de entrega de llaves de destino no puede ser anterior a la fecha de mudanza';
      }

      return null; // No validation errors
    };

    const warning = validateDates();
    setDateWarning(warning || '');
  }, [moveData]);

  const validateDatesForSubmit = () => {
    const { origin_key_delivery_date, origin_move_out_date, destination_key_delivery_date } = moveData;
    
    // Convert dates to Date objects for comparison (only if they exist)
    const keyDeliveryDate = origin_key_delivery_date ? new Date(origin_key_delivery_date) : null;
    const moveOutDate = origin_move_out_date ? new Date(origin_move_out_date) : null;
    const destKeyDate = destination_key_delivery_date ? new Date(destination_key_delivery_date) : null;

    // Check if origin key delivery is after move out date
    if (keyDeliveryDate && moveOutDate && keyDeliveryDate < moveOutDate) {
      return 'La fecha de entrega de llaves de origen no puede ser posterior a la fecha de mudanza';
    }

    // Check if destination key delivery is before move out date
    if (destKeyDate && moveOutDate && destKeyDate > moveOutDate) {
      return 'La fecha de entrega de llaves de destino no puede ser posterior a la fecha de mudanza';
    }

    return null; // No validation errors
  };

  const handleMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic required fields validation
    if (!moveData.origin_address || !moveData.destination_address) {
      setError('Por favor, completa las direcciones de origen y destino');
      return;
    }

    // Date validation
    const dateValidationError = validateDatesForSubmit();
    if (dateValidationError) {
      setError(dateValidationError);
      return;
    }

    setError(''); // Clear any previous errors
    setCurrentStep(2);
  };

  const addRoom = () => {
    setRooms([...rooms, { name: '', room_type: 'living_room', description: '' }]);
  };

  const updateRoom = (index: number, field: keyof RoomData, value: string) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  // Loading state messages
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    setError('');

    try {
      // Create the move
      setLoadingMessage('Creando tu mudanza...');
      const moveResponse = await moveService.createMove(moveData);
      const newMove = moveResponse.move;

      // Create rooms if any
      if (rooms.length > 0) {
        setLoadingMessage('Añadiendo habitaciones...');
        for (const roomData of rooms) {
          if (roomData.name.trim()) {
            await roomService.createRoom(newMove.id, {
              ...roomData,
              room_type: roomData.room_type
            });
          }
        }
      }

      // Generate tasks for the new move
      setLoadingMessage('Generando tareas personalizadas...');
      await moveService.generateTasks(newMove.id);

      setLoadingMessage('¡Configuración completada! Redirigiendo...');
      
      // Small delay to show completion message
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la mudanza';
      setError(errorMessage);
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a Moover! 🏠
          </h1>
          <p className="text-lg text-gray-600">
            Vamos a configurar tu primera mudanza
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {dateWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-lg">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-yellow-800 text-sm">{dateWarning}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 0: Information */}
        {currentStep === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Animated header */}
            <div className={`text-center mb-8 transition-all duration-1000 ${
              showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}>
              <div className={`mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                showHeader ? 'scale-100 rotate-0' : 'scale-50 rotate-180'
              }`}>
                <span className="text-2xl">📋</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Planifica tu mudanza con éxito
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Una mudanza exitosa requiere planificación. Te ayudaremos a organizarlo todo paso a paso.
              </p>
            </div>

            {/* Animated cards grid */}
            <div className={`grid md:grid-cols-2 gap-6 mb-8 transition-all duration-1000 ${
              showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {/* Left column - Key info */}
              <div className="space-y-6">
                <div className={`bg-blue-50 rounded-lg p-6 transition-all duration-700 delay-100 ${
                  showCards ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-8 scale-95'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-2xl animate-bounce">⏰</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Planificación mínima: 1 mes
                      </h3>
                      <p className="text-blue-800 text-sm">
                        Una mudanza requiere al menos un mes de preparación para asegurar que todo salga bien. 
                        Desde contratar servicios hasta organizar documentos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`bg-green-50 rounded-lg p-6 transition-all duration-700 delay-300 ${
                  showCards ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-8 scale-95'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-2xl animate-pulse">✅</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-green-900 mb-2">
                        Tareas para todos
                      </h3>
                      <p className="text-green-800 text-sm">
                        Hay tareas genéricas que todos necesitan hacer: cambio de domicilio, 
                        contratar servicios, empacar elementos comunes...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Customization */}
              <div className="space-y-6">
                <div className={`bg-purple-50 rounded-lg p-6 transition-all duration-700 delay-200 ${
                  showCards ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-2xl animate-bounce">🏠</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">
                        Personalización por habitaciones
                      </h3>
                      <p className="text-purple-800 text-sm">
                        Según las habitaciones de tu casa actual, generaremos tareas específicas: 
                        cocina, dormitorios, oficina, garaje...
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`bg-yellow-50 rounded-lg p-6 transition-all duration-700 delay-400 ${
                  showCards ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-2xl animate-pulse">📅</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                        Timeline visual
                      </h3>
                      <p className="text-yellow-800 text-sm">
                        Organizaremos todas las tareas en un timeline semanal desde hoy 
                        hasta el día de tu mudanza.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What we'll do - Animated steps */}
            <div className={`border-t pt-6 transition-all duration-1000 ${
              showSteps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Lo que haremos en los siguientes pasos:
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className={`p-4 transition-all duration-700 delay-100 ${
                  showSteps ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
                }`}>
                  <div className={`bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 transition-all duration-500 ${
                    showSteps ? 'animate-bounce' : ''
                  }`}>
                    <span className="text-indigo-600 font-semibold">1</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Información básica</h4>
                  <p className="text-sm text-gray-600">Direcciones y fechas importantes</p>
                </div>
                <div className={`p-4 transition-all duration-700 delay-300 ${
                  showSteps ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
                }`}>
                  <div className={`bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 transition-all duration-500 delay-200 ${
                    showSteps ? 'animate-bounce' : ''
                  }`}>
                    <span className="text-indigo-600 font-semibold">2</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Tus habitaciones</h4>
                  <p className="text-sm text-gray-600">Configurar espacios para tareas específicas</p>
                </div>
                <div className={`p-4 transition-all duration-700 delay-500 ${
                  showSteps ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
                }`}>
                  <div className={`bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 transition-all duration-500 delay-400 ${
                    showSteps ? 'animate-bounce' : ''
                  }`}>
                    <span className="text-indigo-600 font-semibold">3</span>
                  </div>
                  <h4 className="font-medium text-gray-900">¡Listo!</h4>
                  <p className="text-sm text-gray-600">Tu plan de mudanza personalizado</p>
                </div>
              </div>
            </div>

            {/* Animated button */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium mt-8 transition-all duration-1000 transform hover:scale-105 ${
                showButton ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              Comenzar configuración
            </button>
          </div>
        )}

        {/* Step 1: Move Details */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Información de tu mudanza
            </h2>
            
            <form onSubmit={handleMoveSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de origen *
                </label>
                <input
                  type="text"
                  required
                  value={moveData.origin_address}
                  onChange={(e) => setMoveData({...moveData, origin_address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ej: Calle Principal 123, Madrid"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de destino *
                </label>
                <input
                  type="text"
                  required
                  value={moveData.destination_address}
                  onChange={(e) => setMoveData({...moveData, destination_address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ej: Avenida Central 456, Barcelona"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entrega llaves destino
                    <span className="block text-xs text-gray-500">Cuándo te dan tus nuevas llaves</span>
                  </label>
                  <input
                    type="date"
                    value={moveData.destination_key_delivery_date}
                    onChange={(e) => setMoveData({...moveData, destination_key_delivery_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de mudanza *
                    <span className="block text-xs text-gray-500">Día del traslado</span>
                  </label>
                  <input
                    type="date"
                    value={moveData.origin_move_out_date}
                    onChange={(e) => setMoveData({...moveData, origin_move_out_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Devolución llaves origen
                    <span className="block text-xs text-gray-500">Devolución de tus actuales llaves</span>
                  </label>
                  <input
                    type="date"
                    value={moveData.origin_key_delivery_date}
                    onChange={(e) => setMoveData({...moveData, origin_key_delivery_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

              </div>

              {/* Date help info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-blue-400 text-lg">💡</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-blue-800 text-xs">
                      <strong>Orden lógico:</strong> Primero recibes las llaves de destino → después haces la mudanza → finalmente entregas las llaves de origen.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium"
              >
                Continuar
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Rooms */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Añade las habitaciones de tu hogar
            </h2>
            <p className="text-gray-600 mb-6">
              Esto nos ayudará a generar tareas específicas para cada espacio
            </p>

            <div className="space-y-4 mb-6">
              {rooms.map((room, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={room.name}
                        onChange={(e) => updateRoom(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej: Dormitorio principal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <select
                        value={room.room_type}
                        onChange={(e) => updateRoom(index, 'room_type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {roomTypes.map(type => (
                          <option key={type} value={type}>
                            {getRoomTypeLabel(type)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeRoom(index)}
                        className="w-full bg-red-100 text-red-700 py-2 px-3 rounded-md hover:bg-red-200 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción (opcional)
                    </label>
                    <input
                      type="text"
                      value={room.description}
                      onChange={(e) => updateRoom(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ej: Habitación grande con balcón"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRoom}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 mb-6"
            >
              + Añadir habitación
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={handleCompleteOnboarding}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium disabled:opacity-50"
              >
                {loading ? loadingMessage || 'Procesando...' : 'Completar configuración'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
