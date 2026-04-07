
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
  Wallet,
  MessageCircle
} from 'lucide-react';
import { format, parse, differenceInSeconds, isAfter, startOfToday, addDays } from 'date-fns';
import { CalendarStrip } from './components/CalendarStrip';
import { TaskCard } from './components/TaskCard';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { NotificationManager } from './components/NotificationManager';
import { NotesView } from './components/NotesView';
import { FinancesView } from './components/FinancesView';
import { WorkoutView } from './components/WorkoutView';
import { useHourlyCheckIn } from './components/HourlyCheckIn';
import { VerseModal } from './components/VerseModal';
import { filterTasksForDate, formatDateKey, requestNotificationPermission, sendNotification, formatTime12Hour } from './utils';
import { UserProgress, TaskCategory, TaskFrequency, TaskDefinition, Note, FinanceEntry } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { APRIL_2026_TASKS, APRIL_2026_FINANCES, INITIAL_NOTES } from './data/april2026';

type Tab = 'Today' | 'Planner' | 'Notes' | 'Finances' | 'Stats';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>('Today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [plannerSubTab, setPlannerSubTab] = useState<'schedule' | 'workouts'>('schedule');
  const [showVerse, setShowVerse] = useState(false);
  const [activePlannerSection, setActivePlannerSection] = useState<string | null>('classes');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('zenfocus_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [plannerEditingId, setPlannerEditingId] = useState<string | null>(null);
  const [plannerEditTask, setPlannerEditTask] = useState<Partial<TaskDefinition>>({});
  
  // Storage Hooks
  const [tasks, setTasks] = useLocalStorage<TaskDefinition[]>('zenfocus_tasks', APRIL_2026_TASKS);
  const [finances, setFinances] = useLocalStorage<FinanceEntry[]>('zenfocus_finances', APRIL_2026_FINANCES);
  const [notes, setNotes] = useLocalStorage<Note[]>('zenfocus_notes', INITIAL_NOTES);
  const [progress, setProgress] = useLocalStorage<UserProgress>('zenfocus_progress', { completedTaskIds: {}, missedTaskReasons: {}, eodReviews: {}, waterSachets: {} });

  // Track sent notifications
  const [sentNotifications] = useState<Set<string>>(new Set());

  // Background Data Synchronizer (Migrations)
  useEffect(() => {
    // Inject Morning Routine Task Document
    setTasks(prev => {
      let isChanged = false;
      let newTasks = [...prev];
      const mrIndex = newTasks.findIndex(t => t.title === 'MORNING ROUTINE');
      const mrDesc = "Thank God for waking up\nRead Psalms 118:24\nDeclaration from notes\nMorning workout session: 50-100 pushups, 100 grips/arm, 2x30 lateral raises, 25 squats\nBath, Plan & Start Day";
      
      if (mrIndex === -1) {
        newTasks.unshift({
          id: "task-morning-routine",
          title: "MORNING ROUTINE",
          description: mrDesc,
          category: TaskCategory.SPIRITUAL,
          frequency: TaskFrequency.DAILY,
          time: "06:00",
          endTime: "08:00",
          color: "bg-amber-500",
        });
        isChanged = true;
      } else if (newTasks[mrIndex].description !== mrDesc) {
        newTasks[mrIndex] = { ...newTasks[mrIndex], description: mrDesc };
        isChanged = true;
      }
      return isChanged ? newTasks : prev;
    });

    // Inject Daily Declarations and Prayer Points
    setNotes(prev => {
      let isChanged = false;
      let newNotes = [...prev];
      
      const hasDeclarations = newNotes.find(n => n.title === 'The DAILY DECLARATIONS');
      if (!hasDeclarations) {
        newNotes.unshift({
          id: `note-declarations`,
          title: 'The DAILY DECLARATIONS',
          content: `<ul>
  <li>I see, I hear, I know and I do God's will</li>
  <li>I am beautifully and wonderfully made</li>
  <li>I am loved by God, by friends, by family, by young and old</li>
  <li>I am favored by God, by friends, by family, by young and old</li>
  <li>I am strengthened by God today</li>
  <li>I enjoy the Wisdom, Guidance and Creativity of God today.</li>
  <li>I succeed in all my endeavors today</li>
  <li>I dont lack ideas and solutions</li>
  <li>I dont fail because God never fails.</li>
</ul>`,
          dateCreated: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          isPinned: true,
          color: '#e2e8f0' // Slate tone
        });
        isChanged = true;
      }

      const hasPrayers = newNotes.find(n => n.title === 'The Daily Prayer Points');
      if (!hasPrayers) {
        newNotes.unshift({
          id: `note-prayers`,
          title: 'The Daily Prayer Points',
          content: `I pray that,
<ul>
  <li>I grow to be better emotionally, physically, spiritually, financially, academically, career wise and be the man she deserves</li>
  <li>My heart desires be changed</li>
  <li>My future be covered and fruitful</li>
  <li>Prayers for Friends & The Resistance</li>
  <li>I let go of every pain and hurt towards Ayomide (and then prayers over her life)</li>
  <li>Prayers for my family (their health, protection, provision and success)</li>
  <li>God's Direction, Voice and Provision in my life, academics, relationships and career.</li>
</ul>`,
          dateCreated: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          isPinned: true,
          color: '#e2e8f0'
        });
        isChanged = true;
      }
      
      return isChanged ? newNotes : prev;
    });
  }, [setTasks, setNotes]);

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
      
      // Bi-hourly Water Reminder
      const isEvenHour = now.getHours() % 2 === 0;
      if (isEvenHour && currentHHmm.endsWith(':00')) {
        const notifId = `${todayDateKey}-water-${now.getHours()}`;
        if (!sentNotifications.has(notifId)) {
          sendNotification(
            `Hydration Time! 💧`,
            `Time to take a sachet of water to hit your 3-5 daily goal!`
          );
          sentNotifications.add(notifId);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [sentNotifications]);

  const dateKey = formatDateKey(selectedDate);
  const completedToday = progress.completedTaskIds?.[dateKey] || [];
  const totalTasksTodayCount = filterTasksForDate(tasks, selectedDate).length;
  const completionPercentage = totalTasksTodayCount > 0
    ? Math.round((completedToday.length / totalTasksTodayCount) * 100)
    : 0;

  const todaysTasks = useMemo(() => {
    const filtered = filterTasksForDate(tasks, selectedDate);
    const filtered2 = activeCategory === 'All' ? filtered : filtered.filter(t => t.category === activeCategory);
    // Hidden when completed, based on user request
    const pending = filtered2.filter(t => !completedToday.includes(t.id));
    return pending;
  }, [selectedDate, activeCategory, tasks, completedToday]);

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

  // Currently doing task (task whose time window includes now)
  const doingNowTask = useMemo(() => {
    const today = startOfToday();
    const allTasks = filterTasksForDate(tasks, currentTime) as Array<TaskDefinition & { endTime?: string }>;
    return allTasks
      .filter(t => t.time && t.endTime)
      .find(t => {
        const start = parse(t.time!, 'HH:mm', today);
        const end = parse(t.endTime!, 'HH:mm', today);
        return currentTime >= start && currentTime <= end;
      });
  }, [currentTime, tasks]);

  // Hourly check-in hook
  const { modal: checkInModal, triggerNow: triggerCheckIn } = useHourlyCheckIn(doingNowTask?.title);

  const toggleTask = (taskId: string) => {
    setProgress(prev => {
      const current = prev.completedTaskIds?.[dateKey] || [];
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
    const allCompletedCount = Object.values(progress.completedTaskIds || {}).flat().length;
    const daysTracked = Object.keys(progress.completedTaskIds || {}).length;
    return {
      allCompletedCount,
      daysTracked,
      consistency: daysTracked > 0 ? Math.min(100, Math.round((allCompletedCount / (daysTracked * 5)) * 100)) : 0
    };
  }, [progress]);

  const renderToday = () => (
    <>
      {checkInModal}
      <header className="px-6 pt-10 pb-4 bg-white dark:bg-[#222244] transition-colors duration-300 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#2D2A26] dark:text-[#F0EDE8]">Hi, Xeno 👋</h1>
            <p className="text-[#9B9590] dark:text-[#7A7580] text-xs font-semibold uppercase tracking-widest mt-0.5">
              {format(currentTime, 'EEEE, MMM do')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Theme"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F0EB] dark:bg-[#2D2A40] text-[#9B9590] dark:text-[#B0A8A0] transition-all active:scale-95"
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
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F0EB] dark:bg-[#2D2A40] text-[#9B9590] dark:text-[#B0A8A0] active:scale-95 transition-all"
            >
              <Bell size={20} />
            </button>
            <button
              aria-label="Hourly Check-In"
              onClick={() => triggerCheckIn()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F0EB] dark:bg-[#2D2A40] text-[#9B9590] dark:text-[#B0A8A0] active:scale-95 transition-all" title="Check-In">
              <MessageCircle size={20} />
            </button>
            <button
              aria-label="Profile"
              className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden active:scale-95 transition-all border-2 border-[#E8833A]/30"
              onClick={() => setShowVerse(true)}
            >
              <img src="https://picsum.photos/seed/xeno/100" alt="Avatar" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tighter text-[#2D2A26] dark:text-[#F0EDE8]">
                {format(currentTime, 'hh:mm')}
                <span className="text-sm font-bold text-[#9B9590] ml-1 uppercase">{format(currentTime, 'a')}</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#E8833A] opacity-50 w-6">
                :{format(currentTime, 'ss')}
              </span>
            </div>
            {doingNowTask ? (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#E8833A] animate-pulse shrink-0" />
                <span className="text-xs font-black text-[#E8833A] truncate max-w-[200px]">
                  Now: {doingNowTask.title}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#D5CFC8] dark:bg-[#4A4560] shrink-0" />
                <span className="text-[11px] font-medium text-[#9B9590] dark:text-[#7A7580]">No active task right now</span>
              </div>
            )}
          </div>

          {nextTaskInfo && (
            <div className={`flex flex-col items-center justify-center gap-1 px-6 py-4 rounded-2xl border transition-all transform hover:scale-105 ${nextTaskInfo.isSoon
              ? 'bg-[#E8833A] border-[#D0722F] text-white animate-pulse shadow-lg shadow-orange-200 dark:shadow-orange-900/30'
              : 'bg-white dark:bg-[#2D2A40] border-[#E8E0D8] dark:border-[#3D3960]'
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <Timer size={18} className={nextTaskInfo.isSoon ? 'text-white' : 'text-[#E8833A]'} />
                <span className={`text-xs font-black uppercase tracking-widest ${nextTaskInfo.isSoon ? 'text-white/90' : 'text-[#9B9590] dark:text-[#7A7580]'}`}>
                  Next Task
                </span>
              </div>
              <span className={`text-3xl font-black tracking-tighter ${nextTaskInfo.isSoon ? 'text-white' : 'text-[#2D2A26] dark:text-[#F0EDE8]'}`}>
                {nextTaskInfo.countdown}
              </span>
              <span className={`text-xs font-medium max-w-[150px] truncate ${nextTaskInfo.isSoon ? 'text-white/80' : 'text-[#9B9590] dark:text-[#7A7580]'}`}>
                {nextTaskInfo.task.title}
              </span>
            </div>
          )}
        </div>

        <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar pb-32">
        {/* Progress Card */}
        <div className="mb-8 p-6 bg-gradient-to-br from-[#E8833A] to-[#D0722F] rounded-[2rem] text-white shadow-lg shadow-orange-100 dark:shadow-orange-900/10 relative overflow-hidden">
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

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-xs font-bold transition-all duration-200 border ${activeCategory === cat
                ? 'bg-[#2D2A26] dark:bg-[#E8833A] text-white border-transparent shadow-md'
                : 'bg-white dark:bg-[#222244] text-[#9B9590] dark:text-[#B0A8A0] border-[#E8E0D8] dark:border-[#333355] hover:border-[#E8833A]/50'
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
            <div className="text-center py-12 px-6 bg-stone-50/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-stone-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <CalendarIcon size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Nothing scheduled for this day!</p>
            </div>
          )}
        </div>
        {/* Water Intake Tracker */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center p-1.5 shadow-sm">
                <span className="text-lg">💧</span>
              </div>
              <div>
                <h3 className="text-slate-800 dark:text-slate-100 font-bold leading-tight">Water Intake</h3>
                <p className="text-[11px] text-slate-400 font-medium">Goal: 3-5 sachets daily</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setProgress(p => ({ ...p, waterSachets: { ...p.waterSachets, [dateKey]: Math.max(0, (p.waterSachets?.[dateKey] || 0) - 1) } }))}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-black hover:bg-stone-200"
              >
                -
              </button>
              <span className="text-xl font-black min-w-[28px] text-center dark:text-white">
                {progress.waterSachets?.[dateKey] || 0}
              </span>
              <button
                onClick={() => setProgress(p => ({ ...p, waterSachets: { ...p.waterSachets, [dateKey]: (p.waterSachets?.[dateKey] || 0) + 1 } }))}
                className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-black shadow-md hover:bg-blue-600 active:scale-95"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => {
              const count = progress.waterSachets?.[dateKey] || 0;
              return (
                <div key={i} className={`flex-1 h-2 rounded-full transition-all ${i <= count ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-stone-200 dark:bg-slate-800'}`} />
              );
            })}
          </div>
        </div>


        {/* End of Day Review — Task-by-Task */}
        <div className="mt-8 pt-8 border-t border-[#E8E0D8] dark:border-[#333355]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-500 flex items-center justify-center p-1.5">
              <FileText />
            </div>
            <div>
              <h3 className="text-[#2D2A26] dark:text-[#F0EDE8] font-bold leading-tight">End of Day Review</h3>
              <p className="text-[11px] text-[#9B9590] font-medium">Uncompleted tasks — tell us why</p>
            </div>
          </div>
          {(() => {
            const allDayTasks = filterTasksForDate(tasks, selectedDate);
            const uncompleted = allDayTasks.filter(t => !completedToday.includes(t.id));
            if (uncompleted.length === 0) {
              return (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-4 text-center">
                  <p className="text-emerald-700 dark:text-emerald-300 text-sm font-bold">🎉 All tasks completed today!</p>
                </div>
              );
            }
            return (
              <div className="space-y-3">
                {uncompleted.map(task => (
                  <div key={task.id} className="bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-2xl p-4 border border-[#E8E0D8] dark:border-[#333355]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-1.5 h-6 rounded-full ${task.color?.split(' ')[0] || 'bg-slate-400'}`} />
                      <p className="text-sm font-bold text-[#2D2A26] dark:text-[#F0EDE8] leading-tight">{task.title}</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Why wasn't this done?"
                      className="w-full bg-white dark:bg-[#222244] border border-[#E8E0D8] dark:border-[#333355] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#E8833A]/30 font-medium text-[#2D2A26] dark:text-[#F0EDE8] placeholder:text-[#9B9590]"
                      value={progress.missedTaskReasons?.[dateKey]?.[task.id] || ''}
                      onChange={e => {
                        setProgress(prev => ({
                          ...prev,
                          missedTaskReasons: {
                            ...(prev.missedTaskReasons || {}),
                            [dateKey]: {
                              ...(prev.missedTaskReasons?.[dateKey] || {}),
                              [task.id]: e.target.value
                            }
                          }
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            );
          })()}
          <textarea
            className="w-full mt-4 bg-[#F5F0EB] dark:bg-[#2D2A40] border border-[#E8E0D8] dark:border-[#333355] rounded-2xl p-4 text-sm font-medium text-[#2D2A26] dark:text-[#F0EDE8] placeholder:text-[#9B9590] outline-none focus:ring-2 focus:ring-[#E8833A]/30 transition-all resize-none"
            rows={3}
            placeholder="Overall reflections — How did today go?"
            value={progress.eodReviews?.[dateKey] || ''}
            onChange={(e) => {
              setProgress(prev => ({
                ...prev,
                eodReviews: {
                  ...(prev.eodReviews || {}),
                  [dateKey]: e.target.value
                }
              }));
            }}
          />
        </div>

      </main>
    </>
  );

  // Render VerseModal outside renderToday so it's accessible from anywhere
  const verseModal = showVerse ? <VerseModal onClose={() => setShowVerse(false)} /> : null;

  const renderPlanner = () => (
    <main className="flex-1 overflow-y-auto px-6 pt-12 no-scrollbar pb-32">
      <h1 className="text-3xl font-black mb-1 text-[#2D2A26] dark:text-[#F0EDE8] tracking-tight">Task Planner</h1>
      <p className="text-[#9B9590] dark:text-[#7A7580] mb-4 font-medium text-sm">Organize your long-term success</p>

      {/* Sub-Tab Toggle */}
      <div className="flex items-center gap-2 mb-8 bg-[#EDE8E2] dark:bg-[#2D2A40] p-1 rounded-full">
        <button 
          onClick={() => setPlannerSubTab('schedule')} 
          className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all ${plannerSubTab === 'schedule' ? 'bg-white dark:bg-[#3D3960] text-[#2D2A26] dark:text-white shadow-sm' : 'text-[#9B9590] dark:text-[#7A7580]'}`}
        >
          📋 Schedule
        </button>
        <button 
          onClick={() => setPlannerSubTab('workouts')} 
          className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all ${plannerSubTab === 'workouts' ? 'bg-white dark:bg-[#3D3960] text-[#2D2A26] dark:text-white shadow-sm' : 'text-[#9B9590] dark:text-[#7A7580]'}`}
        >
          🏋️ Workouts
        </button>
      </div>

      {plannerSubTab === 'workouts' ? (
        <WorkoutView />
      ) : (
      <>
      {/* Quick Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        {[
          { label: '📅 Classes', key: 'classes' },
          { label: '💪 Daily Habits', key: 'DAILY' },
          { label: '🗓 Weekly', key: 'WEEKLY' },
          { label: '🔁 Biweekly', key: 'BIWEEKLY' },
          { label: '📋 Monthly', key: 'MONTHLY' },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setActivePlannerSection(activePlannerSection === item.key ? null : item.key)}
            className={`px-4 py-2 rounded-full text-[11px] font-black whitespace-nowrap border transition-all ${
              activePlannerSection === item.key
                ? 'bg-[#E8833A] text-white border-[#E8833A] shadow-md'
                : 'bg-white dark:bg-[#222244] border-[#E8E0D8] dark:border-[#333355] text-[#9B9590] dark:text-[#B0A8A0] hover:border-[#E8833A]/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {!activePlannerSection && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-[#FDEBD3] dark:bg-[#3D2D1A] rounded-3xl flex items-center justify-center mb-4 text-[#E8833A]">
            <ListTodo size={28} />
          </div>
          <p className="text-[#9B9590] dark:text-[#7A7580] font-semibold text-sm">Select a category above to view &amp; manage tasks</p>
        </div>
      )}

      {/* CLASSES SECTION — Proper Timetable Grid */}
      {activePlannerSection === 'classes' && (() => {
        const classTasks = tasks.filter(t => t.category === TaskCategory.ACADEMICS);
        const startEdit = (t: TaskDefinition) => { setPlannerEditingId(t.id); setPlannerEditTask({ ...t }); };
        const saveEdit = () => {
          if (plannerEditingId) {
            setTasks(prev => prev.map(t => t.id === plannerEditingId ? { ...t, ...plannerEditTask } : t));
            setPlannerEditingId(null);
          }
        };
        const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
        const addTask = () => {
          const id = `task-${Date.now()}`;
          setTasks(prev => [...prev, { id, title: 'New Class', description: '', category: TaskCategory.ACADEMICS, frequency: TaskFrequency.WEEKLY, time: '', daysOfWeek: [], color: 'bg-blue-100' }]);
          startEdit({ id, title: 'New Class', description: '', category: TaskCategory.ACADEMICS, frequency: TaskFrequency.WEEKLY, time: '', daysOfWeek: [], color: 'bg-blue-100' } as TaskDefinition);
        };

        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const dayColors = ['bg-rose-100 dark:bg-rose-900/30 border-l-rose-400', 'bg-sky-100 dark:bg-sky-900/30 border-l-sky-400', 'bg-emerald-100 dark:bg-emerald-900/30 border-l-emerald-400', 'bg-violet-100 dark:bg-violet-900/30 border-l-violet-400', 'bg-amber-100 dark:bg-amber-900/30 border-l-amber-400'];

        return (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#FDEBD3] dark:bg-[#3D2D1A] text-[#E8833A] flex items-center justify-center"><CalendarIcon size={18} /></div>
                <h2 className="text-xl font-black text-[#2D2A26] dark:text-[#F0EDE8]">Weekly Timetable</h2>
              </div>
              <button onClick={addTask} className="px-3 py-1.5 bg-[#E8833A] text-white rounded-full text-[11px] font-black shadow hover:bg-[#D0722F]">+ Add</button>
            </div>

            {/* Edit form overlay */}
            {plannerEditingId && (() => {
              const task = classTasks.find(t => t.id === plannerEditingId);
              if (!task) return null;
              return (
                <div className="bg-white dark:bg-[#222244] p-4 rounded-2xl border-2 border-[#E8833A] shadow-lg mb-4">
                  <input className="w-full mb-2 font-bold text-sm bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-xl px-3 py-2 outline-none text-[#2D2A26] dark:text-[#F0EDE8]" value={plannerEditTask.title || ''} onChange={e => setPlannerEditTask(p => ({ ...p, title: e.target.value }))} placeholder="Title" />
                  <input className="w-full mb-2 text-sm bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-xl px-3 py-2 outline-none text-[#2D2A26] dark:text-[#F0EDE8]" value={plannerEditTask.description || ''} onChange={e => setPlannerEditTask(p => ({ ...p, description: e.target.value }))} placeholder="Description" />
                  <div className="flex gap-2 mb-2">
                    <input type="time" className="flex-1 text-sm bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-xl px-3 py-2 outline-none text-[#2D2A26] dark:text-[#F0EDE8]" value={plannerEditTask.time || ''} onChange={e => setPlannerEditTask(p => ({ ...p, time: e.target.value }))} />
                    <input type="time" className="flex-1 text-sm bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-xl px-3 py-2 outline-none text-[#2D2A26] dark:text-[#F0EDE8]" value={(plannerEditTask as any).endTime || ''} onChange={e => setPlannerEditTask(p => ({ ...p, endTime: e.target.value }))} />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => (
                      <button key={d} onClick={() => setPlannerEditTask(p => { const days = p.daysOfWeek || []; return { ...p, daysOfWeek: days.includes(i+1) ? days.filter(x => x !== i+1) : [...days, i+1] }; })} className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all ${(plannerEditTask.daysOfWeek||[]).includes(i+1) ? 'bg-[#E8833A] text-white' : 'bg-[#EDE8E2] dark:bg-[#2D2A40] text-[#9B9590]'}`}>{d}</button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex-1 py-2 bg-[#E8833A] text-white rounded-xl text-sm font-black">Save</button>
                    <button onClick={() => setPlannerEditingId(null)} className="flex-1 py-2 bg-[#EDE8E2] dark:bg-[#2D2A40] rounded-xl text-sm font-black text-[#2D2A26] dark:text-[#F0EDE8]">Cancel</button>
                  </div>
                </div>
              );
            })()}

            {/* Timetable Grid */}
            <div className="bg-white dark:bg-[#222244] rounded-2xl border border-[#E8E0D8] dark:border-[#333355] overflow-hidden shadow-sm">
              {dayNames.map((dayName, dayIdx) => {
                const dayNum = dayIdx + 1; // 1=Mon...5=Fri
                const dayClasses = classTasks.filter(t => (t.daysOfWeek || []).includes(dayNum));
                return (
                  <div key={dayName} className={`border-b last:border-b-0 border-[#E8E0D8] dark:border-[#333355]`}>
                    <div className="flex items-start">
                      <div className="w-14 py-3 px-2 flex flex-col items-center justify-center shrink-0 border-r border-[#E8E0D8] dark:border-[#333355]">
                        <span className="text-[10px] font-black uppercase text-[#9B9590] dark:text-[#7A7580]">{dayName}</span>
                      </div>
                      <div className="flex-1 py-2 px-2">
                        {dayClasses.length === 0 ? (
                          <p className="text-[11px] text-[#D5CFC8] dark:text-[#4A4560] italic py-1">No classes</p>
                        ) : (
                          <div className="space-y-1.5">
                            {dayClasses.map(task => (
                              <div
                                key={task.id}
                                className={`${dayColors[dayIdx]} border-l-[3px] rounded-lg px-3 py-2 flex items-center justify-between gap-2 group cursor-pointer hover:shadow-sm transition-all`}
                                onClick={() => startEdit(task)}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-[13px] text-[#2D2A26] dark:text-[#F0EDE8] leading-tight truncate">{task.title}</p>
                                  <p className="text-[10px] text-[#9B9590] dark:text-[#B0A8A0] font-medium">
                                    {task.time ? formatTime12Hour(task.time) : ''}
                                    {(task as any).endTime ? ` – ${formatTime12Hour((task as any).endTime)}` : ''}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                  className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black shrink-0"
                                >✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {classTasks.length === 0 && <p className="text-center text-sm text-[#9B9590] py-4 mt-2">No classes yet. Tap + Add to create one.</p>}
          </section>
        );
      })()}

      {/* FREQUENCY SECTIONS */}
      {Object.values(TaskFrequency).filter(freq => activePlannerSection === freq).map(freq => {
        const freqTasks = tasks.filter(t => t.frequency === freq && t.category !== TaskCategory.MY_WORKOUT);
        const startEdit = (t: TaskDefinition) => { setPlannerEditingId(t.id); setPlannerEditTask({ ...t }); };
        const saveEdit = () => {
          if (plannerEditingId) {
            setTasks(prev => prev.map(t => t.id === plannerEditingId ? { ...t, ...plannerEditTask } : t));
            setPlannerEditingId(null);
          }
        };
        const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
        const addTask = () => {
          const id = `task-${Date.now()}`;
          const newTask: TaskDefinition = { id, title: 'New Task', description: '', category: TaskCategory.PRODUCTIVITY, frequency: freq, time: '', color: 'bg-indigo-100' };
          setTasks(prev => [...prev, newTask]);
          startEdit(newTask);
        };
        const COLORS = ['bg-indigo-100', 'bg-emerald-100', 'bg-amber-100', 'bg-rose-100', 'bg-blue-100', 'bg-purple-100', 'bg-orange-100'];
        return (
          <section key={freq} className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#FDEBD3] dark:bg-[#3D2D1A] text-[#E8833A] flex items-center justify-center"><ListTodo size={18} /></div>
                <h2 className="text-xl font-black text-[#2D2A26] dark:text-[#F0EDE8] capitalize">{freq.toLowerCase()} Habits</h2>
              </div>
              <button onClick={addTask} className="px-3 py-1.5 bg-[#E8833A] text-white rounded-full text-[11px] font-black shadow hover:bg-[#D0722F]">+ Add</button>
            </div>
            <div className="space-y-3">
              {freqTasks.map(task => plannerEditingId === task.id ? (
                <div key={task.id} className="bg-white dark:bg-[#222244] p-4 rounded-2xl border-2 border-[#E8833A] shadow-lg">
                  <input className="w-full mb-2 font-bold text-sm bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-xl px-3 py-2 outline-none text-[#2D2A26] dark:text-[#F0EDE8]" value={plannerEditTask.title || ''} onChange={e => setPlannerEditTask(p => ({ ...p, title: e.target.value }))} placeholder="Title" />
                  <input className="w-full mb-2 text-sm bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-xl px-3 py-2 outline-none text-[#2D2A26] dark:text-[#F0EDE8]" value={plannerEditTask.description || ''} onChange={e => setPlannerEditTask(p => ({ ...p, description: e.target.value }))} placeholder="Description" />
                  <div className="flex gap-2 mb-2">
                    <input type="time" className="flex-1 text-sm bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-xl px-3 py-2 outline-none text-[#2D2A26] dark:text-[#F0EDE8]" value={plannerEditTask.time || ''} onChange={e => setPlannerEditTask(p => ({ ...p, time: e.target.value }))} />
                    <select className="flex-1 text-sm bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-xl px-3 py-2 outline-none text-[#2D2A26] dark:text-[#F0EDE8]" value={plannerEditTask.category || TaskCategory.PRODUCTIVITY} onChange={e => setPlannerEditTask(p => ({ ...p, category: e.target.value as TaskCategory }))}>
                      {Object.values(TaskCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setPlannerEditTask(p => ({ ...p, color: c }))} className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${c} ${plannerEditTask.color === c ? 'border-[#E8833A] scale-110' : 'border-transparent'}`} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex-1 py-2 bg-[#E8833A] text-white rounded-xl text-sm font-black">Save</button>
                    <button onClick={() => setPlannerEditingId(null)} className="flex-1 py-2 bg-[#EDE8E2] dark:bg-[#2D2A40] rounded-xl text-sm font-black text-[#2D2A26] dark:text-[#F0EDE8]">Cancel</button>
                  </div>
                </div>
              ) : (
                <div key={task.id} className="bg-white dark:bg-[#222244] p-4 rounded-2xl border border-[#E8E0D8] dark:border-[#333355] shadow-sm flex items-center gap-3">
                  <div className={`w-1.5 h-10 rounded-full ${task.color.split(' ')[0]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#2D2A26] dark:text-[#F0EDE8] text-sm leading-tight truncate">{task.title}</p>
                    <p className="text-[11px] text-[#9B9590] dark:text-[#7A7580]">{task.category}{task.time ? ` · ${formatTime12Hour(task.time)}` : ''}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => startEdit(task)} className="p-2 rounded-xl bg-[#EDE8E2] dark:bg-[#2D2A40] text-[#9B9590] hover:bg-[#FDEBD3] dark:hover:bg-[#3D2D1A] transition-colors text-xs font-black">Edit</button>
                    <button onClick={() => deleteTask(task.id)} className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 transition-colors text-xs font-black">✕</button>
                  </div>
                </div>
              ))}
              {freqTasks.length === 0 && <p className="text-center text-sm text-[#9B9590] py-4">No {freq.toLowerCase()} habits. Tap + Add to create one.</p>}
            </div>
          </section>
        );
      })}
      </>
      )}
    </main>
  );

  const renderStats = () => {
    const checkins: Array<{id:string;timestamp:string;doing:string;feeling:string;isFree:boolean;suggestion?:string}> = JSON.parse(localStorage.getItem('zenfocus_checkins') || '[]');
    const recentCheckins = checkins.slice(0, 15);
    const eodEntries = Object.entries(progress.eodReviews || {}).sort(([a],[b]) => b.localeCompare(a)).slice(0, 10);
    const missedEntries = Object.entries(progress.missedTaskReasons || {}).sort(([a],[b]) => b.localeCompare(a)).slice(0, 10);

    return (
    <main className="flex-1 overflow-y-auto px-6 pt-12 no-scrollbar pb-32">
      <h1 className="text-3xl font-black mb-1 text-[#2D2A26] dark:text-[#F0EDE8] tracking-tight">Performance</h1>
      <p className="text-[#9B9590] dark:text-[#7A7580] mb-8 font-medium text-sm">Your journey tracked in data</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-[#222244] p-6 rounded-2xl border border-[#E8E0D8] dark:border-[#333355] shadow-sm">
          <div className="w-12 h-12 bg-[#FDEBD3] dark:bg-[#3D2D1A] text-[#E8833A] rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle2 size={24} />
          </div>
          <span className="text-3xl font-black block text-[#2D2A26] dark:text-[#F0EDE8] tracking-tighter">{stats.allCompletedCount}</span>
          <span className="text-[10px] font-black text-[#9B9590] dark:text-[#7A7580] uppercase tracking-widest">Total Done</span>
        </div>
        <div className="bg-white dark:bg-[#222244] p-6 rounded-2xl border border-[#E8E0D8] dark:border-[#333355] shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <span className="text-3xl font-black block text-[#2D2A26] dark:text-[#F0EDE8] tracking-tighter">{stats.consistency}%</span>
          <span className="text-[10px] font-black text-[#9B9590] dark:text-[#7A7580] uppercase tracking-widest">Consistency</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#222244] p-6 rounded-2xl border border-[#E8E0D8] dark:border-[#333355] shadow-sm mb-8">
        <h3 className="font-black text-lg mb-4 text-[#2D2A26] dark:text-[#F0EDE8] tracking-tight">Activity Insights</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#9B9590] dark:text-[#7A7580] font-black uppercase tracking-widest">Days Tracked</span>
          <span className="font-black text-[#E8833A]">{stats.daysTracked} days</span>
        </div>
        <div className="w-full h-2 bg-[#EDE8E2] dark:bg-[#2D2A40] rounded-full overflow-hidden">
          <div className="h-full bg-[#E8833A] transition-all duration-1000 rounded-full" style={{ width: `${Math.min(100, stats.daysTracked * 5)}%` }} />
        </div>
      </div>

      {/* Hourly Check-In History */}
      <div className="bg-white dark:bg-[#222244] p-6 rounded-2xl border border-[#E8E0D8] dark:border-[#333355] shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle size={16} className="text-[#E8833A]" />
          <h3 className="font-black text-lg text-[#2D2A26] dark:text-[#F0EDE8] tracking-tight">Check-In History</h3>
        </div>
        {recentCheckins.length === 0 ? (
          <p className="text-sm text-[#9B9590] italic">No check-ins recorded yet.</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
            {recentCheckins.map((ci) => (
              <div key={ci.id} className="bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-xl p-3 border border-[#E8E0D8] dark:border-[#333355]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-[#E8833A] uppercase tracking-widest">
                    {format(new Date(ci.timestamp), 'MMM d · h:mm a')}
                  </span>
                  <span className="text-xs">{ci.feeling}</span>
                </div>
                <p className="text-sm font-medium text-[#2D2A26] dark:text-[#F0EDE8]">{ci.doing || '—'}</p>
                {ci.suggestion && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">💡 {ci.suggestion}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EOD Review History */}
      <div className="bg-white dark:bg-[#222244] p-6 rounded-2xl border border-[#E8E0D8] dark:border-[#333355] shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} className="text-violet-500" />
          <h3 className="font-black text-lg text-[#2D2A26] dark:text-[#F0EDE8] tracking-tight">Daily Reviews</h3>
        </div>
        {eodEntries.length === 0 ? (
          <p className="text-sm text-[#9B9590] italic">No reviews yet.</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
            {eodEntries.map(([dk, text]) => (
              <div key={dk} className="bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-xl p-3 border border-[#E8E0D8] dark:border-[#333355]">
                <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest block mb-1">{dk}</span>
                <p className="text-sm text-[#2D2A26] dark:text-[#F0EDE8] font-medium leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Missed Task Reasons History */}
      <div className="bg-white dark:bg-[#222244] p-6 rounded-2xl border border-[#E8E0D8] dark:border-[#333355] shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ListTodo size={16} className="text-rose-500" />
          <h3 className="font-black text-lg text-[#2D2A26] dark:text-[#F0EDE8] tracking-tight">Missed Task Reasons</h3>
        </div>
        {missedEntries.length === 0 ? (
          <p className="text-sm text-[#9B9590] italic">No missed task records yet.</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
            {missedEntries.map(([dk, reasons]) => {
              const entries = Object.entries(reasons).filter(([,v]) => v);
              if (entries.length === 0) return null;
              return (
                <div key={dk} className="bg-[#F5F0EB] dark:bg-[#2D2A40] rounded-xl p-3 border border-[#E8E0D8] dark:border-[#333355]">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block mb-2">{dk}</span>
                  {entries.map(([taskId, reason]) => {
                    const task = tasks.find(t => t.id === taskId);
                    return (
                      <div key={taskId} className="flex items-start gap-2 mb-1.5 last:mb-0">
                        <span className="text-xs font-bold text-[#2D2A26] dark:text-[#F0EDE8] shrink-0">{task?.title || taskId}:</span>
                        <span className="text-xs text-[#9B9590] dark:text-[#7A7580]">{reason}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-sm text-[#9B9590] dark:text-[#7A7580] leading-relaxed italic border-l-4 border-[#E8833A]/30 pl-4 py-1">
        "The secret of your future is hidden in your daily routine."
      </p>
    </main>
  );
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F5F0EB] dark:bg-[#1A1A2E] transition-colors duration-500 relative overflow-hidden">
      {currentTab === 'Today' && renderToday()}
      {currentTab === 'Planner' && renderPlanner()}
      {currentTab === 'Notes' && <NotesView notes={notes} setNotes={setNotes} />}
      {currentTab === 'Finances' && <FinancesView finances={finances} setFinances={setFinances} />}
      {currentTab === 'Stats' && renderStats()}

      <PWAInstallPrompt />
      <NotificationManager />
      {verseModal}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#222244]/95 backdrop-blur-2xl border-t border-[#E8E0D8] dark:border-[#333355] px-2 sm:px-6 py-4 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentTab('Today')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentTab === 'Today' ? 'text-[#E8833A] scale-110' : 'text-[#9B9590] dark:text-[#7A7580]'}`}
          >
            <LayoutGrid size={22} className={currentTab === 'Today' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Today</span>
          </button>
          <button
            onClick={() => setCurrentTab('Planner')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentTab === 'Planner' ? 'text-[#E8833A] scale-110' : 'text-[#9B9590] dark:text-[#7A7580]'}`}
          >
            <CalendarIcon size={22} className={currentTab === 'Planner' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Planner</span>
          </button>
          <button
            onClick={() => setCurrentTab('Notes')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentTab === 'Notes' ? 'text-[#E8833A] scale-110' : 'text-[#9B9590] dark:text-[#7A7580]'}`}
          >
            <FileText size={22} className={currentTab === 'Notes' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Notes</span>
          </button>
          <button
            onClick={() => setCurrentTab('Finances')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentTab === 'Finances' ? 'text-[#E8833A] scale-110' : 'text-[#9B9590] dark:text-[#7A7580]'}`}
          >
            <Wallet size={22} className={currentTab === 'Finances' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Finances</span>
          </button>
          <button
            onClick={() => setCurrentTab('Stats')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentTab === 'Stats' ? 'text-[#E8833A] scale-110' : 'text-[#9B9590] dark:text-[#7A7580]'}`}
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
