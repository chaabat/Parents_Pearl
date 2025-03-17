import { createReducer, on } from '@ngrx/store';
import * as AdminActions from './admin.actions';
import { AdminState, initialAdminState as initialState } from './admin.state';import { Parent } from '../../core/models/parent.model';
import { Child } from '../../core/models/child.model';

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
  on(AdminActions.banUserSuccess, (state, { userId }) => {
    const bannedParent = state.parents.find((p: Parent) => p.id === userId);
    const bannedChild = state.children.find((c: Child) => c.id === userId);

    return {
      ...state,
      parents: state.parents.map((parent: Parent) =>
        parent.id === userId ? { ...parent, banned: true } : parent
      ),
      children: state.children.map((child: Child) =>
        child.id === userId ? { ...child, banned: true } : child
      ),
      bannedUsers: [
        ...state.bannedUsers,
        ...(bannedParent
          ? [{ id: userId, userType: 'parent', banned: true }]
          : []),
        ...(bannedChild
          ? [{ id: userId, userType: 'child', banned: true }]
          : []),
      ],
      loading: false,
    };
  }),
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
    parents: state.parents.map((parent: Parent) =>
      parent.id === userId ? { ...parent, banned: false } : parent
    ),
    children: state.children.map((child: Child) =>
      child.id === userId ? { ...child, banned: false } : child
    ),
    bannedUsers: state.bannedUsers.filter((user: { id: number; }) => user.id !== userId),
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
