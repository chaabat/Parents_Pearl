export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  parentId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
  childId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BehaviorRecord {
  id: string;
  type: 'POSITIVE' | 'NEGATIVE';
  description: string;
  points: number;
  childId: string;
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}
