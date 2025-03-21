import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.state';

export const selectAdminState = createFeatureSelector<AdminState>('admin');

export const selectParents = createSelector(
  selectAdminState,
  (state) => state?.parents ?? []
);

export const selectChildren = createSelector(
  selectAdminState,
  (state) => state?.children ?? []
);

export const selectAdmins = createSelector(
  selectAdminState,
  (state) => state?.admins ?? []
);

export const selectBannedUsers = createSelector(
  selectAdminState,
  (state) => state?.bannedUsers ?? []
);

export const selectSystemStats = createSelector(
  selectAdminState,
  (state) => state?.systemStats ?? null
);

export const selectAdminLoading = createSelector(
  selectAdminState,
  (state) => state?.loading ?? false
);

export const selectAdminError = createSelector(
  selectAdminState,
  (state) => state?.error ?? null
);

export const selectSearchResults = createSelector(
  selectAdminState,
  (state) => state.searchResults || []
);

export const selectAdminProfile = createSelector(
  selectAdminState,
  (state) => state?.adminProfile ?? null
);
