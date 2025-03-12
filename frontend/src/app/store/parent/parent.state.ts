import { Child, Task, Reward, Point, Parent } from '../../core/models';

export interface ParentState {
  parent: Parent | null;
  children: Child[];
  rewards: Reward[];
  pointHistory: Point[];
  tasks: Task[];
  searchResults: Task[];
  loading: boolean;
  error: any;
  selectedChild: any;
  filteredTasks: any[];
}

export const initialParentState: ParentState = {
  parent: null,
  children: [],
  rewards: [],
  pointHistory: [],
  tasks: [],
  searchResults: [],
  loading: false,
  error: null,
  selectedChild: null,
  filteredTasks: [],
};
