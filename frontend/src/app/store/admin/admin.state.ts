import { Parent } from '../../core/models/parent.model';
import { Child } from '../../core/models/child.model';
import { Admin } from '../../core/models/admin.model';

export interface AdminState {
  parents: Parent[];
  children: Child[];
  admins: Admin[];
  bannedUsers: any[];
  systemStats: {
    activeUsers: number;
    bannedUsers: number;
    completedTasks: number;
  } | null;
  activityLogs: any[];
  searchResults: any[];
  systemSettings: any;
  loading: boolean;
  error: any;
}

export const initialAdminState: AdminState = {
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
