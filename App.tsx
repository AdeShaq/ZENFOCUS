
import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutGrid,
  Calendar as CalendarIcon,
  Bell,
  TrendingUp,
  CheckCircle2,
  ListTodo,
  Sun,
  Moon,
  Timer,
  FileText,
  Wallet
} from 'lucide-react';
import { format, parse, differenceInSeconds, isAfter, startOfToday, addDays } from 'date-fns';
import { CalendarStrip } from './components/CalendarStrip';
import { TaskCard } from './components/TaskCard';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { NotificationManager } from './components/NotificationManager';
import { NotesView } from './components/NotesView';
import { FinancesView } from './components/FinancesView';
import { filterTasksForDate, formatDateKey, requestNotificationPermission, sendNotification } from './utils';
import { UserProgress, TaskCategory, TaskFrequency, TaskDefinition, Note, FinanceEntry } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { APRIL_2026_TASKS, APRIL_2026_FINANCES, INITIAL_NOTES } from './data/april2026';

type Tab = 'Today' | 'Planner' | 'Notes' | 'Finances' | 'Stats';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>('Today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('zenfocus_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  // Storage Hooks
  const [tasks, setTasks] = useLocalStorage<TaskDefinition[]>('zenfocus_tasks', APRIL_2026_TASKS);
  const [finances, setFinances] = useLocalStorage<FinanceEntry[]>('zenfocus_finances', APRIL_2026_FINANCES);
  const [notes, setNotes] = useLocalStorage<Note[]>('zenfocus_notes', INITIAL_NOTES);
  const [progress, setProgress] = useLocalStorage<UserProgress>('zenfocus_progress', { completedTaskIds: {}, missedTaskReasons: {}, eodReviews: {} });

  // Track sent notifications
  const [sentNotifications] = useState<Set<string>>(new Set());

  // Real-time clock update (every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dark Mode side effect - Force class on <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('zenfocus_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('zenfocus_theme', 'light');
    }
  }, [isDarkMode]);

  // Alarm/Notification Logic
  useEffect(() => {
    requestNotificationPermission();

      const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHHmm = format(now, 'HH:mm');
      const todayDateKey = formatDateKey(now);

      const todayTasks = filterTasksForDate(tasks, now);
      const tasksToNotify = todayTasks.filter(t => t.time === currentHHmm);

      tasksToNotify.forEach(task => {
        const notifId = `${todayDateKey}-${task.id}-${currentHHmm}`;
        if (!sentNotifications.has(notifId)) {
          sendNotification(
            `Xeno: ${task.title}`,
            `It's ${format(now, 'hh:mm a')}. Time for: ${task.description}`
          );
          sentNotifications.add(notifId);
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [sentNotifications]);

  const dateKey = formatDateKey(selectedDate);

  const todaysTasks = useMemo(() => {
    const filtered = filterTasksForDate(tasks, selectedDate);
    if (activeCategory === 'All') return filtered;
    return filtered.filter(t => t.category === activeCategory);
  }, [selectedDate, activeCategory, tasks]);

  const completedToday = progress.completedTaskIds[dateKey] || [];
  const totalTasksTodayCount = filterTasksForDate(tasks, selectedDate).length;
  const completionPercentage = totalTasksTodayCount > 0
    ? Math.round((completedToday.length / totalTasksTodayCount) * 100)
    : 0;

  // Next Task Countdown Logic
  const nextTaskInfo = useMemo(() => {
    const today = startOfToday();
    const tasksWithTime = filterTasksForDate(tasks, currentTime)
      .filter(t => t.time)
      .map(t => ({
        ...t,
        date: parse(t.time!, 'HH:mm', today)
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const upcoming = tasksWithTime.find(t => isAfter(t.date, currentTime));

    if (upcoming) {
      const diff = differenceInSeconds(upcoming.date, currentTime);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      return {
        task: upcoming,
        countdown: `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`,
        isSoon: diff < 300 // within 5 mins
      };
    }
    return null;
  }, [currentTime]);

  const toggleTask = (taskId: string) => {
    setProgress(prev => {
      const current = prev.completedTaskIds[dateKey] || [];
      const isAlreadyCompleted = current.includes(taskId);
      let nextCompleted = isAlreadyCompleted
        ? current.filter(id => id !== taskId)
        : [...current, taskId];

      return {
        ...prev,
        completedTaskIds: { ...prev.completedTaskIds, [dateKey]: nextCompleted }
      };
    });
  };

  const categories = ['All', ...Object.values(TaskCategory)];

  const stats = useMemo(() => {
    const allCompletedCount = Object.values(progress.completedTaskIds).flat().length;
    const daysTracked = Object.keys(progress.completedTaskIds).length;
    return {
      allCompletedCount,
      daysTracked,
      consistency: daysTracked > 0 ? Math.min(100, Math.round((allCompletedCount / (daysTracked * 5)) * 100)) : 0
    };
  }, [progress]);

  const renderToday = () => (
    <>
      <header className="px-6 pt-10 pb-4 bg-white dark:bg-slate-900 transition-colors duration-300 rounded-b-[3rem] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight dark:text-white">Hi, Xeno 👋</h1>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-widest mt-0.5">
              {format(currentTime, 'EEEE, MMM do')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Theme"
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-95 shadow-inner"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              aria-label="Enable Notifications & Test Alarm"
              onClick={() => {
                import('./components/NotificationManager').then(({ triggerAlarm }) => {
                  if ('Notification' in window && Notification.permission !== 'granted') {
                    Notification.requestPermission().then(permission => {
                      if (permission === 'granted') {
                        triggerAlarm('Notifications Active', 'Alarms are now enabled and tested!');
                      }
                    });
                  } else {
                    triggerAlarm('Alarm Test', 'This is a test of the notification sound.');
                  }
                });
              }}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 active:scale-95 transition-all shadow-inner hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Bell size={20} />
            </button>
            <button
              aria-label="Profile"
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden active:scale-95 transition-all shadow-inner border border-black/5 dark:border-white/5"
            >
              <img src="https://picsum.photos/seed/xeno/100" alt="Avatar" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tighter dark:text-slate-100">
              {format(currentTime, 'hh:mm')}
              <span className="text-sm font-bold opacity-40 ml-1 uppercase">{format(currentTime, 'a')}</span>
            </span>
            <span className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400 opacity-50 w-6">
              :{format(currentTime, 'ss')}
            </span>
          </div>

          {nextTaskInfo && (
            <div className={`flex flex-col items-center justify-center gap-1 px-6 py-4 rounded-3xl border shadow-lg transition-all transform hover:scale-105 ${nextTaskInfo.isSoon
              ? 'bg-gradient-to-br from-rose-500 to-rose-600 border-rose-400 text-white animate-pulse shadow-rose-500/30'
              : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <Timer size={18} className={nextTaskInfo.isSoon ? 'text-white' : 'text-indigo-500'} />
                <span className={`text-xs font-black uppercase tracking-widest ${nextTaskInfo.isSoon ? 'text-white/90' : 'text-slate-400 dark:text-slate-500'}`}>
                  Next Task
                </span>
              </div>
              <span className={`text-3xl font-black tracking-tighter ${nextTaskInfo.isSoon ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                {nextTaskInfo.countdown}
              </span>
              <span className={`text-xs font-medium max-w-[150px] truncate ${nextTaskInfo.isSoon ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                {nextTaskInfo.task.title}
              </span>
            </div>
          )}
        </div>

        <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar pb-32">
        <div className="mb-8 p-6 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-900/10 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-semibold mb-1">Your Daily Progress</h2>
            <p className="text-xs opacity-80 mb-4">{completedToday.length} of {totalTasksTodayCount} tasks completed</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-1000 ease-in-out rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm font-bold">{completionPercentage}%</span>
            </div>
          </div>
          <TrendingUp className="absolute bottom-[-10px] right-[-10px] text-white opacity-10 w-24 h-24 rotate-12" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl whitespace-nowrap text-xs font-bold transition-all duration-200 border ${activeCategory === cat
                ? 'bg-slate-900 dark:bg-indigo-500 text-white border-transparent shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-slate-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">Today's Goals</h3>
            <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">
              {todaysTasks.length} Tasks
            </span>
          </div>
          {todaysTasks.length > 0 ? (
            todaysTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                isCompleted={completedToday.includes(task.id)}
                onToggle={toggleTask}
              />
            ))
          ) : (
            <div className="text-center py-12 px-6 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <CalendarIcon size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Nothing scheduled for this day!</p>
            </div>
          )}
        </div>

        {/* EOD Review Section */}
        {todaysTasks.length > 0 && currentTab === 'Today' && (
          <div className="mt-12 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-black/5 dark:border-slate-700/50 shadow-sm">
            <h3 className="font-black text-xl mb-4 dark:text-white flex items-center gap-2">
              <Moon size={20} className="text-indigo-500" /> End of Day Review
            </h3>
            
            <div className="space-y-4 mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Missed Tasks Tracker</p>
              {todaysTasks.filter(t => !completedToday.includes(t.id)).map(task => {
                const reason = progress.missedTaskReasons?.[dateKey]?.[task.id] || '';
                return (
                  <div key={task.id} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 truncate px-1">✕ {task.title}</div>
                    <input 
                      type="text"
                      placeholder="Reason for missing this?"
                      value={reason}
                      onChange={e => setProgress(prev => ({
                        ...prev,
                        missedTaskReasons: {
                          ...prev.missedTaskReasons,
                          [dateKey]: {
                            ...(prev.missedTaskReasons?.[dateKey] || {}),
                            [task.id]: e.target.value
                          }
                        }
                      }))}
                      className="w-full bg-white dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                );
              })}
              {todaysTasks.filter(t => !completedToday.includes(t.id)).length === 0 && (
                <div className="text-sm font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                  🎉 All tasks completed today! Amazing job!
                </div>
              )}
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Daily Summary</p>
            <textarea
              placeholder="How did today go?"
              value={progress.eodReviews?.[dateKey] || ''}
              onChange={e => setProgress(prev => ({
                ...prev,
                eodReviews: { ...prev.eodReviews, [dateKey]: e.target.value }
              }))}
              className="w-full h-24 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>
        )}
      </main>
    </>
  );

  const renderPlanner = () => (
    <main className="flex-1 overflow-y-auto px-6 pt-12 no-scrollbar pb-32">
      <h1 className="text-3xl font-black mb-1 dark:text-white tracking-tight">Task Planner</h1>
      <p className="text-slate-400 dark:text-slate-500 mb-8 font-medium text-sm">Organize your long-term success</p>

      {/* Weekly Timetable */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-sm">
            <CalendarIcon size={18} />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Weekly Classes</h2>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => {
            const dayTasks = tasks.filter(t => t.category === TaskCategory.ACADEMICS && t.daysOfWeek?.includes(idx + 1)).sort((a,b) => (a.time || '').localeCompare(b.time || ''));
            if (dayTasks.length === 0) return null;
            return (
              <div key={day} className="min-w-[180px] bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-black/5 dark:border-slate-700/50 transition-all hover:scale-[1.02]">
                <h3 className="font-black text-slate-400 mb-3 uppercase tracking-widest text-xs">{day}</h3>
                <div className="space-y-2">
                  {dayTasks.map(t => (
                    <div key={t.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                      <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 mb-0.5">{t.time}</div>
                      <div className="font-bold text-sm leading-tight text-slate-800 dark:text-white mb-1">{t.title}</div>
                      <div className="text-[10px] font-medium text-slate-500 line-clamp-2">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Special Section for My Workout */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-2xl bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 flex items-center justify-center shadow-sm">
            <TrendingUp size={18} />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">My Workout</h2>
        </div>
        <div className="space-y-3">
          {tasks.filter(t => t.category === TaskCategory.MY_WORKOUT).map(task => (
            <div key={task.id} className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
              <div className={`w-1.5 h-10 rounded-full ${task.color.split(' ')[0]}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{task.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{task.frequency}</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Standard Sections (excluding My Workout) */}
      {Object.values(TaskFrequency).map(freq => {
        const freqTasks = tasks.filter(t => t.frequency === freq && t.category !== TaskCategory.MY_WORKOUT);
        if (freqTasks.length === 0) return null;

        return (
          <section key={freq} className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shadow-sm">
                <ListTodo size={18} />
              </div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 capitalize">{freq.toLowerCase()} Habits</h2>
            </div>
            <div className="space-y-3">
              {freqTasks.map(task => (
                <div key={task.id} className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                  <div className={`w-1.5 h-10 rounded-full ${task.color.split(' ')[0]}`} />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{task.title}</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1">{task.description}</p>
                  </div>
                  <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    {task.category}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );

  const renderStats = () => (
    <main className="flex-1 overflow-y-auto px-6 pt-12 no-scrollbar pb-32">
      <h1 className="text-3xl font-black mb-1 dark:text-white tracking-tight">Performance</h1>
      <p className="text-slate-400 dark:text-slate-500 mb-8 font-medium text-sm">Your journey tracked in data</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle2 size={24} />
          </div>
          <span className="text-3xl font-black block dark:text-white tracking-tighter">{stats.allCompletedCount}</span>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Done</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <span className="text-3xl font-black block dark:text-white tracking-tighter">{stats.consistency}%</span>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Consistency</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm mb-8 transition-all">
        <h3 className="font-black text-xl mb-6 dark:text-white tracking-tight">Activity Insights</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">Days Tracked</span>
            <span className="font-black text-indigo-600 dark:text-indigo-400">{stats.daysTracked} days</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-indigo-500 transition-all duration-1000"
              style={{ width: `${Math.min(100, stats.daysTracked * 5)}%` }}
            />
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed italic border-l-4 border-indigo-200 dark:border-indigo-800 pl-4 py-1">
            "The secret of your future is hidden in your daily routine."
          </p>
        </div>
      </div>
    </main>
  );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F2F2F7] dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {currentTab === 'Today' && renderToday()}
      {currentTab === 'Planner' && renderPlanner()}
      {currentTab === 'Notes' && <NotesView notes={notes} setNotes={setNotes} />}
      {currentTab === 'Finances' && <FinancesView finances={finances} setFinances={setFinances} />}
      {currentTab === 'Stats' && renderStats()}

      <PWAInstallPrompt />
      <NotificationManager />

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800/50 px-2 sm:px-6 py-4 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentTab('Today')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentTab === 'Today' ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400 dark:text-slate-600'}`}
          >
            <LayoutGrid size={22} className={currentTab === 'Today' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Today</span>
          </button>
          <button
            onClick={() => setCurrentTab('Planner')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentTab === 'Planner' ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400 dark:text-slate-600'}`}
          >
            <CalendarIcon size={22} className={currentTab === 'Planner' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Planner</span>
          </button>
          <button
            onClick={() => setCurrentTab('Notes')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentTab === 'Notes' ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400 dark:text-slate-600'}`}
          >
            <FileText size={22} className={currentTab === 'Notes' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Notes</span>
          </button>
          <button
            onClick={() => setCurrentTab('Finances')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentTab === 'Finances' ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400 dark:text-slate-600'}`}
          >
            <Wallet size={22} className={currentTab === 'Finances' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Finances</span>
          </button>
          <button
            onClick={() => setCurrentTab('Stats')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentTab === 'Stats' ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400 dark:text-slate-600'}`}
          >
            <TrendingUp size={22} className={currentTab === 'Stats' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
