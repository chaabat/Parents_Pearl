export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum TaskType {
  MAZE = 'MAZE',
  TRUE_FALSE = 'TRUE_FALSE'
}

export interface Task {
  id: number;
  title: string;
  description: string;
  pointValue: number;
  dueDate?: Date;
  status: TaskStatus;
  taskType: TaskType;
  choices?: string[];
  correctAnswer: string;
  childId: number;
} 