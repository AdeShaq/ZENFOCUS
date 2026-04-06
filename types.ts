
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
  MY_WORKOUT = 'My Workout',
  ACADEMICS = 'Academics',
  RELATIONSHIPS = 'Relationships'
}

export interface TaskDefinition {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  time?: string; // HH:mm format
  endTime?: string; // HH:mm format
  daysOfWeek?: number[]; // 0 (Sun) - 6 (Sat)
  dayOfMonth?: number;
  color: string;
}

export interface UserProgress {
  completedTaskIds: Record<string, string[]>; // Date key (YYYY-MM-DD) -> Array of completed Task IDs
  missedTaskReasons: Record<string, Record<string, string>>; // Date key -> Task ID -> Reason string
  eodReviews: Record<string, string>; // Date key -> Review text
}

export interface Note {
  id: string;
  title: string;
  content: string;
  dateCreated: string;
  lastUpdated: string;
  color?: string;
  isPinned?: boolean;
}

export interface FinanceEntry {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'debt' | 'saving';
  date: string; // ISO date string
  status: 'Expected' | 'Confirmed' | 'Pending' | 'Paid';
  notes?: string;
}
