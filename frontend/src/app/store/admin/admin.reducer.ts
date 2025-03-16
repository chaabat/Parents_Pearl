import { createReducer, on } from '@ngrx/store';
import * as AdminActions from './admin.actions';
import { Parent } from '../../core/models/parent.model';
import { Child } from '../../core/models/child.model';
import { Admin } from '../../core/models/admin.model';

export interface AdminState {
  parents: Parent[] | null;
  children: Child[] | null;
  admins: Admin[] | null;
  bannedUsers: any[] | null;
  systemStats: any | null;
  activityLogs: any[] | null;
  searchResults: any[] | null;
  systemSettings: any | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AdminState = {
  parents: [],
  children: [],
  admins: [],
  bannedUsers: [],
  systemStats: null,
  activityLogs: [],
  searchResults: [],
  systemSettings: null,
  loading: false,
  error: null,
};

export const adminReducer = createReducer(
  initialState,

  // Load Parents
  on(AdminActions.loadParents, (state) => ({
    ...state,
    loading: true,
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

  // Load Admins
  on(AdminActions.loadAdmins, (state) => ({
    ...state,
    loading: true,
  })),
  on(AdminActions.loadAdminsSuccess, (state, { admins }) => ({
    ...state,
    admins,
    loading: false,
  })),
  on(AdminActions.loadAdminsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Ban Management
  on(AdminActions.banUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(AdminActions.banUserSuccess, (state, { userId }) => ({
    ...state,
    loading: false,
  })),
  on(AdminActions.banUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Load Banned Users
  on(AdminActions.loadBannedUsers, (state) => ({
    ...state,
    loading: true,
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
  })),

  // Search Users
  on(AdminActions.searchUsers, (state) => ({
    ...state,
    loading: true,
  })),
  on(AdminActions.searchUsersSuccess, (state, { results }) => ({
    ...state,
    searchResults: results,
    loading: false,
  })),
  on(AdminActions.searchUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Activity Logs
  on(AdminActions.loadActivityLogs, (state) => ({
    ...state,
    loading: true,
  })),
  on(AdminActions.loadActivityLogsSuccess, (state, { logs }) => ({
    ...state,
    activityLogs: logs,
    loading: false,
  })),
  on(AdminActions.loadActivityLogsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // System Settings
  on(AdminActions.updateSystemSettings, (state) => ({
    ...state,
    loading: true,
  })),
  on(AdminActions.updateSystemSettingsSuccess, (state, { settings }) => ({
    ...state,
    systemSettings: settings,
    loading: false,
  })),
  on(AdminActions.updateSystemSettingsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
