import { User, Role } from './user.model';
import { Task } from './task.model';
import { Point } from './point.model';
import { RewardRedemption } from './reward-redemption.model';

export interface Child extends User {
  role: Role.CHILD;
  totalPoints: number;
  parentId: number;
  tasks: Task[];
  points: Point[];
  rewardRedemptions: RewardRedemption[];
}
