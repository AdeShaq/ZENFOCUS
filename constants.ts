
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
    color: 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
  },
  {
    id: 'd-2',
    title: 'Morning Prayer',
    description: '6:00 AM - 6:15 AM: Start with gratitude',
    category: TaskCategory.SPIRITUAL,
    frequency: TaskFrequency.DAILY,
    time: '06:00',
    color: 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20'
  },
  {
    id: 'd-3',
    title: 'Pushup Workout',
    description: '6:15 AM - 6:30 AM: 50-80 pushups',
    category: TaskCategory.MY_WORKOUT,
    frequency: TaskFrequency.DAILY,
    time: '06:15',
    color: 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20'
  },
  {
    id: 'd-plan',
    title: 'Plan the Day',
    description: '6:30 AM - 7:00 AM: Focus on priorities',
    category: TaskCategory.PRODUCTIVITY,
    frequency: TaskFrequency.DAILY,
    time: '06:30',
    color: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
  },
  {
    id: 'd-god',
    title: 'Time with God',
    description: '7:00 AM - 7:30 AM: Quiet reflection',
    category: TaskCategory.SPIRITUAL,
    frequency: TaskFrequency.DAILY,
    time: '07:00',
    color: 'bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-600/20'
  },
  // Pushups Split into Evening
  {
    id: 'd-pushups-1',
    title: 'Pushups & Core',
    description: '7:00 PM: Second set of 50',
    category: TaskCategory.MY_WORKOUT,
    frequency: TaskFrequency.DAILY,
    time: '19:00',
    color: 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20'
  },
  {
    id: 'd-pushups-2',
    title: 'Pushups Intensity',
    description: '8:00 PM: Third set to failure',
    category: TaskCategory.MY_WORKOUT,
    frequency: TaskFrequency.DAILY,
    time: '20:00',
    color: 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20'
  },
  {
    id: 'd-read',
    title: 'Journaling & Reading',
    description: '10:00 PM: Bible or book study',
    category: TaskCategory.SPIRITUAL,
    frequency: TaskFrequency.DAILY,
    time: '22:00',
    color: 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
  },
  {
    id: 'd-sleep',
    title: 'Sleep',
    description: '11:00 PM: Rest for recovery',
    category: TaskCategory.HEALTH,
    frequency: TaskFrequency.DAILY,
    time: '23:00',
    color: 'bg-slate-700 border-slate-600 text-slate-100 shadow-lg shadow-slate-700/20'
  },

  // WEEKLY
  {
    id: 'w-gym-tue',
    title: 'Gym Session',
    description: 'Tuesday intense workout',
    category: TaskCategory.MY_WORKOUT,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [2],
    color: 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20'
  },
  {
    id: 'w-gym-thu',
    title: 'Gym Session',
    description: 'Thursday intense workout',
    category: TaskCategory.MY_WORKOUT,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [4],
    color: 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20'
  },
  {
    id: 'w-gym-fri',
    title: 'Gym Session',
    description: 'Friday intense workout',
    category: TaskCategory.MY_WORKOUT,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [5],
    color: 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20'
  },
  {
    id: 'w-calls',
    title: 'Call People',
    description: 'Maintain relationships (Tue-Thu)',
    category: TaskCategory.PRODUCTIVITY,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [2, 3, 4],
    color: 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20'
  },
  {
    id: 'w-jog',
    title: 'Saturday Jog',
    description: '7:00 AM / 8:00 AM outdoor run',
    category: TaskCategory.MY_WORKOUT,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [6],
    time: '07:00',
    color: 'bg-lime-600 border-lime-500 text-white shadow-lg shadow-lime-600/20'
  },
  {
    id: 'w-smoothie',
    title: 'Banana Smoothie',
    description: 'Saturday nutritional boost',
    category: TaskCategory.HEALTH,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [6],
    color: 'bg-yellow-500 border-yellow-400 text-white shadow-lg shadow-yellow-500/20'
  },
  {
    id: 'w-banana',
    title: 'Eat Banana',
    description: 'Sunday snack',
    category: TaskCategory.HEALTH,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [0],
    color: 'bg-yellow-500 border-yellow-400 text-white shadow-lg shadow-yellow-500/20'
  },
  {
    id: 'w-haircut',
    title: 'Get Haircut',
    description: 'Friday or Saturday grooming',
    category: TaskCategory.GROOMING,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [5, 6],
    color: 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/20'
  },
  {
    id: 'w-save',
    title: 'Weekly Savings',
    description: 'Save 4k-5k Naira',
    category: TaskCategory.FINANCIAL,
    frequency: TaskFrequency.WEEKLY,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    color: 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-600/20'
  },

  // BIWEEKLY
  {
    id: 'bw-water',
    title: 'Buy Water',
    description: 'Restock room water supply',
    category: TaskCategory.HOUSEHOLD,
    frequency: TaskFrequency.BIWEEKLY,
    color: 'bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-600/20'
  },
  {
    id: 'bw-wash',
    title: 'Wash & Iron',
    description: 'Laundry day for the fortnight',
    category: TaskCategory.HOUSEHOLD,
    frequency: TaskFrequency.BIWEEKLY,
    color: 'bg-stone-600 border-stone-500 text-white shadow-lg shadow-stone-600/20'
  },

  // MONTHLY
  {
    id: 'm-save',
    title: 'Monthly Goal',
    description: 'Total saved > 15,000 Naira',
    category: TaskCategory.FINANCIAL,
    frequency: TaskFrequency.MONTHLY,
    color: 'bg-green-700 border-green-600 text-white shadow-lg shadow-green-700/20'
  },
  {
    id: 'm-fragrance',
    title: 'New Fragrance',
    description: 'Budget 10k for new set',
    category: TaskCategory.GROOMING,
    frequency: TaskFrequency.MONTHLY,
    color: 'bg-fuchsia-700 border-fuchsia-600 text-white shadow-lg shadow-fuchsia-700/20'
  }
];
