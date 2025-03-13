import { createAction, props } from '@ngrx/store';
import { Child, ChildResponse } from '../../core/models/child.model';
import { Task, TaskAnswer } from '../../core/models/task.model';
import { Point } from '../../core/models';
import { Reward } from '../../core/models/reward.model';
 
// Profile Actions
export const loadChildProfile = createAction(
  '[Child] Load Profile',
  props<{ childId: number }>()
);
export const loadChildProfileSuccess = createAction(
  '[Child] Load Profile Success',
  props<{ profile: ChildResponse }>()
);
export const loadChildProfileFailure = createAction(
  '[Child] Load Profile Failure',
  props<{ error: any }>()
);

// Task Actions
export const loadMyTasks = createAction(
  '[Child] Load My Tasks',
  props<{ childId: number }>()
);
export const loadMyTasksSuccess = createAction(
  '[Child] Load My Tasks Success',
  props<{ tasks: Task[] }>()
);
export const loadMyTasksFailure = createAction(
  '[Child] Load My Tasks Failure',
  props<{ error: any }>()
);

// Points Actions
export const loadPoints = createAction(
  '[Child] Load Points',
  props<{ childId: number }>()
);
export const loadPointsSuccess = createAction(
  '[Child] Load Points Success',
  props<{ points: Point[] }>()
);
export const loadPointsFailure = createAction(
  '[Child] Load Points Failure',
  props<{ error: any }>()
);

// Rewards Actions
export const loadRewards = createAction(
  '[Child] Load Rewards',
  props<{ childId: number }>()
);
export const loadRewardsSuccess = createAction(
  '[Child] Load Rewards Success',
  props<{ rewards: Reward[] }>()
);
export const loadRewardsFailure = createAction(
  '[Child] Load Rewards Failure',
  props<{ error: any }>()
);

// Task Answer Actions
export const submitTaskAnswer = createAction(
  '[Child] Submit Task Answer',
  props<{ childId: number; taskId: number; answer: string }>()
);

export const submitTaskAnswerSuccess = createAction(
  '[Child] Submit Task Answer Success',
  props<{ taskAnswer: TaskAnswer }>()
);

export const submitTaskAnswerFailure = createAction(
  '[Child] Submit Task Answer Failure',
  props<{ error: any }>()
);
