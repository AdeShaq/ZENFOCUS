import React, { useState } from 'react';
import { Check, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { TaskDefinition } from '../types';
import { formatTime12Hour } from '../utils';

// Warm pastel color map matching the soft aesthetic
const PASTEL_MAP: Record<string, string> = {
  'bg-purple-100': 'bg-violet-50 dark:bg-violet-950/30',
  'bg-yellow-100': 'bg-amber-50 dark:bg-amber-950/30',
  'bg-green-100': 'bg-emerald-50 dark:bg-emerald-950/30',
  'bg-blue-100': 'bg-sky-50 dark:bg-sky-950/30',
  'bg-orange-100': 'bg-orange-50 dark:bg-orange-950/30',
  'bg-indigo-100': 'bg-indigo-50 dark:bg-indigo-950/30',
  'bg-pink-100': 'bg-rose-50 dark:bg-rose-950/30',
  'bg-red-100': 'bg-red-50 dark:bg-red-950/30',
};

const BORDER_MAP: Record<string, string> = {
  'bg-purple-100': 'border-violet-200/60 dark:border-violet-800/30',
  'bg-yellow-100': 'border-amber-200/60 dark:border-amber-800/30',
  'bg-green-100': 'border-emerald-200/60 dark:border-emerald-800/30',
  'bg-blue-100': 'border-sky-200/60 dark:border-sky-800/30',
  'bg-orange-100': 'border-orange-200/60 dark:border-orange-800/30',
  'bg-indigo-100': 'border-indigo-200/60 dark:border-indigo-800/30',
  'bg-pink-100': 'border-rose-200/60 dark:border-rose-800/30',
  'bg-red-100': 'border-red-200/60 dark:border-red-800/30',
};

interface TaskCardProps {
  task: TaskDefinition;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isCompleted, onToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const hasLongDesc = task.description && task.description.length > 60;
  const baseColor = task.color?.split(' ')[0] || 'bg-purple-100';
  const bgClass = PASTEL_MAP[baseColor] || 'bg-stone-50 dark:bg-[#222244]';
  const borderClass = BORDER_MAP[baseColor] || 'border-stone-200/60 dark:border-white/10';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isCompleted ? 'opacity-40 scale-[0.97]' : 'hover:shadow-md active:scale-[0.98]'
      } ${bgClass} ${borderClass}`}
    >
      <div className="p-4 flex items-center gap-3">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[#9B9590] dark:text-[#B0A8A0]">
              {task.category}
            </span>
            {task.time && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#9B9590] dark:text-[#B0A8A0]">
                <Clock size={11} /> {formatTime12Hour(task.time)}
                {task.endTime && <span>– {formatTime12Hour(task.endTime)}</span>}
              </span>
            )}
          </div>
          <h3 className={`font-bold text-[15px] leading-tight text-[#2D2A26] dark:text-[#F0EDE8] ${isCompleted ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-[12px] font-medium mt-1 leading-snug text-[#9B9590] dark:text-[#B0A8A0] ${expanded ? '' : 'line-clamp-2'}`}>
              {task.description}
            </p>
          )}
          {hasLongDesc && (
            <button
              onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
              className="flex items-center gap-1 mt-1 text-[10px] font-bold text-[#E8833A] hover:text-[#D0722F] transition-colors"
            >
              {expanded ? <><ChevronUp size={12}/> Less</> : <><ChevronDown size={12}/> More</>}
            </button>
          )}
        </div>
        
        {/* Right checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          aria-label={isCompleted ? "Unmark Task" : "Complete Task"}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0 ${
            isCompleted 
              ? 'bg-[#E8833A] border-[#E8833A] shadow-lg shadow-orange-200 dark:shadow-orange-900/30' 
              : 'bg-white dark:bg-[#2D2A40] border-[#D5CFC8] dark:border-[#4A4560] hover:border-[#E8833A]'
          }`}
        >
          {isCompleted ? (
            <Check size={18} className="text-white" strokeWidth={3} />
          ) : (
            <div className="w-4 h-4 rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
};
