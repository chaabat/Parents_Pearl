import { Child, ChildResponse } from '../../core/models/child.model';
import { Task } from '../../core/models/task.model';
import { Point } from '../../core/models';
import { Reward } from '../../core/models/reward.model';
import { RewardRedemption } from '../../core/models/reward-redemption.model';

export interface ChildState {
  profile: ChildResponse | null;
  tasks: Task[];
  points: Point[];
  rewards: Reward[];
  redemptions: RewardRedemption[];
  loading: boolean;
  error: any;
}

export const initialChildState: ChildState = {
  profile: null,
  tasks: [],
  points: [],
  rewards: [],
  redemptions: [],
  loading: false,
  error: null,
};
