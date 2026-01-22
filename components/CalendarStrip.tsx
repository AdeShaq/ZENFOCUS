
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { getWeekDays } from '../utils';

interface CalendarStripProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({ selectedDate, onDateSelect }) => {
  const weekDays = getWeekDays(selectedDate);

  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-4 px-1">
      {weekDays.map((date, idx) => {
        const active = isSameDay(date, selectedDate);
        return (
          <button
            key={idx}
            onClick={() => onDateSelect(date)}
            className={`flex flex-col items-center min-w-[3.5rem] py-3 rounded-2xl transition-all duration-300 ${
              active 
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-105' 
                : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest mb-1">
              {format(date, 'eee')}
            </span>
            <span className="text-lg font-bold">
              {format(date, 'd')}
            </span>
            {active && (
              <div className="w-1 h-1 bg-white rounded-full mt-1 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};
