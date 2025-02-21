import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from './auth.types';

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
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
  on(
    AuthActions.loginSuccess,
    (state, { user, token }): AuthState => ({
      ...state,
      user,
      token,
      loading: false,
      error: null,
    })
  ),
  on(
    AuthActions.loginFailure,
    (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error,
    })
  ),
  on(AuthActions.logout, (): AuthState => initialState)
);
