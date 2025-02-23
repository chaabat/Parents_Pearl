export type UserRole = 'PARENT' | 'ADMIN' | 'CHILD';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Child extends User {
  parentId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  children: Child[] | null;
}
