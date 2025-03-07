import { createAction, props } from '@ngrx/store';
import { Child, Task, Reward, Point, Parent } from '../../core/models';

// Profile Actions
export const loadParentProfile = createAction(
  '[Parent] Load Profile',
  props<{ parentId: number }>()
);

export const loadParentProfileSuccess = createAction(
  '[Parent] Load Profile Success',
  props<{ parent: Parent }>()
);

export const loadParentProfileFailure = createAction(
  '[Parent] Load Profile Failure',
  props<{ error: any }>()
);

export const updateParentProfile = createAction(
  '[Parent] Update Profile',
  props<{ parentId: number; profileData: Partial<Parent> }>()
);

// Children Actions
export const loadChildren = createAction(
  '[Parent] Load Children',
  props<{ parentId: number }>()
);

export const loadChildrenSuccess = createAction(
  '[Parent] Load Children Success',
  props<{ children: Child[] }>()
);

export const addChild = createAction(
  '[Parent] Add Child',
  props<{ parentId: number; child: Partial<Child> }>()
);

export const updateChild = createAction(
  '[Parent] Update Child',
  props<{ parentId: number; childId: number; child: Partial<Child> }>()
);

export const deleteChild = createAction(
  '[Parent] Delete Child',
  props<{ parentId: number; childId: number }>()
);

// Task Actions
export const createTask = createAction(
  '[Parent] Create Task',
  props<{ parentId: number; childId: number; task: Partial<Task> }>()
);

export const updateTask = createAction(
  '[Parent] Update Task',
  props<{
    parentId: number;
    childId: number;
    taskId: number;
    task: Partial<Task>;
  }>()
);

export const deleteTask = createAction(
  '[Parent] Delete Task',
  props<{ parentId: number; childId: number; taskId: number }>()
);

// Points Actions
export const awardPoints = createAction(
  '[Parent] Award Points',
  props<{ parentId: number; childId: number; points: number; reason: string }>()
);

export const loadPointHistory = createAction(
  '[Parent] Load Point History',
  props<{ parentId: number; childId: number }>()
);

export const loadPointHistorySuccess = createAction(
  '[Parent] Load Point History Success',
  props<{ points: Point[] }>()
);

export const updateChildPoints = createAction(
  '[Parent] Update Child Points',
  props<{ parentId: number; childId: number; points: number }>()
);

// Rewards Actions
export const createReward = createAction(
  '[Parent] Create Reward',
  props<{ parentId: number; reward: Partial<Reward> }>()
);

export const updateReward = createAction(
  '[Parent] Update Reward',
  props<{ parentId: number; rewardId: number; reward: Partial<Reward> }>()
);

export const deleteReward = createAction(
  '[Parent] Delete Reward',
  props<{ parentId: number; rewardId: number }>()
);

export const loadRewards = createAction(
  '[Parent] Load Rewards',
  props<{ parentId: number }>()
);

export const loadRewardsSuccess = createAction(
  '[Parent] Load Rewards Success',
  props<{ rewards: Reward[] }>()
);

// Error Actions
export const parentActionFailure = createAction(
  '[Parent] Action Failure',
  props<{ error: any }>()
);
