import React, { useRef, useCallback, useEffect } from 'react';
import { Note } from '../types';
import { Plus, Trash2, FileText, Pin, Bold, Italic, List, ListOrdered, Undo2, Redo2, Heading1, Heading2 } from 'lucide-react';
import { format } from 'date-fns';

interface NotesViewProps {
  notes: Note[];
  setNotes: (val: Note[] | ((prev: Note[]) => Note[])) => void;
}

const PANTONE_COLORS = [
  '',
  '#FFD6D6',
  '#D7EAC7',
  '#C6E2FF',
  '#FDECB0',
  '#EED8FF',
  '#FFE4D6',
  '#D4E5F7',
  '#F5D5E0',
];

// Inject global note-editor styles once
const NOTE_STYLES = `
  .note-editor { outline: none; }
  .note-editor[data-empty="true"]:before {
    content: attr(data-placeholder);
    color: #9ca3af;
    pointer-events: none;
    display: block;
  }
  .note-editor h1 { font-size: 1.5rem; font-weight: 900; line-height: 1.3; margin: 0.5em 0; }
  .note-editor h2 { font-size: 1.2rem; font-weight: 800; line-height: 1.3; margin: 0.4em 0; }
  .note-editor ul { list-style: disc !important; padding-left: 1.4em; margin: 0.4em 0; }
  .note-editor ol { list-style: decimal !important; padding-left: 1.4em; margin: 0.4em 0; }
  .note-editor li { margin: 0.18em 0; line-height: 1.55; display: list-item !important; }
  .note-editor b, .note-editor strong { font-weight: 900; }
  .note-editor i, .note-editor em { font-style: italic; }
  .note-editor p { margin: 0.25em 0; min-height: 1.4em; }
  .note-editor br { display: block; }
`;

const NoteCard: React.FC<{
  note: Note;
  onUpdate: (id: string, field: 'title' | 'content', value: string) => void;
  onUpdateColor: (id: string, color: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({
  note,
  onUpdate,
  onUpdateColor,
  onTogglePin,
  onDelete,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);

  // Sync content to DOM only on mount / note id changes (avoid caret jumps)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== note.content) {
      editorRef.current.innerHTML = note.content;
    }
  }, [note.id]); // only on id change

  const updateEmpty = () => {
    if (!editorRef.current) return;
    const isEmpty = editorRef.current.innerText.trim() === '';
    editorRef.current.dataset.empty = String(isEmpty);
  };

  const exec = useCallback(
    (cmd: string, val?: string) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, val ?? undefined);
      if (editorRef.current) {
        onUpdate(note.id, 'content', editorRef.current.innerHTML);
        updateEmpty();
      }
    },
    [note.id, onUpdate]
  );

  const handleInput = () => {
    if (isComposingRef.current) return;
    if (editorRef.current) {
      onUpdate(note.id, 'content', editorRef.current.innerHTML);
      updateEmpty();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Ensure Enter inside list stays in list
    if (e.key === 'Enter' && !e.shiftKey) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const node = sel.getRangeAt(0).commonAncestorContainer;
        const li = (node.nodeType === 3 ? node.parentElement : node as Element)?.closest('li');
        if (li && li.textContent?.trim() === '') {
          // Break out of list on double-enter on empty li
          e.preventDefault();
          document.execCommand('outdent');
          document.execCommand('insertParagraph');
          handleInput();
          return;
        }
      }
    }
  };

  const ToolBtn = ({
    onClick,
    children,
    title,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className="p-1.5 rounded-lg hover:bg-black/8 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div
      style={note.color ? { backgroundColor: note.color } : {}}
      className={`group relative ${
        !note.color ? 'bg-[#F9F9FA] dark:bg-slate-800' : ''
      } p-5 rounded-[2rem] border border-black/5 dark:border-slate-700/50 shadow-sm transition-all focus-within:shadow-lg focus-within:border-indigo-200 dark:focus-within:border-indigo-800`}
    >
      {/* Title Row */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <input
          type="text"
          value={note.title}
          placeholder="Note title"
          onChange={e => onUpdate(note.id, 'title', e.target.value)}
          className={`bg-transparent border-none p-0 flex-1 font-black text-xl leading-tight focus:outline-none placeholder:opacity-30 min-w-0 ${
            note.color ? 'text-black/90' : 'text-slate-800 dark:text-slate-100'
          }`}
        />
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onTogglePin(note.id)}
            className={`p-1.5 rounded-full transition-colors ${
              note.isPinned
                ? 'text-amber-500 bg-amber-500/10'
                : 'text-slate-300 hover:text-amber-500 dark:text-slate-600'
            }`}
          >
            <Pin size={14} className={note.isPinned ? 'fill-current' : ''} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-full text-slate-300 hover:text-red-500 dark:text-slate-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Formatting Toolbar — slides in on focus */}
      <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-focus-within:max-h-12 group-focus-within:opacity-100 group-focus-within:mb-2">
        <div className="flex items-center gap-0.5 bg-white/90 dark:bg-black/40 backdrop-blur-sm rounded-xl border border-black/5 dark:border-white/10 p-1 w-fit">
          <ToolBtn onClick={() => exec('bold')} title="Bold"><Bold size={13} /></ToolBtn>
          <ToolBtn onClick={() => exec('italic')} title="Italic"><Italic size={13} /></ToolBtn>
          <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-0.5" />
          <ToolBtn onClick={() => exec('formatBlock', 'H1')} title="Heading 1"><Heading1 size={13} /></ToolBtn>
          <ToolBtn onClick={() => exec('formatBlock', 'H2')} title="Heading 2"><Heading2 size={13} /></ToolBtn>
          <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-0.5" />
          <ToolBtn onClick={() => exec('insertUnorderedList')} title="Bullet List"><List size={13} /></ToolBtn>
          <ToolBtn onClick={() => exec('insertOrderedList')} title="Numbered List"><ListOrdered size={13} /></ToolBtn>
          <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-0.5" />
          <ToolBtn onClick={() => exec('undo')} title="Undo"><Undo2 size={13} /></ToolBtn>
          <ToolBtn onClick={() => exec('redo')} title="Redo"><Redo2 size={13} /></ToolBtn>
        </div>
      </div>

      {/* ContentEditable Body */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Start typing..."
        data-empty={note.content === '' || note.content === '<br>' ? 'true' : 'false'}
        className={`note-editor w-full min-h-[3rem] text-[15px] leading-relaxed ${
          note.color ? 'text-black/80' : 'text-slate-600 dark:text-slate-300'
        }`}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => { isComposingRef.current = true; }}
        onCompositionEnd={() => { isComposingRef.current = false; handleInput(); }}
        onBlur={e => {
          onUpdate(note.id, 'content', e.currentTarget.innerHTML);
          updateEmpty();
        }}
        onFocus={updateEmpty}
      />

      {/* Color Picker & Date */}
      <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-1.5 flex-wrap">
          {PANTONE_COLORS.map((c, idx) => (
            <button
              key={idx}
              onClick={() => onUpdateColor(note.id, c)}
              style={c ? { background: c } : {}}
              className={`w-5 h-5 shrink-0 rounded-full border transition-transform hover:scale-125 active:scale-95 ${
                !c ? 'bg-[#F9F9FA] dark:bg-slate-700' : ''
              } ${
                note.color === c
                  ? 'border-black/40 scale-110 ring-2 ring-offset-1 ring-indigo-400'
                  : 'border-black/10 dark:border-white/10'
              }`}
            />
          ))}
        </div>
        <div
          className={`text-[9px] uppercase tracking-widest font-black shrink-0 ml-2 ${
            note.color ? 'text-black/25' : 'text-slate-300 dark:text-slate-600'
          }`}
        >
          {format(new Date(note.lastUpdated), 'MMM d')}
        </div>
      </div>
    </div>
  );
};

export const NotesView: React.FC<NotesViewProps> = ({ notes, setNotes }) => {
  const updateNote = (id: string, field: 'title' | 'content', value: string) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, [field]: value, lastUpdated: new Date().toISOString() } : n
      )
    );
  };
  const updateNoteColor = (id: string, color: string) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, color, lastUpdated: new Date().toISOString() } : n
      )
    );
  };
  const togglePin = (id: string) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isPinned: !n.isPinned, lastUpdated: new Date().toISOString() } : n
      )
    );
  };
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };
  const handleAddNote = () => {
    setNotes(prev => [
      {
        id: `note-${Date.now()}`,
        title: '',
        content: '',
        dateCreated: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned === b.isPinned)
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    return a.isPinned ? -1 : 1;
  });

  return (
    <main className="flex-1 overflow-y-auto px-6 pt-12 no-scrollbar pb-32">
      <style>{NOTE_STYLES}</style>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1 dark:text-white tracking-tight">Notes</h1>
          <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">
            Capture your thoughts
          </p>
        </div>
        <button
          onClick={handleAddNote}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-6">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-12 px-6 bg-[#F5F5F7]/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm border border-black/5">
              <FileText size={32} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No notes yet. Tap + to create one!
            </p>
          </div>
        ) : (
          sortedNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onUpdateColor={updateNoteColor}
              onTogglePin={togglePin}
              onDelete={deleteNote}
            />
          ))
        )}
      </div>
    </main>
  );
};
