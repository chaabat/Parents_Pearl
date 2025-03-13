import { createReducer, on } from '@ngrx/store';
import { initialChildState } from './child.state';
import * as ChildActions from './child.actions';

export const childReducer = createReducer(
  initialChildState,
  
  // Profile
  on(ChildActions.loadChildProfile, state => ({
    ...state,
    loading: true
  })),
  on(ChildActions.loadChildProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false
  })),
  on(ChildActions.loadChildProfileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Tasks
  on(ChildActions.loadMyTasks, state => ({
    ...state,
    loading: true
  })),
  on(ChildActions.loadMyTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false
  })),
  on(ChildActions.loadMyTasksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Points and Rewards follow similar patterns...
); 