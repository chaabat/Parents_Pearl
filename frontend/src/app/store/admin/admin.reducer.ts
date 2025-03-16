import { createReducer, on } from '@ngrx/store';
import * as AdminActions from './admin.actions';
import { AdminState, initialState } from './admin.state';

export const adminReducer = createReducer(
  initialState,

  // Load Parents
  on(AdminActions.loadParents, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AdminActions.loadParentsSuccess, (state, { parents }) => ({
    ...state,
    parents,
    loading: false,
  })),
  on(AdminActions.loadParentsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Load Children
  on(AdminActions.loadChildren, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AdminActions.loadChildrenSuccess, (state, { children }) => ({
    ...state,
    children,
    loading: false,
  })),
  on(AdminActions.loadChildrenFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Ban Management
  on(AdminActions.banUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AdminActions.banUserSuccess, (state, { userId }) => ({
    ...state,
    parents: state.parents.map((parent) =>
      parent.id === userId ? { ...parent, banned: true } : parent
    ),
    children: state.children.map((child) =>
      child.id === userId ? { ...child, banned: true } : child
    ),
    bannedUsers: [
      ...state.bannedUsers,
      ...(state.parents.find((p) => p.id === userId)
        ? [
            {
              ...state.parents.find((p) => p.id === userId),
              userType: 'parent',
              banned: true,
            },
          ]
        : []),
      ...(state.children.find((c) => c.id === userId)
        ? [
            {
              ...state.children.find((c) => c.id === userId),
              userType: 'child',
              banned: true,
            },
          ]
        : []),
    ].filter(Boolean),
    loading: false,
  })),
  on(AdminActions.banUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Unban Management
  on(AdminActions.unbanUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AdminActions.unbanUserSuccess, (state, { userId }) => ({
    ...state,
    parents: state.parents.map((parent) =>
      parent.id === userId ? { ...parent, banned: false } : parent
    ),
    children: state.children.map((child) =>
      child.id === userId ? { ...child, banned: false } : child
    ),
    bannedUsers: state.bannedUsers.filter((user) => user.id !== userId),
    loading: false,
  })),
  on(AdminActions.unbanUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Load Banned Users
  on(AdminActions.loadBannedUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AdminActions.loadBannedUsersSuccess, (state, { bannedUsers }) => ({
    ...state,
    bannedUsers,
    loading: false,
  })),
  on(AdminActions.loadBannedUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // System Stats
  on(AdminActions.loadSystemStats, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AdminActions.loadSystemStatsSuccess, (state, { stats }) => ({
    ...state,
    systemStats: stats,
    loading: false,
  })),
  on(AdminActions.loadSystemStatsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
export { AdminState };

