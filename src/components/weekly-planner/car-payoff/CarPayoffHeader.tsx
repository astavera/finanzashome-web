import { Car } from 'lucide-react';
import { PAYOFF_GOAL } from '../car-payoff-utils';

export function CarPayoffHeader() {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Car className="w-4 h-4 text-foreground" />
      <h3 className="font-display font-semibold text-base">Seguimiento del pago del carro</h3>
      <span className="ml-auto rounded-md border border-border bg-muted/35 px-2 py-0.5 text-xs text-muted-foreground">Meta: {PAYOFF_GOAL}</span>
    </div>
  );
}
