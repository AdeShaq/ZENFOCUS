import React, { useState } from 'react';
import { Note } from '../types';
import { Plus, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface NotesViewProps {
  notes: Note[];
  setNotes: (val: Note[] | ((prev: Note[]) => Note[])) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ notes, setNotes }) => {
  
  const handleAddNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: '',
      content: '',
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, field: 'title' | 'content', value: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, [field]: value, lastUpdated: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <main className="flex-1 overflow-y-auto px-6 pt-12 no-scrollbar pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1 dark:text-white tracking-tight">Notes</h1>
          <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">Capture your thoughts</p>
        </div>
        <button 
          onClick={handleAddNote}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-12 px-6 bg-[#F5F5F7]/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm border border-black/5">
              <FileText size={32} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">No notes yet. Create one!</p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="bg-[#F9F9FA] dark:bg-slate-800 p-5 rounded-[2rem] border border-black/5 dark:border-slate-700/50 shadow-sm transition-all focus-within:shadow-md focus-within:border-black/10">
              <div className="flex items-start justify-between mb-2">
                <input 
                  type="text" 
                  value={note.title}
                  placeholder="New Note"
                  onChange={e => updateNote(note.id, 'title', e.target.value)}
                  className="bg-transparent border-none p-0 flex-1 font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
                <button 
                  onClick={() => deleteNote(note.id)}
                  className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors p-1 ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea 
                value={note.content}
                placeholder="Start typing..."
                onChange={e => updateNote(note.id, 'content', e.target.value)}
                className="w-full bg-transparent border-none p-0 text-sm text-slate-600 dark:text-slate-400 focus:outline-none resize-none leading-relaxed min-h-[4rem]"
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
                ref={(el) => {
                  if (el) {
                    el.style.height = 'auto';
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
              />
              <div className="mt-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                {format(new Date(note.lastUpdated), 'MMM d, h:mm a')}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};
