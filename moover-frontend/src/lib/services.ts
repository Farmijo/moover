import api from '@/lib/api';
import { 
  AuthResponse, 
  User, 
  Move, 
  Room, 
  Task, 
  UserTask, 
  Category, 
  RoomType, 
  TaskSummary 
} from '@/types/api';

// Auth Service
export const authService = {
  async signup(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/signup', {
      user: { email, password }
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/profile');
    return response.data;
  }
};

// Move Service
export const moveService = {
  async getCurrentMove(): Promise<{ move: Move | null; message?: string }> {
    const response = await api.get('/moves/current');
    return response.data;
  },

  async getAllMoves(): Promise<{ moves: Move[]; meta: { total_count: number; active_moves: number } }> {
    const response = await api.get('/moves');
    return response.data;
  },

  async getMove(id: number): Promise<{ move: Move }> {
    const response = await api.get(`/moves/${id}`);
    return response.data;
  },

  async createMove(moveData: Partial<Move>): Promise<{ move: Move; message: string }> {
    const response = await api.post('/moves', { move: moveData });
    return response.data;
  },

  async updateMove(id: number, moveData: Partial<Move>): Promise<{ move: Move; message: string }> {
    const response = await api.put(`/moves/${id}`, { move: moveData });
    return response.data;
  },

  async deleteMove(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/moves/${id}`);
    return response.data;
  },

  async generateTasks(id: number): Promise<{ message: string; tasks_count: number }> {
    console.log('Making request to generate tasks for move ID:', id);
    console.log('Full URL will be:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/moves/${id}/generate_tasks`);
    const response = await api.post(`/moves/${id}/generate_tasks`);
    return response.data;
  }
};

// Room Service
export const roomService = {
  async getRooms(moveId: number): Promise<Room[]> {
    const response = await api.get(`/moves/${moveId}/rooms`);
    return response.data;
  },

  async getRoom(moveId: number, roomId: number): Promise<Room> {
    const response = await api.get(`/moves/${moveId}/rooms/${roomId}`);
    return response.data;
  },

  async createRoom(moveId: number, roomData: Partial<Room>): Promise<Room> {
    const response = await api.post(`/moves/${moveId}/rooms`, { room: roomData });
    return response.data;
  },

  async updateRoom(moveId: number, roomId: number, roomData: Partial<Room>): Promise<Room> {
    const response = await api.put(`/moves/${moveId}/rooms/${roomId}`, { room: roomData });
    return response.data;
  },

  async deleteRoom(moveId: number, roomId: number): Promise<void> {
    await api.delete(`/moves/${moveId}/rooms/${roomId}`);
  },

  async getRoomTypes(moveId: number): Promise<{ room_types: RoomType[] }> {
    const response = await api.get(`/moves/${moveId}/rooms/room_types`);
    return response.data;
  },

  async generateRoomTasks(moveId: number, roomId: number): Promise<{ message: string; tasks_count: number; room_id: number; room_name: string }> {
    const response = await api.post(`/moves/${moveId}/rooms/${roomId}/generate_tasks`);
    return response.data;
  }
};

// Task Service (Template tasks)
export const taskService = {
  async getTasks(params?: {
    category?: string;
    room_specific?: boolean;
    timing_before?: number;
    timing_after?: number;
  }): Promise<Task[]> {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  async getTask(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    const response = await api.get('/tasks/categories');
    return response.data;
  }
};

// User Task Service
export const userTaskService = {
  async getUserTasks(moveId: number, params?: {
    completed?: boolean;
    category?: string;
    room_id?: number;
    sort_by?: string;
  }): Promise<UserTask[]> {
    const response = await api.get(`/moves/${moveId}/user_tasks`, { params });
    return response.data;
  },

  async getUserTask(moveId: number, taskId: number): Promise<UserTask> {
    const response = await api.get(`/moves/${moveId}/user_tasks/${taskId}`);
    return response.data;
  },

  async updateUserTask(moveId: number, taskId: number, taskData: Partial<UserTask>): Promise<UserTask> {
    const response = await api.put(`/moves/${moveId}/user_tasks/${taskId}`, { user_task: taskData });
    return response.data;
  },

  async deleteUserTask(moveId: number, taskId: number): Promise<void> {
    await api.delete(`/moves/${moveId}/user_tasks/${taskId}`);
  },

  async completeTask(moveId: number, taskId: number): Promise<UserTask> {
    const response = await api.patch(`/moves/${moveId}/user_tasks/${taskId}/complete`);
    return response.data;
  },

  async uncompleteTask(moveId: number, taskId: number): Promise<UserTask> {
    const response = await api.patch(`/moves/${moveId}/user_tasks/${taskId}/uncomplete`);
    return response.data;
  },

  async getTaskSummary(moveId: number): Promise<TaskSummary> {
    const response = await api.get(`/moves/${moveId}/user_tasks/summary`);
    return response.data;
  }
};
