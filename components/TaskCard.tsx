import React, { useState } from 'react';
import { Check, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { TaskDefinition } from '../types';
import { formatTime12Hour } from '../utils';

interface TaskCardProps {
  task: TaskDefinition;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isCompleted, onToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const hasLongDesc = task.description && task.description.length > 60;

  return (
    <div 
      className={`relative overflow-hidden rounded-[2rem] border transition-all duration-500 transform ${
        isCompleted ? 'opacity-40 scale-95 grayscale' : 'hover:shadow-lg active:scale-[0.98]'
      } ${task.color} bg-opacity-100 dark:bg-opacity-10 dark:border-opacity-20 border-black/5 dark:border-white/10 shadow-sm`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[9px] uppercase font-black tracking-[0.1em] px-2.5 py-1 rounded-full bg-white/60 dark:bg-white/15 border border-black/5 dark:border-white/20 backdrop-blur-sm whitespace-nowrap text-slate-700 dark:text-slate-100">
                {task.category}
              </span>
              {task.time && (
                <span className="flex items-center gap-1 text-[10px] font-black text-slate-600 dark:text-slate-200 whitespace-nowrap">
                  <Clock size={12} className="stroke-[2.5px]" /> {formatTime12Hour(task.time)}
                  {task.endTime && <span className="text-slate-500 dark:text-slate-300">– {formatTime12Hour(task.endTime)}</span>}
                </span>
              )}
            </div>
            <h3 className={`font-black text-lg leading-tight tracking-tight dark:text-white ${isCompleted ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-[13px] font-medium opacity-70 mt-1 leading-snug text-slate-800 dark:text-white/80 ${expanded ? '' : 'line-clamp-2'}`}>
                {task.description}
              </p>
            )}
            {hasLongDesc && (
              <button
                onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
                className="flex items-center gap-1 mt-1.5 text-[10px] font-black text-slate-600 dark:text-slate-200 hover:opacity-100 transition-opacity"
              >
                {expanded ? <><ChevronUp size={12}/> Less</> : <><ChevronDown size={12}/> More</>}
              </button>
            )}
          </div>
          
          <button
            onClick={() => onToggle(task.id)}
            aria-label={isCompleted ? "Unmark Task" : "Complete Task"}
            className={`w-14 h-14 flex items-center justify-center rounded-2xl border transition-all duration-300 shrink-0 ${
              isCompleted 
                ? 'bg-black/90 dark:bg-indigo-500 border-transparent shadow-lg rotate-[360deg]' 
                : 'bg-white dark:bg-slate-900 border-black/10 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm'
            }`}
          >
            {isCompleted ? (
              <Check size={24} className="text-white" strokeWidth={3} />
            ) : (
              <div className="w-6 h-6 rounded-full border-[2.5px] border-black/20 dark:border-white/20 transition-all" />
            )}
          </button>
        </div>
      </div>

      {/* Subtle indicator for frequency in background */}
      <div className="absolute top-[-10px] right-[-10px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <Calendar size={80} />
      </div>
    </div>
  );
};
