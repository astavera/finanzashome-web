import { CheckCircle2, Circle } from 'lucide-react';
import { formatUSD } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { MONTHLY_PAYMENT } from '../car-payoff-utils';

type MonthlyPaymentToggleProps = {
  monthlyPaid: boolean;
  onToggle: () => void;
};

export function MonthlyPaymentToggle({ monthlyPaid, onToggle }: MonthlyPaymentToggleProps) {
  return (
    <div className="mb-3 planner-panel p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Pago Mensual del Carro</p>
          <p className="text-xs text-muted-foreground">Cuota obligatoria de {formatUSD(MONTHLY_PAYMENT)}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
            monthlyPaid ? 'border-foreground/25 bg-background text-positive' : 'border-border bg-background text-muted-foreground hover:text-foreground',
          )}
        >
          {monthlyPaid ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          {monthlyPaid ? 'Pagado' : 'Marcar como Pagado'}
        </button>
      </div>
    </div>
  );
}
