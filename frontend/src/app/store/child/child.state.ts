import { Child, ChildResponse } from '../../core/models/child.model';
import { Task } from '../../core/models/task.model';
import { Point } from '../../core/models';
import { Reward } from '../../core/models/reward.model';

export interface ChildState {
  profile: ChildResponse | null;
  tasks: Task[];
  points: Point[];
  rewards: Reward[];
  loading: boolean;
  error: any;
}

export const initialChildState: ChildState = {
  profile: null,
  tasks: [],
  points: [],
  rewards: [],
  loading: false,
  error: null
}; 