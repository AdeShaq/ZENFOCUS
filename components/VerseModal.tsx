import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

const GALATIANS_220 = {
  reference: 'Galatians 2:20',
  NIV: `I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.`,
  AMP: `I have been crucified with Christ [that is, in Him I have shared His crucifixion]; it is no longer I who live, but Christ lives in me. The life I now live in the body I live by faith [with confidence] in the Son of God, who loved me and gave Himself up for me.`,
};

interface VerseModalProps {
  onClose: () => void;
}

export const VerseModal: React.FC<VerseModalProps> = ({ onClose }) => {
  const [activeTranslation, setActiveTranslation] = useState<'NIV' | 'AMP'>('NIV');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 p-6 pb-8 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] uppercase tracking-widest font-black">Daily Scripture</p>
                <p className="text-white font-black text-sm">{GALATIANS_220.reference}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Translation Toggle */}
          <div className="flex items-center gap-2 bg-black/20 rounded-2xl p-1">
            {(['NIV', 'AMP'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTranslation(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTranslation === t
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Verse Content */}
        <div className="px-7 py-6">
          <div className="relative">
            <span className="absolute -top-4 -left-2 text-7xl font-black text-indigo-100 dark:text-indigo-900/40 leading-none pointer-events-none select-none">"</span>
            <p className="text-slate-700 dark:text-slate-200 text-[16px] leading-8 font-medium relative z-10 pt-2">
              {GALATIANS_220[activeTranslation]}
            </p>
            <span className="absolute -bottom-6 right-0 text-7xl font-black text-indigo-100 dark:text-indigo-900/40 leading-none pointer-events-none select-none">"</span>
          </div>
          <p className="mt-8 text-right text-xs font-black text-indigo-500 dark:text-indigo-400 tracking-widest uppercase">
            {GALATIANS_220.reference} · {activeTranslation}
          </p>
        </div>

        {/* Footer */}
        <div className="px-7 pb-7">
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 font-medium italic">
            "Not I, but Christ who lives in me" 🙏
          </p>
        </div>
      </div>
    </div>
  );
};
