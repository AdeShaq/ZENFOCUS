import React, { useState } from 'react';
import { Note } from '../types';
import { Plus, Edit3, ChevronLeft, Share, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface NotesViewProps {
  notes: Note[];
  setNotes: (val: Note[] | ((prev: Note[]) => Note[])) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ notes, setNotes }) => {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  
  const handleAddNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: '',
      content: '',
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNote(newNote);
  };

  const updateNote = (field: 'title' | 'content', value: string) => {
    if (!activeNote) return;
    const updated = { ...activeNote, [field]: value, lastUpdated: new Date().toISOString() };
    setActiveNote(updated);
    setNotes(prev => prev.map(n => n.id === activeNote.id ? updated : n));
  };

  const deleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNote?.id === id) setActiveNote(null);
  };

  const renderEditor = () => (
    <div className="absolute inset-0 bg-[#F9F9FA] dark:bg-slate-950 z-30 flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex items-center justify-between px-4 py-3 bg-[#F9F9FA]/80 dark:bg-slate-950/80 backdrop-blur-md">
        <button 
          onClick={() => setActiveNote(null)}
          className="flex items-center text-amber-500 font-medium active:opacity-70 transition-opacity"
        >
          <ChevronLeft size={28} className="-ml-2" />
          <span className="text-[17px] -ml-1">Notes</span>
        </button>
        <div className="flex items-center gap-4 text-amber-500">
          <button className="active:opacity-70 transition-opacity"><Share size={20} /></button>
          <button onClick={() => deleteNote(activeNote!.id)} className="active:opacity-70 transition-opacity"><Trash2 size={20} /></button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar flex flex-col">
        <div className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
          {format(new Date(activeNote!.lastUpdated), 'MMMM d, yyyy \at h:mm a')}
        </div>
        
        <input 
          type="text" 
          value={activeNote!.title}
          onChange={e => updateNote('title', e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent border-none text-[28px] font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none p-0 mb-2 leading-tight"
        />
        <textarea 
          value={activeNote!.content}
          onChange={e => updateNote('content', e.target.value)}
          placeholder="Start typing..."
          className="flex-1 w-full bg-transparent border-none text-[17px] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none p-0 leading-relaxed resize-none"
        />
      </div>
    </div>
  );

  return (
    <main className="flex-1 bg-[#F2F2F7] dark:bg-slate-950 overflow-y-auto px-4 pt-12 no-scrollbar pb-32 relative">
      {activeNote && renderEditor()}
      
      <div className="mb-4 px-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Notes</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[10px] shadow-sm overflow-hidden border border-black/5 dark:border-white/5">
        {notes.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            No notes yet
          </div>
        ) : (
          notes.map((note, idx) => (
            <div 
              key={note.id} 
              onClick={() => setActiveNote(note)}
              className={`p-4 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer ${idx !== notes.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
            >
              <h3 className="font-bold text-[17px] text-slate-900 dark:text-white mb-0.5 truncate">
                {note.title || 'New Note'}
              </h3>
              <div className="flex items-center text-[15px] text-slate-500 dark:text-slate-400">
                <span className="shrink-0">{format(new Date(note.lastUpdated), 'M/d/yy')}</span>
                <span className="mx-2 truncate">{note.content || 'No additional text'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-[88px] right-6 z-10">
        <button 
          onClick={handleAddNote}
          className="w-14 h-14 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 active:bg-amber-700 transition"
        >
          <Edit3 size={24} className="fill-current -mt-0.5 ml-0.5" />
        </button>
      </div>
    </main>
  );
};
