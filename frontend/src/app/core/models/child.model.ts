import { User, Role } from './user.model';
import { Task } from './task.model';
import { Point } from './point.model';
import { RewardRedemption } from './reward-redemption.model';

export interface Child {
  id?: number;
  name: string;
  email: string;
  dateOfBirth: string;
  picture?: string;
  deleted: boolean;

  tasks?: any[];
  rewardRedemptions?: any[];
  role: string;
  password?: string;
  totalPoints: number;
  parentId: number;
}

export interface ChildResponse {
  id: number;
  name: string;
  email: string;
  totalPoints: number;
}

export interface DialogData {
  title: string
  submitText?: string
  confirmText?: string
  child?: Child
  form?: any;
}
