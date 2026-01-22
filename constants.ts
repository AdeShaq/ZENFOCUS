
import { TaskCategory, TaskFrequency, TaskDefinition } from './types';

export const DEFAULT_TASKS: TaskDefinition[] = [
  // DAILY
  {
    id: 'd-1',
    title: 'Wake Up',
    description: 'Rise and shine at 6:00 AM',
    category: TaskCategory.PRODUCTIVITY,
    frequency: TaskFrequency.DAILY,
    time: '06:00',
    color: 'bg-sky-100 border-sky-200 text-sky-800 dark:text-sky-200'
  },
  {
    id: 'd-2',
    title: 'Morning Prayer',
    description: '6:00 AM - 6:15 AM: Start with gratitude',
    category: TaskCategory.SPIRITUAL,
    frequency: TaskFrequency.DAILY,
    time: '06:00',
    color: 'bg-purple-100 border-purple-200 text-purple-800 dark:text-purple-200'
  },
  {
    id: 'd-3',
    title: 'Pushup Workout',
    description: '6:15 AM - 6:30 AM: 50-80 pushups',
    category: TaskCategory.FITNESS,
    frequency: TaskFrequency.DAILY,
    time: '06:15',
    color: 'bg-orange-100 border-orange-200 text-orange-800 dark:text-orange-200'
  },
  {
    id: 'd-4',
    title: 'Plan the Day',
    description: '6:30 AM - 7:00 AM: Focus on priorities',
    category: TaskCategory.PRODUCTIVITY,
    frequency: TaskFrequency.DAILY,
    time: '06:30',
    color: 'bg-amber-100 border-amber-200 text-amber-800 dark:text-amber-200'
  },
  {
    id: 'd-5',
    title: 'Time with God',
    description: '7:00 AM - 7:30 AM: Quiet reflection',
    category: TaskCategory.SPIRITUAL,
    frequency: TaskFrequency.DAILY,
    time: '07:00',
    color: 'bg-rose-100 border-rose-200 text-rose-800 dark:text-rose-200'
  },
  {
    id: 'd-6',
    title: 'Journaling & Reading',
    description: '10:00 PM: Bible or book study',
    category: TaskCategory.SPIRITUAL,
    frequency: TaskFrequency.DAILY,
    time: '22:00',
    color: 'bg-indigo-100 border-indigo-200 text-indigo-800 dark:text-indigo-200'
  },
  {
    id: 'd-7',
    title: 'Sleep',
    description: '11:00 PM: Rest for recovery',
    category: TaskCategory.HEALTH,
    frequency: TaskFrequency.DAILY,
    time: '23:00',
    color: 'bg-slate-100 border-slate-200 text-slate-800 dark:text-slate-200'
  },

  // WEEKLY
  {
    id: 'w-gym-tue',
    title: 'Gym Session',
    description: 'Tuesday intense workout',
    category: TaskCategory.FITNESS,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [2],
    color: 'bg-emerald-100 border-emerald-200 text-emerald-800 dark:text-emerald-200'
  },
  {
    id: 'w-gym-thu',
    title: 'Gym Session',
    description: 'Thursday intense workout',
    category: TaskCategory.FITNESS,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [4],
    color: 'bg-emerald-100 border-emerald-200 text-emerald-800 dark:text-emerald-200'
  },
  {
    id: 'w-gym-fri',
    title: 'Gym Session',
    description: 'Friday intense workout',
    category: TaskCategory.FITNESS,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [5],
    color: 'bg-emerald-100 border-emerald-200 text-emerald-800 dark:text-emerald-200'
  },
  {
    id: 'w-calls',
    title: 'Call People',
    description: 'Maintain relationships (Tue-Thu)',
    category: TaskCategory.PRODUCTIVITY,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [2, 3, 4],
    color: 'bg-cyan-100 border-cyan-200 text-cyan-800 dark:text-cyan-200'
  },
  {
    id: 'w-jog',
    title: 'Saturday Jog',
    description: '7:00 AM / 8:00 AM outdoor run',
    category: TaskCategory.FITNESS,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [6],
    time: '07:00',
    color: 'bg-lime-100 border-lime-200 text-lime-800 dark:text-lime-200'
  },
  {
    id: 'w-smoothie',
    title: 'Banana Smoothie',
    description: 'Saturday nutritional boost',
    category: TaskCategory.HEALTH,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [6],
    color: 'bg-yellow-50 border-yellow-100 text-yellow-700 dark:text-yellow-200'
  },
  {
    id: 'w-banana',
    title: 'Eat Banana',
    description: 'Sunday snack',
    category: TaskCategory.HEALTH,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [0],
    color: 'bg-yellow-100 border-yellow-200 text-yellow-800 dark:text-yellow-200'
  },
  {
    id: 'w-haircut',
    title: 'Get Haircut',
    description: 'Friday or Saturday grooming',
    category: TaskCategory.GROOMING,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [5, 6],
    color: 'bg-rose-100 border-rose-200 text-rose-800 dark:text-rose-200'
  },
  {
    id: 'w-save',
    title: 'Weekly Savings',
    description: 'Save 4k-5k Naira',
    category: TaskCategory.FINANCIAL,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    color: 'bg-green-100 border-green-200 text-green-800 dark:text-green-200'
  },

  // BIWEEKLY
  {
    id: 'bw-water',
    title: 'Buy Water',
    description: 'Restock room water supply',
    category: TaskCategory.HOUSEHOLD,
    frequency: TaskFrequency.BIWEEKLY,
    color: 'bg-sky-100 border-sky-200 text-sky-800 dark:text-sky-200'
  },
  {
    id: 'bw-wash',
    title: 'Wash & Iron',
    description: 'Laundry day for the fortnight',
    category: TaskCategory.HOUSEHOLD,
    frequency: TaskFrequency.BIWEEKLY,
    color: 'bg-stone-100 border-stone-200 text-stone-800 dark:text-stone-200'
  },

  // MONTHLY
  {
    id: 'm-save',
    title: 'Monthly Goal',
    description: 'Total saved > 15,000 Naira',
    category: TaskCategory.FINANCIAL,
    frequency: TaskFrequency.MONTHLY,
    color: 'bg-green-200 border-green-300 text-green-900 dark:text-green-100'
  },
  {
    id: 'm-fragrance',
    title: 'New Fragrance',
    description: 'Budget 10k for new set',
    category: TaskCategory.GROOMING,
    frequency: TaskFrequency.MONTHLY,
    color: 'bg-fuchsia-100 border-fuchsia-200 text-fuchsia-800 dark:text-fuchsia-200'
  }
];
