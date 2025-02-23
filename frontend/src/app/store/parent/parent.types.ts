import { Child, Task, BehaviorRecord, CalendarEvent } from '../../core/types/api.types';

export interface ParentState {
  children: {
    items: Child[];
    loading: boolean;
    error: string | null;
  };
  tasks: {
    items: Task[];
    loading: boolean;
    error: string | null;
  };
  behavior: {
    items: BehaviorRecord[];
    loading: boolean;
    error: string | null;
  };
  calendar: {
    items: CalendarEvent[];
    loading: boolean;
    error: string | null;
  };
}

// Re-export types from api.types
export { Child, Task, BehaviorRecord, CalendarEvent }; 