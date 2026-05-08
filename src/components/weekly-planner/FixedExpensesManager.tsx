import { useEffect, useMemo, useState } from 'react';
import { Plus, Repeat2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatUSD } from '@/lib/currency';
import { EXPENSE_CATEGORIES, PAID_BY_OPTIONS, type FixedWeeklyExpense } from '@/lib/types';

type FixedExpensesManagerProps = {
  fixedExpenses: FixedWeeklyExpense[];
  selectedWeek?: number;
  onAdd: (expense: Omit<FixedWeeklyExpense, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<FixedWeeklyExpense>) => void;
  onDelete: (id: string) => void;
};

export function FixedExpensesManager({
  fixedExpenses,
  selectedWeek = 1,
  onAdd,
  onUpdate,
  onDelete,
}: FixedExpensesManagerProps) {
  const [draft, setDraft] = useState({
    week_number: 1,
    concept: '',
    amount: '',
    paid_by: 'Sebas',
    category: 'Other',
  });

  const totalFixed = useMemo(
    () => fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [fixedExpenses],
  );
  const selectedWeekExpenses = useMemo(
    () => fixedExpenses.filter((expense) => expense.week_number === selectedWeek),
    [fixedExpenses, selectedWeek],
  );
  const selectedWeekTotal = selectedWeekExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  useEffect(() => {
    setDraft((current) => ({ ...current, week_number: selectedWeek }));
  }, [selectedWeek]);

  const addExpense = () => {
    if (!draft.concept.trim() || !draft.amount) return;

    onAdd({
      week_number: draft.week_number,
      concept: draft.concept.trim(),
      amount: Number(draft.amount),
      currency: 'USD',
      paid_by: draft.paid_by,
      category: draft.category,
    });
    setDraft({ week_number: selectedWeek, concept: '', amount: '', paid_by: 'Sebas', category: 'Other' });
  };

  return (
    <section className="planner-card p-4">
      <div className="flex flex-col gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Repeat2 className="h-4 w-4 text-foreground" />
          <div>
            <h2 className="font-display text-base font-semibold">Fijos Week {selectedWeek}</h2>
            <p className="text-xs text-muted-foreground">
              Semana: {formatUSD(selectedWeekTotal)} · Mes: {formatUSD(totalFixed)}
            </p>
          </div>
        </div>
        <div className="grid gap-2">
          <Input
            value={draft.concept}
            onChange={(event) => setDraft({ ...draft, concept: event.target.value })}
            className="no-number-spinner h-8 bg-background text-xs"
            placeholder="Concept"
          />
          <Input
            type="number"
            value={draft.amount}
            onChange={(event) => setDraft({ ...draft, amount: event.target.value })}
            className="no-number-spinner h-8 bg-background text-xs"
            placeholder="Amount"
          />
          <select
            value={draft.paid_by}
            onChange={(event) => setDraft({ ...draft, paid_by: event.target.value })}
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
          >
            {PAID_BY_OPTIONS.map((person) => (
              <option key={person} value={person}>{person}</option>
            ))}
          </select>
          <select
            value={draft.category}
            onChange={(event) => setDraft({ ...draft, category: event.target.value })}
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
          >
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Button type="button" size="sm" className="h-8 gap-1" onClick={addExpense}>
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>

      <div className="mt-3 planner-panel p-2.5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Week {selectedWeek}</h3>
          <span className="text-xs text-muted-foreground">{formatUSD(selectedWeekTotal)}</span>
        </div>
        <div className="space-y-2">
          {selectedWeekExpenses.map((expense) => (
            <div key={expense.id} className="grid grid-cols-[1fr_86px_28px] gap-2">
              <Input
                value={expense.concept}
                onChange={(event) => onUpdate(expense.id, { concept: event.target.value })}
                className="no-number-spinner h-7 bg-background text-xs"
              />
              <Input
                type="number"
                value={expense.amount}
                onChange={(event) => onUpdate(expense.id, { amount: Number(event.target.value) })}
                className="no-number-spinner h-7 bg-background text-xs"
              />
              <button
                type="button"
                className="flex h-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(expense.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {selectedWeekExpenses.length === 0 && (
            <p className="py-2 text-xs text-muted-foreground">No fixed expenses</p>
          )}
        </div>
      </div>
    </section>
  );
}
