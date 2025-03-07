export interface AuthState {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    points?: number;
    tasks?: any[];
    rewardRedemptions?: any[];
  } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}; 