import { TrendingUp } from 'lucide-react';
import { formatUSD } from '@/lib/currency';

type StatementPredictorProps = {
  estimatedStatement: number;
  canStillSpend: number;
  recommendedPayment: number;
};

export function StatementPredictor({ estimatedStatement, canStillSpend, recommendedPayment }: StatementPredictorProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-info" />
        <h3 className="font-display font-semibold">Prediccion del estado</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Si el gasto continua a este ritmo, el estado podria cerrar cerca de{' '}
        <span className="font-semibold text-foreground">{formatUSD(estimatedStatement)}</span>.
      </p>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-secondary/30 rounded-xl p-3">
          <p className="text-muted-foreground">Puedes gastar bajo 30%</p>
          <p className="font-bold text-positive">{formatUSD(canStillSpend)}</p>
        </div>
        <div className="bg-secondary/30 rounded-xl p-3">
          <p className="text-muted-foreground">Pago recomendado</p>
          <p className="font-bold">{formatUSD(recommendedPayment)}</p>
        </div>
      </div>
    </div>
  );
}
