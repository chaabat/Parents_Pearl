import { createAction, props } from "@ngrx/store"

export const login = createAction("[Auth] Login", props<{ email: string; password: string }>())

export const loginSuccess = createAction("[Auth] Login Success", props<{ user: any; token: string }>())

export const loginFailure = createAction("[Auth] Login Failure", props<{ error: string }>())

export const logout = createAction("[Auth] Logout")

export const updateUser = createAction("[Auth] Update User", props<{ user: any }>())

export const refreshToken = createAction("[Auth] Refresh Token")

export const refreshTokenSuccess = createAction("[Auth] Refresh Token Success", props<{ token: string }>())

export const refreshTokenFailure = createAction("[Auth] Refresh Token Failure", props<{ error: string }>())

export const register = createAction(
  '[Auth] Register',
  props<{ userData: any }>()
)

export const registerSuccess = createAction(
  '[Auth] Register Success'
)

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
)

export const clearError = createAction(
  '[Auth] Clear Error'
)

export const updateUserSuccess = createAction(
  '[Auth] Update User Success',
  props<{ user: any }>()
)

