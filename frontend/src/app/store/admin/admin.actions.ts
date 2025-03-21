import { createAction, props } from '@ngrx/store';
import { Parent } from '../../core/models/parent.model';
import { Child } from '../../core/models/child.model';
import { Admin } from '../../core/models/admin.model';

// Load Users
export const loadParents = createAction('[Admin] Load Parents');
export const loadParentsSuccess = createAction(
  '[Admin] Load Parents Success',
  props<{ parents: Parent[] }>()
);
export const loadParentsFailure = createAction(
  '[Admin] Load Parents Failure',
  props<{ error: any }>()
);

export const loadChildren = createAction('[Admin] Load Children');
export const loadChildrenSuccess = createAction(
  '[Admin] Load Children Success',
  props<{ children: Child[] }>()
);
export const loadChildrenFailure = createAction(
  '[Admin] Load Children Failure',
  props<{ error: any }>()
);

export const loadAdmins = createAction('[Admin] Load Admins');
export const loadAdminsSuccess = createAction(
  '[Admin] Load Admins Success',
  props<{ admins: Admin[] }>()
);
export const loadAdminsFailure = createAction(
  '[Admin] Load Admins Failure',
  props<{ error: any }>()
);

// Ban Management
export const banUser = createAction(
  '[Admin] Ban User',
  props<{ userId: number; userType: 'parent' | 'child' }>()
);
export const banUserSuccess = createAction(
  '[Admin] Ban User Success',
  props<{ userId: number }>()
);
export const banUserFailure = createAction(
  '[Admin] Ban User Failure',
  props<{ error: any }>()
);

export const unbanUser = createAction(
  '[Admin] Unban User',
  props<{ userId: number; userType: 'parent' | 'child' }>()
);
export const unbanUserSuccess = createAction(
  '[Admin] Unban User Success',
  props<{ userId: number }>()
);
export const unbanUserFailure = createAction(
  '[Admin] Unban User Failure',
  props<{ error: any }>()
);

export const loadBannedUsers = createAction('[Admin] Load Banned Users');
export const loadBannedUsersSuccess = createAction(
  '[Admin] Load Banned Users Success',
  props<{ bannedUsers: any[] }>()
);
export const loadBannedUsersFailure = createAction(
  '[Admin] Load Banned Users Failure',
  props<{ error: any }>()
);

// Statistics
export const loadSystemStats = createAction('[Admin] Load System Stats');
export const loadSystemStatsSuccess = createAction(
  '[Admin] Load System Stats Success',
  props<{
    stats: {
      activeUsers: number;
      bannedUsers: number;
      completedTasks: number;
    };
  }>()
);
export const loadSystemStatsFailure = createAction(
  '[Admin] Load System Stats Failure',
  props<{ error: any }>()
);

// Search
export const searchUsers = createAction(
  '[Admin] Search Users',
  props<{ query: string }>()
);
export const searchUsersSuccess = createAction(
  '[Admin] Search Users Success',
  props<{ users: any[] }>()
);
export const searchUsersFailure = createAction(
  '[Admin] Search Users Failure',
  props<{ error: any }>()
);

// Activity Logs
export const loadActivityLogs = createAction('[Admin] Load Activity Logs');
export const loadActivityLogsSuccess = createAction(
  '[Admin] Load Activity Logs Success',
  props<{ logs: any[] }>()
);
export const loadActivityLogsFailure = createAction(
  '[Admin] Load Activity Logs Failure',
  props<{ error: any }>()
);

// System Settings
export const updateSystemSettings = createAction(
  '[Admin] Update System Settings',
  props<{ settings: any }>()
);
export const updateSystemSettingsSuccess = createAction(
  '[Admin] Update System Settings Success',
  props<{ settings: any }>()
);
export const updateSystemSettingsFailure = createAction(
  '[Admin] Update System Settings Failure',
  props<{ error: any }>()
);

export const loadAdminDashboard = createAction(
  '[Admin] Load Dashboard'
);

export const loadAdminDashboardSuccess = createAction(
  '[Admin] Load Dashboard Success',
  props<{ data: any }>()
);

export const loadAdminDashboardFailure = createAction(
  '[Admin] Load Dashboard Failure',
  props<{ error: string }>()
);

// Add these new actions
export const loadAdminProfile = createAction(
  '[Admin] Load Admin Profile',
  props<{ adminId: number }>()
);

export const loadAdminProfileSuccess = createAction(
  '[Admin] Load Admin Profile Success',
  props<{ profile: Admin }>()
);

export const loadAdminProfileFailure = createAction(
  '[Admin] Load Admin Profile Failure',
  props<{ error: any }>()
);

export const updateAdminProfile = createAction(
  '[Admin] Update Admin Profile',
  props<{ adminId: number; profileData: any }>()
);

export const updateAdminProfileSuccess = createAction(
  '[Admin] Update Admin Profile Success',
  props<{ profile: Admin }>()
);

export const updateAdminProfileFailure = createAction(
  '[Admin] Update Admin Profile Failure',
  props<{ error: any }>()
);
