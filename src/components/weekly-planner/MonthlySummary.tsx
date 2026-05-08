import { useState } from 'react';
import { formatUSD, formatCOP } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import type { MonthlyAllocation, ExchangeRate, WeeklyExpense } from '@/lib/types';
import { toast } from 'sonner';

interface Props {
  totalRemaining: number;
  allocations: MonthlyAllocation[];
  onUpdateAllocation: (index: number, updates: Partial<MonthlyAllocation>) => void;
  onAddAllocation: (a: MonthlyAllocation) => void;
  onDeleteAllocation: (index: number) => void;
  exchangeRate: ExchangeRate;
  weeklyExpenses: WeeklyExpense[];
}

export function MonthlySummary({ totalRemaining, allocations, onUpdateAllocation, onAddAllocation, onDeleteAllocation, exchangeRate, weeklyExpenses }: Props) {
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState('');

  const totalAllocated = allocations.reduce((s, a) => s + a.amount, 0);
  const unallocated = totalRemaining - totalAllocated;

  const colombiaExpenses = weeklyExpenses.filter((e) => e.category === 'Colombia');
  const totalColombiaUSD = colombiaExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="planner-card p-4">
      <h3 className="font-display font-semibold text-base mb-3">Resumen mensual</h3>

      <div className="planner-panel p-3 mb-3 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Dinero restante total</p>
        <p className={cn('text-2xl font-display font-semibold', totalRemaining >= 0 ? 'text-positive' : 'text-negative')}>
          {formatUSD(totalRemaining)}
        </p>
      </div>

      <div className="space-y-1.5 mb-3">
        {allocations.map((a, i) => (
          <div key={i} className="planner-panel flex items-center gap-2 p-2 group">
            <Input
              value={a.label}
              onChange={(e) => onUpdateAllocation(i, { label: e.target.value })}
              className="flex-1 h-7 text-sm bg-transparent border-0 p-0"
            />
            <Input
              type="number"
              value={a.amount}
              onChange={(e) => onUpdateAllocation(i, { amount: +e.target.value })}
              className="planner-input no-number-spinner w-28"
            />
            <button onClick={() => setDeleteIdx(i)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add allocation */}
      <div className="flex gap-2 mb-3">
        <Input placeholder="Nueva asignacion..." value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="h-8 text-xs bg-background" />
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => {
          if (newLabel) {
            onAddAllocation({ label: newLabel, amount: 0 });
            setNewLabel('');
            toast.success('Asignacion agregada');
          }
        }}><Plus className="w-3 h-3" /> Agregar</Button>
      </div>

      {/* Unallocated warning */}
      <div className={cn('rounded-md border p-2 text-center text-xs mb-3', unallocated < 0 ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-muted/35')}>
        <span className="text-muted-foreground">Asignado: {formatUSD(totalAllocated)}</span>
        {unallocated !== 0 && (
          <span className={cn('ml-2 font-semibold', unallocated < 0 ? 'text-negative' : 'text-foreground')}>
            ({unallocated > 0 ? `${formatUSD(unallocated)} sin asignar` : `${formatUSD(Math.abs(unallocated))} sobre presupuesto`})
          </span>
        )}
      </div>

      {/* Colombia Commitments */}
      <div className="border-t border-border pt-3">
        <h4 className="text-sm font-semibold mb-2">Compromisos mensuales de Colombia</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="planner-panel p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Enviado (USD)</p>
            <p className="font-display font-bold">{formatUSD(totalColombiaUSD)}</p>
          </div>
          <div className="planner-panel p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Equiv. (COP)</p>
            <p className="font-display font-bold">{formatCOP(totalColombiaUSD * exchangeRate.rate_cop_per_usd)}</p>
          </div>
          <div className="planner-panel p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Tasa Remitly</p>
            <p className="font-display font-bold">{exchangeRate.rate_cop_per_usd.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <DeleteConfirmation
        open={deleteIdx !== null}
        onOpenChange={() => setDeleteIdx(null)}
        title="Eliminar asignacion"
        description="Eliminar esta asignacion del resumen mensual?"
        onConfirm={() => { if (deleteIdx !== null) { onDeleteAllocation(deleteIdx); toast.success('Asignacion eliminada'); setDeleteIdx(null); } }}
      />
    </div>
  );
}
