import React, { useState, useEffect, useCallback } from 'react';
import { X, MessageCircle, Heart, Zap } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { format } from 'date-fns';

export interface CheckIn {
  id: string;
  timestamp: string;
  doing: string;
  feeling: string;
  isFree: boolean;
  suggestion?: string;
}

interface HourlyCheckInModalProps {
  currentTaskTitle?: string;
  onDismiss: () => void;
}

const SUGGESTIONS_WHEN_FREE = [
  'Take a 10-min walk and clear your head 🚶',
  'Review your goals for this week 📋',
  'Drink some water and stretch 💧',
  'Send a quick encouraging message to a friend 💬',
  'Knock out one pending small task ✅',
  'Read a chapter or watch something inspiring 📖',
  'Plan tomorrow\'s top 3 priorities 🎯',
  'Do 20 push-ups and feel the energy ⚡',
];

const HourlyCheckInModal: React.FC<HourlyCheckInModalProps> = ({ currentTaskTitle, onDismiss }) => {
  const [step, setStep] = useState<'doing' | 'feeling' | 'free' | 'done'>('doing');
  const [doing, setDoing] = useState(currentTaskTitle || '');
  const [feeling, setFeeling] = useState('');
  const [isFree, setIsFree] = useState<boolean | null>(null);
  const [checkins, setCheckins] = useLocalStorage<CheckIn[]>('zenfocus_checkins', []);

  const FEELINGS = ['😊 Great', '😐 Okay', '😔 Low', '😤 Stressed', '😴 Tired', '🔥 Energized'];

  const saveAndClose = useCallback(() => {
    if (!doing && !feeling) { onDismiss(); return; }
    const suggestion = isFree ? SUGGESTIONS_WHEN_FREE[Math.floor(Math.random() * SUGGESTIONS_WHEN_FREE.length)] : undefined;
    const entry: CheckIn = {
      id: `checkin-${Date.now()}`,
      timestamp: new Date().toISOString(),
      doing,
      feeling,
      isFree: !!isFree,
      suggestion,
    };
    setCheckins(prev => [entry, ...prev]);
    onDismiss();
  }, [doing, feeling, isFree, setCheckins, onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-2xl flex items-center justify-center">
              <MessageCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-indigo-500">Hourly Check-In</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{format(new Date(), 'h:mm a')}</p>
            </div>
          </div>
          <button onClick={onDismiss} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <X size={16} />
          </button>
        </div>

        {step === 'doing' && (
          <div>
            <h2 className="text-xl font-black dark:text-white mb-1">What are you doing right now?</h2>
            <p className="text-sm text-slate-400 mb-4">Checking your progress</p>
            <input
              type="text"
              value={doing}
              onChange={e => setDoing(e.target.value)}
              placeholder="e.g. Studying CSC 472..."
              autoFocus
              className="w-full bg-stone-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white"
            />
            <button onClick={() => setStep('feeling')} className="mt-4 w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm">
              Next →
            </button>
          </div>
        )}

        {step === 'feeling' && (
          <div>
            <h2 className="text-xl font-black dark:text-white mb-1">How are you feeling?</h2>
            <p className="text-sm text-slate-400 mb-4">Be honest with yourself</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {FEELINGS.map(f => (
                <button
                  key={f}
                  onClick={() => setFeeling(f)}
                  className={`py-3 rounded-2xl text-sm font-bold border transition-all ${feeling === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-stone-100 dark:bg-slate-800 border-transparent dark:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button onClick={() => setStep('free')} disabled={!feeling} className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm disabled:opacity-40">
              Next →
            </button>
          </div>
        )}

        {step === 'free' && (
          <div>
            <h2 className="text-xl font-black dark:text-white mb-1">Are you free right now?</h2>
            <p className="text-sm text-slate-400 mb-4">I'll suggest what to do if you are</p>
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setIsFree(true)}
                className={`flex-1 py-4 rounded-2xl font-black text-sm border transition-all flex flex-col items-center gap-1 ${isFree === true ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-stone-100 dark:bg-slate-800 border-transparent dark:text-white'}`}
              >
                <Zap size={20} /> Yes, I'm free!
              </button>
              <button
                onClick={() => setIsFree(false)}
                className={`flex-1 py-4 rounded-2xl font-black text-sm border transition-all flex flex-col items-center gap-1 ${isFree === false ? 'bg-slate-800 text-white border-slate-800 dark:bg-indigo-500 dark:border-indigo-500' : 'bg-stone-100 dark:bg-slate-800 border-transparent dark:text-white'}`}
              >
                <Heart size={20} /> Busy/Working
              </button>
            </div>
            <button onClick={saveAndClose} disabled={isFree === null} className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm disabled:opacity-40">
              Save Check-In ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook to trigger hourly check-ins
export const useHourlyCheckIn = (currentTaskTitle?: string) => {
  const [showModal, setShowModal] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useLocalStorage<string>('zenfocus_last_checkin', '');

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const minutesPastHour = now.getMinutes();

      // Trigger between minutes 0-2 of each hour
      if (minutesPastHour <= 2) {
        const lastHourKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
        if (lastCheckIn !== lastHourKey) {
          setLastCheckIn(lastHourKey);

          // Fire browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            const messages = [
              "What are you up to? Time for your hourly check-in! 💡",
              "Pause and reflect — how's your hour going? 🎯",
              "Check-in time! What are you working on right now? ⚡",
              "Quick check-in: how are you feeling this hour? 🙌",
            ];
            const msg = messages[now.getHours() % messages.length];
            const notif = new Notification("ZenFocus Check-In 🌟", {
              body: currentTaskTitle ? `Currently: ${currentTaskTitle}\n${msg}` : msg,
              icon: '/icon.svg',
              tag: 'zenfocus-checkin',
              requireInteraction: false,
            });
            notif.onclick = () => {
              window.focus();
              notif.close();
              setShowModal(true);
            };
          } else {
            // No push permission — just show in-app modal
            setShowModal(true);
          }
        }
      }
    };

    // Check every 30 seconds
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [lastCheckIn, setLastCheckIn, currentTaskTitle]);

  const modal = showModal ? (
    <HourlyCheckInModal
      currentTaskTitle={currentTaskTitle}
      onDismiss={() => setShowModal(false)}
    />
  ) : null;

  return { modal, triggerNow: () => setShowModal(true) };
};

export default HourlyCheckInModal;
