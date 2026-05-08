import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatUSD } from '@/lib/currency';
import { formatShortDate } from '@/lib/date-ranges';
import { cn } from '@/lib/utils';

type WeekCardSummaryProps = {
  week: number;
  weeklyIncome: number;
  extraIncome: number;
  totalExpenses: number;
  remaining: number;
  dueDate: string;
  paidCount: number;
  pendingCount: number;
  onExtraIncomeChange: (value: number) => void;
};

export function WeekCardSummary({
  week,
  weeklyIncome,
  extraIncome,
  totalExpenses,
  remaining,
  dueDate,
  paidCount,
  pendingCount,
  onExtraIncomeChange,
}: WeekCardSummaryProps) {
  const [extraValue, setExtraValue] = useState(String(extraIncome || ''));
  const hasMounted = useRef(false);
  const onExtraIncomeChangeRef = useRef(onExtraIncomeChange);
  const debounceRef = useRef<number | null>(null);
  const lastCommittedRef = useRef(extraIncome);

  useEffect(() => {
    onExtraIncomeChangeRef.current = onExtraIncomeChange;
  }, [onExtraIncomeChange]);

  useEffect(() => {
    setExtraValue(String(extraIncome || ''));
    lastCommittedRef.current = extraIncome;
  }, [extraIncome]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      const nextValue = Number(extraValue) || 0;
      if (nextValue !== lastCommittedRef.current) {
        lastCommittedRef.current = nextValue;
        onExtraIncomeChangeRef.current(nextValue);
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [extraValue]);

  const displayRemaining = weeklyIncome + (Number(extraValue) || 0) - totalExpenses;

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-sm font-semibold tracking-tight">Semana {week}</h3>
          <p className="text-[11px] text-muted-foreground">Vence {formatShortDate(dueDate)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-semibold">
            {pendingCount} pendientes
          </span>
          <span className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
            {paidCount} pagados
          </span>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-4 gap-1.5 text-xs">
        <div className="planner-panel px-2 py-1.5">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Ingreso</p>
          <p className="font-semibold">{formatUSD(weeklyIncome)}</p>
        </div>
        <div className="planner-panel px-2 py-1.5">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Extra</p>
          <div className="mt-0.5 flex h-5 min-w-0 items-center rounded-sm">
            <span className="mr-1 shrink-0 text-xs font-semibold text-muted-foreground">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={extraValue}
              onChange={(event) => setExtraValue(event.target.value)}
              onFocus={(event) => event.currentTarget.select()}
              onBlur={() => {
                const nextValue = Number(extraValue) || 0;
                if (debounceRef.current) {
                  window.clearTimeout(debounceRef.current);
                }
                if (nextValue !== lastCommittedRef.current) {
                  lastCommittedRef.current = nextValue;
                  onExtraIncomeChangeRef.current(nextValue);
                }
              }}
              className="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-xs font-semibold leading-none text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="0"
            />
          </div>
        </div>
        <div className="planner-panel px-2 py-1.5">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Gastos</p>
          <p className="font-semibold">{formatUSD(totalExpenses)}</p>
        </div>
        <div className="planner-panel px-2 py-1.5">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Restante</p>
          <p
            className={cn(
              'font-semibold',
              displayRemaining < 0 && 'text-destructive',
            )}
          >
            {displayRemaining >= 0 ? '' : '-'}
            {formatUSD(Math.abs(displayRemaining))}
          </p>
        </div>
      </div>
    </>
  );
}
