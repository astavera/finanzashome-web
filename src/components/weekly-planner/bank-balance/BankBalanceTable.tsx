import { TrendingDown, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatUSD } from '@/lib/currency';
import type { BankBalanceWeek } from '@/lib/types';
import type { BankBalanceTotals } from './bank-balance-utils';

type BankBalanceTableProps = {
  bankBalances: BankBalanceWeek[];
  totals: BankBalanceTotals;
  onFieldChange: (balance: BankBalanceWeek, field: keyof BankBalanceWeek, value: number) => void;
};

export function BankBalanceTable({ bankBalances, totals, onFieldChange }: BankBalanceTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="planner-table-head">
            {['Semana', 'Ingreso real', 'Presupuesto', 'Gastos', 'Diferencia'].map((header) => (
              <th key={header} className="text-right py-2 px-3 text-muted-foreground font-medium text-[10px] uppercase tracking-wider first:text-left first:pl-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bankBalances.map((balance) => {
            const diff = balance.real_income - balance.expenses;
            const pctOfBudget = balance.budget > 0 ? (balance.expenses / balance.budget) * 100 : 0;

            return (
              <tr key={balance.week} className="border-t border-border/40 hover:bg-muted/35 transition-colors">
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md border border-border bg-background flex items-center justify-center text-xs font-bold">{balance.week}</span>
                    <span className="font-medium text-xs text-muted-foreground">Semana {balance.week}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-right">
                  <Input
                    type="number"
                    value={balance.real_income}
                    className="planner-input no-number-spinner ml-auto w-24"
                    onChange={(event) => onFieldChange(balance, 'real_income', Number(event.target.value))}
                  />
                </td>
                <td className="py-2 px-3 text-right">
                  <Input
                    type="number"
                    value={balance.budget}
                    className="planner-input no-number-spinner ml-auto w-24"
                    onChange={(event) => onFieldChange(balance, 'budget', Number(event.target.value))}
                  />
                </td>
                <td className="py-2 px-3 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <Input
                      type="number"
                      value={balance.expenses}
                      className="planner-input no-number-spinner w-24"
                      onChange={(event) => onFieldChange(balance, 'expenses', Number(event.target.value))}
                    />
                    {balance.budget > 0 && (
                      <div className="flex items-center gap-1.5 w-24">
                        <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pctOfBudget > 100 ? 'bg-destructive' : 'bg-foreground'}`}
                            style={{ width: `${Math.min(pctOfBudget, 100)}%` }}
                          />
                        </div>
                        <span className={`text-[9px] font-medium ${pctOfBudget > 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {pctOfBudget.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-2 px-3 text-right">
                  <span className={`inline-flex items-center gap-1 font-display font-bold text-sm ${diff >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {diff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {formatUSD(diff)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="planner-table-head font-semibold">
            <td className="py-2 px-3 text-xs uppercase tracking-wider text-muted-foreground">Total</td>
            <td className="py-2 px-3 text-right font-display text-sm">{formatUSD(totals.totalRealIncome)}</td>
            <td className="py-2 px-3 text-right font-display text-sm">{formatUSD(totals.totalBudget)}</td>
            <td className="py-2 px-3 text-right font-display text-sm">{formatUSD(totals.totalExpenses)}</td>
            <td className="py-2 px-3 text-right">
              <span className={`inline-flex items-center gap-1 font-display font-bold text-sm ${totals.totalDifference >= 0 ? 'text-positive' : 'text-negative'}`}>
                {totals.totalDifference >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatUSD(totals.totalDifference)}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
