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
  totalPoints?: number;
  tasks?: any[];
  rewardRedemptions?: any[];
  role: string;
  password?: string;
}
