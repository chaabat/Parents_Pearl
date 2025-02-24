export type UserRole = 'PARENT' | 'ADMIN' | 'CHILD';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PARENT' | 'CHILD';
}

export interface Child extends User {
  parentId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
  children: Child[] | null;
}
