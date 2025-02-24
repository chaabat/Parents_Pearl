import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from './auth.types';

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  children: null,
  isAuthenticated: false
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.login,
    (state): AuthState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(AuthActions.loginSuccess, (state, { user, token }): AuthState => {
    console.log('Reducer: Setting user and token', { user, token }); // Debug log
    return {
      ...state,
      user,
      token,
      loading: false,
      error: null,
    };
  }),
  on(
    AuthActions.loginFailure,
    (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error,
    })
  ),
  on(AuthActions.logout, (): AuthState => initialState),
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.registerSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
