import { Child, Task, Reward, Point, Parent } from '../../core/models';

export interface ParentState {
  parent: Parent | null;
  children: Child[];
  rewards: Reward[];
  pointHistory: Point[];
  tasks: Task[];
  loading: boolean;
  error: any | null;
}

export const initialParentState: ParentState = {
  parent: null,
  children: [],
  rewards: [],
  pointHistory: [],
  tasks: [],
  loading: false,
  error: null,
};
