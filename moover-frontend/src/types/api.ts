// API Types for Moover App

export interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Move {
  id: number;
  user_id: number;
  origin_address: string;
  destination_address: string;
  move_type: 'apartment' | 'house' | 'office' | 'storage' | 'other';
  origin_key_delivery_date?: string;
  origin_move_out_date?: string;
  destination_key_delivery_date?: string;
  status: 'planning' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: number;
  move_id: number;
  name: string;
  room_type: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  category: string;
  category_display: string;
  timing: number;
  timing_display: string;
  is_room_specific: boolean;
  applicable_room_types: string[];
  created_at: string;
  updated_at: string;
}

export interface UserTask {
  id: number;
  move_id: number;
  task_id: number;
  room_id?: number;
  name: string;
  completed: boolean;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  task?: Task;
  room?: Room;
}

export interface Category {
  value: string;
  display: string;
}

export interface RoomType {
  value: string;
  display: string;
}

export interface TaskSummary {
  summary: {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    overdue_tasks: number;
    progress_percentage: number;
  };
  by_category: {
    [key: string]: {
      total: number;
      completed: number;
      pending: number;
      percentage: number;
    };
  };
}

export interface ApiError {
  error?: string;
  errors?: string[];
  message?: string;
}
