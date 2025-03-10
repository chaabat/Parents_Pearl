export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum TaskType {
  MAZE = 'MAZE',
  TRUE_FALSE = 'TRUE_FALSE',
  HOMEWORK = 'HOMEWORK',
  QUIZ = 'QUIZ',
  READING = 'READING',
  VIDEO = 'VIDEO',
}

export interface Task {
  id: number;
  title: string;
  description: string;
  pointValue: number;
  taskType: TaskType;
  status: TaskStatus;
  childId: number;
  dueDate: string | Date;
  choices?: string[];
  correctAnswer?: string;
}
