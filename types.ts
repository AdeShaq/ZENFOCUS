
export enum TaskFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY'
}

export enum TaskCategory {
  SPIRITUAL = 'Spiritual',
  FITNESS = 'Fitness',
  PRODUCTIVITY = 'Productivity',
  HEALTH = 'Health',
  FINANCIAL = 'Financial',
  GROOMING = 'Grooming',
  HOUSEHOLD = 'Household',
  MY_WORKOUT = 'My Workout'
}

export interface TaskDefinition {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  time?: string; // HH:mm format
  daysOfWeek?: number[]; // 0 (Sun) - 6 (Sat)
  dayOfMonth?: number;
  color: string;
}

export interface UserProgress {
  completedTaskIds: Record<string, string[]>; // Date key (YYYY-MM-DD) -> Array of completed Task IDs
}
