// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
}

// ─── Entity Types ─────────────────────────────────────────────────────────────

export interface CategoryEvent {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    events: number;
  };
}

export interface Speaker {
  id: string;
  name: string;
  expertise: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    events: number;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  categoryId: string;
  speakerId: string;
  createdAt: string;
  updatedAt: string;
  category: CategoryEvent;
  speaker: Speaker;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface CategoryFormData {
  name: string;
}

export interface SpeakerFormData {
  name: string;
  expertise: string;
  email: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  categoryId: string;
  speakerId: string;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface User {
  nim: string;
  name: string;
  kelas: string;
  prodi: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (nim: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}
