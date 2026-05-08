import { CreditCard as CreditCardIcon, PiggyBank, ShieldCheck, Wallet } from 'lucide-react';
import { formatUSD } from '@/lib/currency';
import type { CreditCard } from '@/lib/types';
import { CreditCardSummaryCard } from './CreditCardSummaryCard';
import { getCreditCardTotals } from './credit-card-utils';

type CreditCardsSummaryGridProps = {
  creditCards: CreditCard[];
};

export function CreditCardsSummaryGrid({ creditCards }: CreditCardsSummaryGridProps) {
  const totals = getCreditCardTotals(creditCards);

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CreditCardSummaryCard
        label="Tarjetas activas"
        value={String(creditCards.length)}
        helper="Registradas en este hogar"
        icon={<CreditCardIcon className="h-4 w-4" />}
      />
      <CreditCardSummaryCard
        label="Balance total"
        value={formatUSD(totals.totalBalance)}
        helper="Deuda entre todas las tarjetas"
        icon={<Wallet className="h-4 w-4" />}
      />
      <CreditCardSummaryCard
        label="Credito disponible"
        value={formatUSD(totals.totalAvailable)}
        helper="Disponible antes de llegar al limite"
        icon={<PiggyBank className="h-4 w-4" />}
      />
      <CreditCardSummaryCard
        label="Uso"
        value={`${totals.overallUtilization.toFixed(1)}%`}
        helper="Uso total del portafolio"
        icon={<ShieldCheck className="h-4 w-4" />}
        tone={totals.overallUtilization < 30 ? 'positive' : totals.overallUtilization < 50 ? 'warning' : 'negative'}
      />
    </section>
  );
}
