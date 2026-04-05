import { TaskCategory, TaskFrequency, TaskDefinition, FinanceEntry, Note } from '../types';

export const APRIL_2026_TASKS: TaskDefinition[] = [
  // Daily
  { id: 'a26-d-wake', title: 'Wake Up', description: 'Rise and shine at 6:00 AM', category: TaskCategory.PRODUCTIVITY, frequency: TaskFrequency.DAILY, time: '06:00', color: 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' },
  { id: 'a26-d-pray', title: 'Bible Study & Prayers', description: 'Evening devotion', category: TaskCategory.SPIRITUAL, frequency: TaskFrequency.DAILY, time: '19:00', color: 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20' },
  { id: 'a26-d-sleep', title: 'Sleep', description: 'Rest for recovery', category: TaskCategory.HEALTH, frequency: TaskFrequency.DAILY, time: '23:00', color: 'bg-slate-700 border-slate-600 text-slate-100 shadow-lg shadow-slate-700/20' },
  
  // Weekly structure from prompt
  // Mon
  { id: 'a26-w-fic', title: 'FIC Class', description: 'Morning class', category: TaskCategory.ACADEMICS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [1], color: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' },
  // Tue
  { id: 'a26-w-csc472', title: 'CSC 472', description: '10am-12pm class (maybe)', category: TaskCategory.ACADEMICS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [2], time: '10:00', color: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' },
  { id: 'a26-w-csc478', title: 'CSC 478', description: '1pm-3pm class', category: TaskCategory.ACADEMICS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [2], time: '13:00', color: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' },
  { id: 'a26-w-csc452-tue', title: 'CSC 452', description: '3pm-5pm class', category: TaskCategory.ACADEMICS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [2], time: '15:00', color: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' },
  // Wed
  { id: 'a26-w-csc472prac', title: 'CSC 472 Practical', description: '1pm-2pm', category: TaskCategory.ACADEMICS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [3], time: '13:00', color: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' },
  { id: 'a26-w-gst310', title: 'GST 310', description: '3pm-4pm', category: TaskCategory.ACADEMICS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [3], time: '15:00', color: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' },
  { id: 'a26-w-git', title: 'GIT', description: '4pm-5pm', category: TaskCategory.ACADEMICS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [3], time: '16:00', color: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' },
  // Thu
  { id: 'a26-w-csc478thu', title: 'CSC 478 & CSC 452', description: '1pm-3pm OR 2pm-4pm (chaotic)', category: TaskCategory.ACADEMICS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [4], time: '13:00', color: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' },
  
  // Workouts
  { id: 'a26-w-workout-mwtf', title: 'Afternoon Workout', description: 'Mon/Wed/Thu/Fri (pick 3-4)', category: TaskCategory.MY_WORKOUT, frequency: TaskFrequency.WEEKLY, daysOfWeek: [1, 3, 4, 5], time: '17:00', color: 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20' },
  { id: 'a26-w-jog', title: 'Jogging/Cardio', description: 'Saturday morning run', category: TaskCategory.MY_WORKOUT, frequency: TaskFrequency.WEEKLY, daysOfWeek: [6], time: '07:00', color: 'bg-lime-600 border-lime-500 text-white shadow-lg shadow-lime-600/20' },

  // Nifemi Time
  { id: 'a26-w-nifemi-wd', title: 'Nifemi Time', description: 'Evening quality time', category: TaskCategory.RELATIONSHIPS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [1, 4, 5], time: '20:00', color: 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/20' },
  { id: 'a26-w-nifemi-we', title: 'Nifemi Time', description: 'Weekend quality time', category: TaskCategory.RELATIONSHIPS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [6], time: '15:00', color: 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/20' },
  { id: 'a26-w-nifemi-sun', title: 'Nifemi Time', description: 'Sunday evening', category: TaskCategory.RELATIONSHIPS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [0], time: '21:00', color: 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/20' },

  // Family Calls
  { id: 'a26-w-family', title: 'Family Call', description: 'Call parents/siblings', category: TaskCategory.RELATIONSHIPS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [3, 6], time: '18:00', color: 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20' },

  // Church
  { id: 'a26-w-church', title: 'Church Service', description: 'Morning until 11am/12pm', category: TaskCategory.SPIRITUAL, frequency: TaskFrequency.WEEKLY, daysOfWeek: [0], time: '08:00', color: 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' },
  { id: 'a26-w-fellowship', title: 'Fellowship', description: '8pm-9pm', category: TaskCategory.SPIRITUAL, frequency: TaskFrequency.WEEKLY, daysOfWeek: [6, 0], time: '20:00', color: 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' },

  // Read
  { id: 'a26-w-read', title: 'Read Book & Journal', description: 'Friday afternoon', category: TaskCategory.PRODUCTIVITY, frequency: TaskFrequency.WEEKLY, daysOfWeek: [5], time: '16:00', color: 'bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-600/20' },

  // Friends Outing
  { id: 'a26-w-friends', title: 'Possible Friend Outing', description: 'Budget up to 10k monthly', category: TaskCategory.RELATIONSHIPS, frequency: TaskFrequency.WEEKLY, daysOfWeek: [5, 6, 0], time: '15:00', color: 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20' },
];

export const APRIL_2026_FINANCES: FinanceEntry[] = [
  // Income
  { id: 'fin-inc-1', title: 'Weekly Allowance (Apr 6)', amount: 25000, type: 'income', date: '2026-04-06', status: 'Confirmed' },
  { id: 'fin-inc-2', title: 'Parents (Loan coverage)', amount: 40000, type: 'income', date: '2026-04-06', status: 'Expected' },
  { id: 'fin-inc-3', title: 'RUNACOS Design Payment', amount: 65000, type: 'income', date: '2026-04-08', status: 'Expected' },
  { id: 'fin-inc-4', title: 'Weekly Allowance (Apr 13)', amount: 25000, type: 'income', date: '2026-04-13', status: 'Confirmed' },
  { id: 'fin-inc-5', title: 'Bi-monthly Allowance', amount: 45000, type: 'income', date: '2026-04-15', status: 'Confirmed' },
  { id: 'fin-inc-6', title: 'Weekly Allowance (Apr 20)', amount: 25000, type: 'income', date: '2026-04-20', status: 'Confirmed' },
  { id: 'fin-inc-7', title: 'Apparel Job Balance', amount: 25000, type: 'income', date: '2026-04-24', status: 'Pending', notes: 'Keep separate - PRIMARY SAVINGS!' },
  { id: 'fin-inc-8', title: 'Weekly Allowance (Apr 27)', amount: 25000, type: 'income', date: '2026-04-27', status: 'Confirmed' },

  // Debts
  { id: 'fin-deb-1', title: 'Luwa Cafe', amount: 8000, type: 'debt', date: '2026-04-05', status: 'Paid', notes: 'Got this already' },
  { id: 'fin-deb-2', title: 'Palmpay Loan', amount: 6500, type: 'debt', date: '2026-04-06', status: 'Expected' },
  { id: 'fin-deb-3', title: 'EaseMoni/Okash', amount: 43000, type: 'debt', date: '2026-04-06', status: 'Expected' },
  { id: 'fin-deb-4', title: 'Branch Loan', amount: 20000, type: 'debt', date: '2026-04-15', status: 'Expected' },
  { id: 'fin-deb-5', title: 'Dozie', amount: 5000, type: 'debt', date: '2026-05-01', status: 'Pending', notes: 'Deferred to May' },
  { id: 'fin-deb-6', title: 'Luwa Cafe (Balance)', amount: 5300, type: 'debt', date: '2026-05-01', status: 'Pending', notes: 'Deferred to May' },

  // Purchases & Expenses
  { id: 'fin-exp-1', title: 'Weekly Data', amount: 4000, type: 'expense', date: '2026-04-06', status: 'Expected' },
  { id: 'fin-exp-2', title: '2 Joggers', amount: 20000, type: 'expense', date: '2026-04-08', status: 'Expected', notes: 'From RUNACOS' },
  { id: 'fin-exp-3', title: 'Black Polo', amount: 10000, type: 'expense', date: '2026-04-08', status: 'Expected', notes: 'From RUNACOS' },
  { id: 'fin-exp-4', title: 'Special Someone Gift', amount: 15000, type: 'expense', date: '2026-04-08', status: 'Expected', notes: 'From RUNACOS' },
  { id: 'fin-exp-5', title: 'Goodness Drycleaning', amount: 2500, type: 'expense', date: '2026-04-08', status: 'Expected', notes: 'From RUNACOS' },
  
  { id: 'fin-exp-6', title: 'Weekly Data', amount: 4000, type: 'expense', date: '2026-04-13', status: 'Expected' },
  { id: 'fin-exp-7', title: 'Perfumes', amount: 15000, type: 'expense', date: '2026-04-15', status: 'Expected', notes: 'Monthly' },
  { id: 'fin-exp-8', title: 'Wash Clothes', amount: 2000, type: 'expense', date: '2026-04-15', status: 'Expected', notes: 'Bi-weekly' },
  { id: 'fin-exp-9', title: 'Dryclean', amount: 3000, type: 'expense', date: '2026-04-15', status: 'Expected', notes: 'Bi-weekly' },
  { id: 'fin-exp-10', title: '6 Bags of Water', amount: 3000, type: 'expense', date: '2026-04-15', status: 'Expected', notes: 'Bi-weekly' },
  
  { id: 'fin-exp-11', title: 'Weekly Data', amount: 4000, type: 'expense', date: '2026-04-20', status: 'Expected' },
  { id: 'fin-exp-12', title: 'Weekly Data', amount: 4000, type: 'expense', date: '2026-04-27', status: 'Expected' },
  { id: 'fin-exp-13', title: 'Friends/Date', amount: 10000, type: 'expense', date: '2026-04-27', status: 'Expected', notes: 'Monthly' },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'April 2026 Priorities',
    content: 'CRITICAL SUCCESS FACTORS\n\nMUST DO:\n- Keep daily spending at ₦4,000 maximum\n- Protect apparel job ₦25k - DO NOT TOUCH\n- Save RUNACOS remainder (₦12.5-22.5k)\n- Pay all debts on time\n- Complete apparel job within 2 weeks\n\nWATCH OUT FOR:\n- Week 1 is very tight (only ₦11.5k after deductions)\n- Week 4 has ₦5k shortfall if spending ₦4k/day\n- Friend outings can blow budget - stick to ₦10k total',
    dateCreated: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  }
];
