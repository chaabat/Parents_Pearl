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

  tasks?: any[];
  rewardRedemptions: RewardRedemption[];
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
