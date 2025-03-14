import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChildState } from './child.state';
import { createAction, props } from '@ngrx/store';

export const selectChildState = createFeatureSelector<ChildState>('child');

export const selectChildProfile = createSelector(
  selectChildState,
  (state) => state?.profile ?? null
);

export const selectChildTasks = createSelector(
  selectChildState,
  (state) => state?.tasks ?? []
);

export const selectChildPoints = createSelector(
  selectChildState,
  (state) => state?.points ?? []
);

export const selectChildRewards = createSelector(
  selectChildState,
  (state) => state?.rewards ?? []
);

export const selectChildLoading = createSelector(
  selectChildState,
  (state) => state?.loading ?? false
);

export const selectChildError = createSelector(
  selectChildState,
  (state) => state?.error ?? null
);

export const selectTotalPoints = createSelector(
  selectChildProfile,
  (profile) => {
    console.log('Profile in selector:', profile);
    return profile?.totalPoints ?? 0;
  }
);

export const selectChildRedemptions = createSelector(
  selectChildState,
  (state) => state.redemptions
);

export const loadPoints = createAction(
  '[Child] Load Points',
  props<{ childId: number }>()
);
