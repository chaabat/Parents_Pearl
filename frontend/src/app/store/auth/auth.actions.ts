import { createAction, props } from '@ngrx/store';
import { User } from './auth.types';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User; token: string }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{
    firstName: string;
    lastName: string;
    email: string;
  }>()
);

export const updateChildProfile = createAction(
  '[Auth] Update Child Profile',
  props<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>()
);

export const deleteChildProfile = createAction(
  '[Auth] Delete Child Profile',
  props<{ id: string }>()
);
