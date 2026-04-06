
import React from 'react';
import { Check, Clock, Calendar } from 'lucide-react';
import { TaskDefinition } from '../types';
import { formatTime12Hour } from '../utils';

interface TaskCardProps {
  task: TaskDefinition;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isCompleted, onToggle }) => {
  return (
    <div 
      className={`relative overflow-hidden p-5 rounded-[2rem] border transition-all duration-500 transform ${
        isCompleted ? 'opacity-40 scale-95 grayscale' : 'hover:shadow-lg active:scale-[0.98]'
      } ${task.color} bg-opacity-100 dark:bg-opacity-10 dark:border-opacity-20 border-black/5 dark:border-white/10 shadow-sm`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] uppercase font-black tracking-[0.1em] px-2.5 py-1 rounded-full bg-white/60 dark:bg-black/40 border border-black/5 dark:border-white/10 backdrop-blur-sm">
              {task.category}
            </span>
            {task.time && (
              <span className="flex items-center gap-1 text-[10px] font-black opacity-60">
                <Clock size={12} className="stroke-[2.5px]" /> {formatTime12Hour(task.time)}
              </span>
            )}
          </div>
          <h3 className={`font-black text-lg leading-tight tracking-tight ${isCompleted ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          <p className="text-[13px] font-medium opacity-70 mt-1 line-clamp-2 leading-snug">{task.description}</p>
        </div>
        
        <button
          onClick={() => onToggle(task.id)}
          aria-label={isCompleted ? "Unmark Task" : "Complete Task"}
          className={`w-14 h-14 flex items-center justify-center rounded-2xl border transition-all duration-300 ${
            isCompleted 
              ? 'bg-black/90 dark:bg-indigo-500 border-transparent shadow-lg rotate-[360deg]' 
              : 'bg-white dark:bg-slate-900 border-black/10 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm'
          }`}
        >
          {isCompleted ? (
            <Check size={24} className="text-white" strokeWidth={3} />
          ) : (
            <div className="w-6 h-6 rounded-full border-[2.5px] border-black/20 dark:border-white/20 transition-all group-hover:border-indigo-500" />
          )}
        </button>
      </div>

      {/* Subtle indicator for frequency in background */}
      <div className="absolute top-[-10px] right-[-10px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-transform group-hover:scale-110">
         <Calendar size={80} />
      </div>
    </div>
  );
};
