import React, { useState } from 'react';
import { WEEKLY_WORKOUTS, Exercise, MuscleGroup } from '../data/workouts';
import { Dumbbell, ChevronDown, ChevronUp, Sparkles, Target, Wrench } from 'lucide-react';

const DAY_COLORS: Record<string, string> = {
  MON: 'from-rose-500 to-orange-500',
  TUE: 'from-blue-500 to-cyan-500',
  WED: 'from-emerald-500 to-teal-500',
  THU: 'from-violet-500 to-purple-500',
  FRI: 'from-amber-500 to-yellow-500',
};

const ExerciseCard: React.FC<{ exercise: Exercise; index: number }> = ({ exercise, index }) => {
  const [showGif, setShowGif] = useState(false);

  return (
    <div className="bg-stone-50 dark:bg-slate-900 rounded-2xl p-4 border border-black/5 dark:border-white/5 transition-all hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-xl flex items-center justify-center shrink-0 font-black text-sm">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-tight text-[15px]">{exercise.name}</h4>
            {exercise.gifUrl && (
              <button 
                onClick={() => setShowGif(!showGif)} 
                className="text-[9px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-lg shrink-0 hover:bg-indigo-100 transition-colors"
              >
                {showGif ? 'HIDE' : 'GIF'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] flex-wrap">
            <span className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">
              {exercise.sets} × {exercise.reps}
            </span>
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Target size={10} /> {exercise.muscle}
            </span>
            <span className="text-slate-400 font-medium flex items-center gap-1 truncate">
              <Wrench size={10} /> {exercise.equipment}
            </span>
          </div>
        </div>
      </div>
      {showGif && exercise.gifUrl && (
        <div className="mt-3 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <img 
            src={exercise.gifUrl} 
            alt={exercise.name} 
            className="w-full h-auto max-h-48 object-contain" 
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

const MuscleGroupSection: React.FC<{ group: MuscleGroup }> = ({ group }) => {
  const [showRecommended, setShowRecommended] = useState(false);

  return (
    <div className="mb-6">
      <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
        <Dumbbell size={14} />
        {group.name}
      </h3>
      <div className="space-y-2">
        {group.exercises.map((ex, i) => (
          <ExerciseCard key={`${group.name}-${ex.name}`} exercise={ex} index={i} />
        ))}
      </div>
      {group.recommended && group.recommended.length > 0 && (
        <div className="mt-3">
          <button 
            onClick={() => setShowRecommended(!showRecommended)} 
            className="flex items-center gap-2 text-[11px] font-black text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 transition-colors w-full justify-center py-2"
          >
            <Sparkles size={12} />
            {showRecommended ? 'Hide' : 'Show'} Recommended Alternatives
            {showRecommended ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showRecommended && (
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-indigo-200 dark:border-indigo-800/50">
              {group.recommended.map((ex, i) => (
                <ExerciseCard key={`rec-${group.name}-${ex.name}`} exercise={ex} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const WorkoutView: React.FC = () => {
  const today = new Date().getDay(); // 0=Sun, 1=Mon...
  const defaultIdx = today >= 1 && today <= 5 ? today - 1 : 0;
  const [activeDay, setActiveDay] = useState(defaultIdx);
  const workout = WEEKLY_WORKOUTS[activeDay];

  return (
    <div>
      {/* Day Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {WEEKLY_WORKOUTS.map((w, idx) => (
          <button
            key={w.shortDay}
            onClick={() => setActiveDay(idx)}
            className={`px-5 py-3 rounded-2xl text-xs font-black transition-all duration-200 whitespace-nowrap ${
              activeDay === idx
                ? `bg-gradient-to-r ${DAY_COLORS[w.shortDay]} text-white shadow-lg`
                : 'bg-stone-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            {w.shortDay}
          </button>
        ))}
      </div>

      {/* Day Header */}
      <div className={`bg-gradient-to-r ${DAY_COLORS[workout.shortDay]} p-6 rounded-[2rem] text-white mb-6 shadow-xl relative overflow-hidden`}>
        <div className="absolute top-[-20px] right-[-20px] opacity-10 pointer-events-none">
          <Dumbbell size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black tracking-tight">{workout.day}</h2>
          <p className="text-white/80 font-bold text-sm mt-1">{workout.focus}</p>
          <p className="text-white/60 text-xs mt-2 font-medium">{workout.muscleGroups.reduce((acc, g) => acc + g.exercises.length, 0)} exercises total</p>
        </div>
      </div>

      {/* Muscle Groups */}
      {workout.muscleGroups.map(group => (
        <MuscleGroupSection key={`${workout.shortDay}-${group.name}`} group={group} />
      ))}
    </div>
  );
};
