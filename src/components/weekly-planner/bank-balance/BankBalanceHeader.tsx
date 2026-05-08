import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { formatUSD } from '@/lib/currency';

type BankBalanceHeaderProps = {
  totalDifference: number;
};

export function BankBalanceHeader({ totalDifference }: BankBalanceHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md border border-border bg-muted/35 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-base">Seguimiento semanal del banco</h3>
          <p className="text-xs text-muted-foreground">Compara tu ingreso real vs presupuesto semanal</p>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold ${totalDifference >= 0 ? 'border-border bg-muted/35 text-positive' : 'border-destructive/30 bg-destructive/5 text-negative'}`}>
        {totalDifference >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {formatUSD(totalDifference)}
      </div>
    </div>
  );
}
