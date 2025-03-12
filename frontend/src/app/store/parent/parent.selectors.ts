import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ParentState } from './parent.state';

// Feature selector
export const selectParentState = createFeatureSelector<ParentState>('parent');

// Profile selectors
export const selectParentProfile = createSelector(
  selectParentState,
  (state) => state.parent
);
export const selectTasks = createSelector(
  selectParentState,
  (state) => state.tasks
);

export const selectParentId = createSelector(
  selectParentProfile,
  (parent) => parent?.id
);

// Children selectors
export const selectChildren = createSelector(
  selectParentState,
  (state) => state.children
);

export const selectChildById = (childId: number) =>
  createSelector(selectChildren, (children) =>
    children.find((child) => child.id === childId)
);

// Points selectors
export const selectPointHistory = createSelector(
  selectParentState,
  (state) => state.pointHistory
);

export const selectChildPointHistory = (childId: number) =>
  createSelector(selectPointHistory, (points) =>
    points.filter((point) => point.childId === childId)
  );

// Rewards selectors
export const selectRewards = createSelector(
  selectParentState,
  (state) => state.rewards
);

export const selectRewardById = (rewardId: number) =>
  createSelector(selectRewards, (rewards) =>
    rewards.find((reward) => reward.id === rewardId)
  );

// Status selectors
export const selectParentLoading = createSelector(
  selectParentState,
  (state) => state.loading
);

export const selectParentError = createSelector(
  selectParentState,
  (state) => state.error
);

export const selectSelectedChild = createSelector(
  selectParentState,
  (state) => state.selectedChild
);

export const selectFilteredTasks = createSelector(
  selectParentState,
  (state) => state.filteredTasks
);

// Add this selector
export const selectSearchResults = createSelector(
  selectParentState,
  (state) => state.searchResults
);
