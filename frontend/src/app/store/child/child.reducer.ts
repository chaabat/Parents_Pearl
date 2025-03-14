import { createReducer, on } from '@ngrx/store';
import { initialChildState } from './child.state';
import * as ChildActions from './child.actions';

export const childReducer = createReducer(
  initialChildState,

  // Profile
  on(ChildActions.loadChildProfile, (state) => ({
    ...state,
    loading: true,
  })),
  on(ChildActions.loadChildProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(ChildActions.loadChildProfileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Tasks
  on(ChildActions.loadMyTasks, (state) => ({
    ...state,
    loading: true,
  })),
  on(ChildActions.loadMyTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
  })),
  on(ChildActions.loadMyTasksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Redemptions
  on(ChildActions.loadRedemptions, (state) => ({
    ...state,
    loading: true
  })),
  on(ChildActions.loadRedemptionsSuccess, (state, { redemptions }) => ({
    ...state,
    redemptions,
    loading: false
  })),
  on(ChildActions.loadRedemptionsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(ChildActions.redeemReward, (state) => ({
    ...state,
    loading: true
  })),
  on(ChildActions.redeemRewardSuccess, (state, { redemption }) => ({
    ...state,
    redemptions: [redemption, ...state.redemptions],
    loading: false
  })),
  on(ChildActions.redeemRewardFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Rewards
  on(ChildActions.loadRewards, (state) => ({
    ...state,
    loading: true
  })),
  on(ChildActions.loadRewardsSuccess, (state, { rewards }) => ({
    ...state,
    rewards,
    loading: false
  })),
  on(ChildActions.loadRewardsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Points and Rewards follow similar patterns...
);
