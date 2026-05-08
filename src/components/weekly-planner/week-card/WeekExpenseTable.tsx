import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatUSD } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { PAID_BY_OPTIONS, type WeeklyExpense } from '@/lib/types';
import { statusLabel } from '@/lib/labels';

type WeekExpenseTableProps = {
  expenses: WeeklyExpense[];
  totalExpenses: number;
  onStatusChange: (id: string, status: WeeklyExpense['status']) => void;
  onUpdateExpense: (id: string, updates: Partial<WeeklyExpense>) => void;
  onEdit: (expense: WeeklyExpense) => void;
  onDelete: (id: string) => void;
};

export function WeekExpenseTable({
  expenses,
  totalExpenses,
  onStatusChange,
  onUpdateExpense,
  onEdit,
  onDelete,
}: WeekExpenseTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="planner-table-head">
            <th className="px-2 py-1 text-left font-medium text-muted-foreground">Concepto</th>
            <th className="px-2 py-1 text-right font-medium text-muted-foreground">Monto</th>
            <th className="px-2 py-1 text-center font-medium text-muted-foreground">Quien pago</th>
            <th className="px-2 py-1 text-center font-medium text-muted-foreground">Estado</th>
            <th className="w-8 px-2 py-1.5"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="group border-b border-border/40 transition-colors hover:bg-muted/35">
              <td className="px-2 py-1">
                <span className="font-medium">{expense.concept}</span>
                {expense.notes && <span className="text-muted-foreground ml-1 text-[9px]">({expense.notes})</span>}
              </td>
              <td className="px-2 py-1 text-right font-semibold">{formatUSD(expense.amount)}</td>
              <td className="px-2 py-1 text-center">
                <select
                  value={expense.paid_by}
                  onChange={(event) => onUpdateExpense(expense.id, { paid_by: event.target.value })}
                  className="h-6 rounded-md border border-border bg-background px-1.5 text-[10px] font-medium text-foreground shadow-none outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {PAID_BY_OPTIONS.map((person) => (
                    <option key={person} value={person}>
                      {person}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-2 py-1 text-center">
                <div className="inline-flex rounded-md border border-border bg-background p-0.5">
                  {(['Pending', 'Paid'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => onStatusChange(expense.id, status)}
                      className={cn(
                        'h-5 rounded px-1.5 text-[9px] font-semibold transition-colors',
                        expense.status === status
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      {statusLabel(status)}
                    </button>
                  ))}
                </div>
              </td>
              <td className="px-2 py-1 text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded p-1 opacity-60 transition-opacity hover:bg-muted group-hover:opacity-100">
                      <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border">
                    <DropdownMenuItem onClick={() => onEdit(expense)}>
                      <Pencil className="w-3 h-3 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(expense.id, 'Partial')}>
                      Marcar parcial
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(expense.id)} className="text-destructive">
                      <Trash2 className="w-3 h-3 mr-2" /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-border/50">
            <td className="px-2 py-1.5 font-semibold">Total</td>
            <td className="px-2 py-1.5 text-right font-bold">{formatUSD(totalExpenses)}</td>
            <td colSpan={3} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
