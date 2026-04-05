import React, { useMemo } from 'react';
import { FinanceEntry } from '../types';
import { Wallet, TrendingUp, TrendingDown, Clock, CheckCircle2, Landmark } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface FinancesViewProps {
  finances: FinanceEntry[];
  setFinances: (val: FinanceEntry[] | ((prev: FinanceEntry[]) => FinanceEntry[])) => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({ finances, setFinances }) => {
  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);
  
  const [formData, setFormData] = React.useState<Partial<FinanceEntry>>({
    title: '', amount: 0, type: 'expense', date: format(new Date(), 'yyyy-MM-dd'), status: 'Expected', notes: ''
  });

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    let debts = 0;

    finances.forEach(f => {
      if (f.type === 'income') income += f.amount;
      if (f.type === 'expense') expense += f.amount;
      if (f.type === 'debt') debts += f.amount;
    });

    return { income, expense, debts, balance: income - expense - debts };
  }, [finances]);

  const toggleStatus = (id: string, currentStatus: string) => {
    const nextStatusMap: Record<string, 'Expected' | 'Confirmed' | 'Pending' | 'Paid'> = {
      'Expected': 'Confirmed',
      'Confirmed': 'Paid',
      'Pending': 'Confirmed',
      'Paid': 'Expected'
    };
    
    setFinances(prev => prev.map(f => 
      f.id === id ? { ...f, status: nextStatusMap[currentStatus] || 'Expected' } : f
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const handleSave = () => {
    if (!formData.title || !formData.amount) return;

    if (isEditing) {
      setFinances(prev => prev.map(f => f.id === isEditing ? { ...f, ...formData } as FinanceEntry : f));
      setIsEditing(null);
    } else {
      setFinances(prev => [...prev, { ...formData, id: `fin-${Date.now()}` } as FinanceEntry]);
      setShowAddForm(false);
    }
  };

  const startEdit = (item: FinanceEntry) => {
    setFormData(item);
    setIsEditing(item.id);
  };

  const handleDelete = (id: string) => {
    setFinances(prev => prev.filter(f => f.id !== id));
  };

  const resetForm = () => {
    setFormData({ title: '', amount: 0, type: 'expense', date: format(new Date(), 'yyyy-MM-dd'), status: 'Expected', notes: '' });
    setShowAddForm(false);
    setIsEditing(null);
  };

  const renderForm = () => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-lg mb-6 animate-in slide-in-from-top-4">
      <h3 className="font-bold text-lg mb-4 dark:text-white">
        {isEditing ? 'Edit Entry' : 'New Entry'}
      </h3>
      <div className="space-y-4">
        <input 
          type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-2">
          <input 
            type="number" placeholder="Amount (₦)" value={formData.amount || ''} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 font-medium text-slate-800 dark:text-white"
          />
          <select 
            value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 font-medium text-slate-800 dark:text-white"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="debt">Debt</option>
            <option value="saving">Saving</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input 
            type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white"
          />
          <select 
            value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })}
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white"
          >
            <option value="Expected">Expected</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <input 
          type="text" placeholder="Notes (optional)" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white"
        />
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={resetForm} className="px-5 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold transition">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition">Save</button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex-1 overflow-y-auto px-6 pt-12 no-scrollbar pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1 dark:text-white tracking-tight">Finances</h1>
          <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">April 2026 Budget Overview</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowAddForm(true); }}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Wallet size={24} />
          <div className="absolute w-4 h-4 bg-white text-indigo-600 rounded-full flex items-center justify-center -bottom-1 -right-1 shadow-sm">
            <span className="text-[10px] font-black">+</span>
          </div>
        </button>
      </div>

      {(showAddForm || isEditing) && renderForm()}

      <div className="bg-indigo-600 dark:bg-indigo-500 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Wallet size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Total Balance</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-6">{formatNaira(stats.balance)}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1 mb-1 opacity-70">
                <TrendingUp size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Income</span>
              </div>
              <span className="text-lg font-bold">{formatNaira(stats.income)}</span>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1 opacity-70">
                <TrendingDown size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Expenses/Debt</span>
              </div>
              <span className="text-lg font-bold">{formatNaira(stats.expense + stats.debts)}</span>
            </div>
          </div>
        </div>
        <Landmark className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
      </div>

      <div className="space-y-6">
        {['income', 'debt', 'expense'].map((type) => {
          const sectionFinances = finances.filter(f => f.type === type).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          if (sectionFinances.length === 0) return null;
          
          const typeTitles = { income: 'Income & Funding', debt: 'Debts & Obligations', expense: 'Purchases & Fixed' };
          const typeIcons = { income: <TrendingUp size={18}/>, debt: <TrendingDown size={18}/>, expense: <Wallet size={18}/> };
          const typeColors = { income: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30', debt: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30', expense: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30' };

          return (
            <section key={type}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${typeColors[type as keyof typeof typeColors]}`}>
                  {typeIcons[type as keyof typeof typeIcons]}
                </div>
                <h3 className="font-bold text-lg dark:text-white">{typeTitles[type as keyof typeof typeTitles]}</h3>
              </div>
              
              <div className="space-y-3">
                {sectionFinances.map(item => (
                  <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col gap-3 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-tight pr-2">{item.title}</h4>
                          <span className="font-black text-slate-800 dark:text-white whitespace-nowrap">
                            {type !== 'income' && '-'}{formatNaira(item.amount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold"><Clock size={10}/> {format(parseISO(item.date), 'MMM d')}</span>
                          {item.notes && <span className="text-[10px] text-indigo-500 font-medium truncate max-w-[120px]">{item.notes}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700/50 pt-2 mt-1">
                      <button 
                        onClick={() => toggleStatus(item.id, item.status)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors border border-transparent hover:border-current ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                      </button>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(item)} className="text-slate-400 hover:text-indigo-500 px-2 py-1 text-xs font-bold">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-rose-500 px-2 py-1 text-xs font-bold">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
};
