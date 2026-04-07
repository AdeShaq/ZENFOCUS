
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
    <div className="flex items-center justify-between gap-1.5 py-4 px-1">
      {/* Day labels row */}
      <div className="flex items-center justify-between w-full">
        {weekDays.map((date, idx) => {
          const active = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          return (
            <button
              key={idx}
              onClick={() => onDateSelect(date)}
              className="flex flex-col items-center gap-1 group"
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                active ? 'text-[#E8833A]' : 'text-[#9B9590] dark:text-[#7A7580]'
              }`}>
                {format(date, 'eee')}
              </span>
              <span className={`w-10 h-10 flex items-center justify-center rounded-full text-base font-bold transition-all duration-200 ${
                active
                  ? 'bg-[#2D2A26] dark:bg-[#E8833A] text-white shadow-lg'
                  : isToday
                    ? 'bg-[#FDEBD3] dark:bg-[#3D2D1A] text-[#E8833A]'
                    : 'text-[#2D2A26] dark:text-[#F0EDE8] group-hover:bg-black/5 dark:group-hover:bg-white/5'
              }`}>
                {format(date, 'd')}
              </span>
              {active && (
                <div className="w-1 h-1 bg-[#E8833A] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
