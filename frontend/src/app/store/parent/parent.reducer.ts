import { createReducer, on } from "@ngrx/store"
import * as ParentActions from "./parent.actions"
import { initialParentState } from "./parent.state"

export const parentReducer = createReducer(
  initialParentState,

  // Profile
  on(ParentActions.loadParentProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ParentActions.loadParentProfileSuccess, (state, { parent }) => ({
    ...state,
    parent,
    loading: false,
  })),

  // Children
  on(ParentActions.loadChildren, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ParentActions.loadChildrenSuccess, (state, { children }) => ({
    ...state,
    children,
    loading: false,
  })),

  // Points
  on(ParentActions.loadPointHistory, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ParentActions.loadPointHistorySuccess, (state, { points }) => ({
    ...state,
    pointHistory: points,
    loading: false,
  })),

  // Rewards
  on(ParentActions.loadRewards, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ParentActions.loadRewardsSuccess, (state, { rewards }) => ({
    ...state,
    rewards,
    loading: false,
  })),

  // Error handling
  on(ParentActions.loadParentProfileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(ParentActions.parentActionFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Tasks
  on(ParentActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
    error: null,
  })),

  on(ParentActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    loading: false,
    error: null,
  })),

  on(ParentActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    loading: false,
    error: null,
  })),

  on(ParentActions.deleteTaskSuccess, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.filter((task) => task.id !== taskId),
    loading: false,
    error: null,
  })),

  on(ParentActions.updateChildSuccess, (state, { child }) => ({
    ...state,
    children: state.children.map((c) => (c.id === child.id ? { ...c, ...child } : c)),
    error: null,
    loading: false,
  })),

  on(ParentActions.completeTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),

  // Search actions
  on(ParentActions.searchTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ParentActions.searchTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    searchResults: tasks,
    loading: false,
    error: null,
  })),

  on(ParentActions.searchTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
)

