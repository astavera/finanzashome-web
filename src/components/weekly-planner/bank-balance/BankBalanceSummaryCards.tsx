import { BarChart3, DollarSign, Receipt, TrendingDown, TrendingUp } from 'lucide-react';
import { formatUSD } from '@/lib/currency';
import type { BankBalanceTotals } from './bank-balance-utils';

type BankBalanceSummaryCardsProps = {
  totals: BankBalanceTotals;
};

export function BankBalanceSummaryCards({ totals }: BankBalanceSummaryCardsProps) {
  const items = [
    { label: 'Ingreso Real', value: totals.totalRealIncome, icon: DollarSign, color: 'text-muted-foreground' },
    { label: 'Presupuesto', value: totals.totalBudget, icon: BarChart3, color: 'text-muted-foreground' },
    { label: 'Gastos', value: totals.totalExpenses, icon: Receipt, color: 'text-muted-foreground' },
    {
      label: 'Diferencia',
      value: totals.totalDifference,
      icon: totals.totalDifference >= 0 ? TrendingUp : TrendingDown,
      color: totals.totalDifference >= 0 ? 'text-positive' : 'text-negative',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mb-3">
      {items.map((item) => (
        <div key={item.label} className="planner-panel p-2 text-center">
          <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.color}`} />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
          <p className={`font-display font-bold text-sm ${item.label === 'Diferencia' ? item.color : ''}`}>
            {formatUSD(item.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
