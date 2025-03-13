import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChildState } from './child.state';

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
