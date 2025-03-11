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

export const loadChildrenFailure = createAction(
  '[Parent] Load Children Failure',
  props<{ error: any }>()
);

export const addChild = createAction(
  '[Parent] Add Child',
  props<{ parentId: number; child: any }>()
);

export const addChildSuccess = createAction(
  '[Parent] Add Child Success',
  props<{ child: Child }>()
);

export const addChildFailure = createAction(
  '[Parent] Add Child Failure',
  props<{ error: any }>()
);

export const updateChild = createAction(
  '[Parent] Update Child',
  props<{ parentId: number; childId: number; child: Partial<Child> }>()
);

export const updateChildSuccess = createAction(
  '[Parent] Update Child Success',
  props<{ child: Child }>()
);

export const updateChildFailure = createAction(
  '[Parent] Update Child Failure',
  props<{ error: any }>()
);

export const deleteChild = createAction(
  '[Parent] Delete Child',
  props<{ parentId: number; childId: number }>()
);

export const deleteChildSuccess = createAction('[Parent] Delete Child Success');

export const deleteChildFailure = createAction(
  '[Parent] Delete Child Failure',
  props<{ error: any }>()
);

// Task Actions
export const loadTasks = createAction(
  '[Parent] Load Tasks',
  props<{ parentId: number }>()
);

export const loadTasksSuccess = createAction(
  '[Parent] Load Tasks Success',
  props<{ tasks: Task[] }>()
);

export const createTask = createAction(
  '[Parent] Create Task',
  props<{ parentId: number; childId: number; task: Partial<Task> }>()
);

export const createTaskSuccess = createAction(
  '[Parent] Create Task Success',
  props<{ task: Task }>()
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

export const updateTaskSuccess = createAction(
  '[Parent] Update Task Success',
  props<{ task: Task }>()
);

export const deleteTask = createAction(
  '[Parent] Delete Task',
  props<{ parentId: number; childId: number; taskId: number }>()
);

export const deleteTaskSuccess = createAction(
  '[Parent] Delete Task Success',
  props<{ taskId: number }>()
);

// Points Actions
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

export const addPoints = createAction(
  '[Parent] Add Points',
  props<{
    parentId: number;
    childId: number;
    points: number;
    reason: string;
  }>()
);

export const addPointsSuccess = createAction(
  '[Parent] Add Points Success',
  props<{ points: any }>()
);

export const addPointsFailure = createAction(
  '[Parent] Add Points Failure',
  props<{ error: any }>()
);

// Rewards Actions
export const loadRewards = createAction(
  '[Parent] Load Rewards',
  props<{ parentId: number }>()
);

export const loadRewardsSuccess = createAction(
  '[Parent] Load Rewards Success',
  props<{ rewards: Reward[] }>()
);

export const createReward = createAction(
  '[Parent] Create Reward',
  props<{ parentId: number; reward: Partial<Reward> }>()
);

export const createRewardSuccess = createAction(
  '[Parent] Create Reward Success',
  props<{ reward: Reward }>()
);

export const updateReward = createAction(
  '[Parent] Update Reward',
  props<{ parentId: number; rewardId: number; reward: Partial<Reward> }>()
);

export const updateRewardSuccess = createAction(
  '[Parent] Update Reward Success',
  props<{ reward: Reward }>()
);

export const deleteReward = createAction(
  '[Parent] Delete Reward',
  props<{ parentId: number; rewardId: number }>()
);

export const deleteRewardSuccess = createAction(
  '[Parent] Delete Reward Success',
  props<{ rewardId: number }>()
);

// Error Actions
export const parentActionFailure = createAction(
  '[Parent] Action Failure',
  props<{ error: any }>()
);
