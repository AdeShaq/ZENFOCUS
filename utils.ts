
import { format, startOfWeek, addDays, isSameDay, getDay, getWeeksInMonth, getWeek, isSameMonth } from 'date-fns';
import { TaskDefinition, TaskFrequency } from './types';

export const formatDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

export const getWeekDays = (baseDate: Date) => {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
};

export const filterTasksForDate = (tasks: TaskDefinition[], date: Date): TaskDefinition[] => {
  const dayOfWeek = getDay(date);
  const dayOfMonth = date.getDate();
  const weekNumber = getWeek(date);

  return tasks.filter(task => {
    switch (task.frequency) {
      case TaskFrequency.DAILY:
        return true;
      case TaskFrequency.WEEKLY:
        return task.daysOfWeek ? task.daysOfWeek.includes(dayOfWeek) : true;
      case TaskFrequency.BIWEEKLY:
        // Biweekly logic: simple odd/even week number check for demo purposes
        return weekNumber % 2 === 0;
      case TaskFrequency.MONTHLY:
        // If specific day defined, otherwise show on 1st of month for tracking
        return task.dayOfMonth ? task.dayOfMonth === dayOfMonth : dayOfMonth === 1;
      default:
        return false;
    }
  });
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.permission;
    if (permission === 'default') {
      await Notification.requestPermission();
    }
  }
};

export const sendNotification = (title: string, body: string) => {
  // Dispatch a custom event that NotificationManager will listen to
  // This allows us to play sound and manage the notification centrally
  const event = new CustomEvent('trigger-alarm', { detail: { title, body } });
  window.dispatchEvent(event);
};

export const formatTime12Hour = (time24?: string): string => {
  if (!time24) return '';
  const parts = time24.split(':');
  if (parts.length < 2) return time24;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return time24;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};
