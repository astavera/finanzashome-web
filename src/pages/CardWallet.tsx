import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ReceiptText, TrendingUp, WalletCards } from 'lucide-react';
import { toast } from 'sonner';
import { WalletCardStack } from '@/components/card-wallet/WalletCardStack';
import {
  WalletPurchasePanel,
  type WalletPurchaseForm,
} from '@/components/card-wallet/WalletPurchasePanel';
import { getCurrentWeekNumber } from '@/components/card-wallet/card-wallet-utils';
import { useCreditCardsQuery, useTransactionsQuery } from '@/hooks/use-financial-data';
import { formatUSD } from '@/lib/currency';
import { categoryLabel } from '@/lib/labels';
import type { Transaction } from '@/lib/types';
import { createTransaction } from '@/services/transactions';
import { updateCreditCard } from '@/services/credit-cards';

function createEmptyForm(date: string): WalletPurchaseForm {
  return {
    merchant: '',
    amount: '',
    category: 'Other',
    date,
    paid_by: 'Sebas',
    notes: '',
  };
}

export default function CardWalletPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data: creditCards = [], isLoading: cardsLoading, error: cardsError } = useCreditCardsQuery();
  const { data: transactions = [] } = useTransactionsQuery();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [form, setForm] = useState<WalletPurchaseForm>(() => createEmptyForm(today));

  const selectedCard = useMemo(
    () => creditCards.find((card) => card.id === selectedCardId) ?? null,
    [creditCards, selectedCardId],
  );
  const currentMonthKey = today.slice(0, 7);
  const currentWeekNumber = getCurrentWeekNumber(today);
  const creditCardIds = useMemo(
    () => new Set(creditCards.map((card) => card.id)),
    [creditCards],
  );
  const cardTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.card_id && creditCardIds.has(transaction.card_id)),
    [transactions, creditCardIds],
  );
  const currentMonthTransactions = useMemo(
    () => cardTransactions.filter((transaction) => transaction.date.startsWith(currentMonthKey)),
    [cardTransactions, currentMonthKey],
  );
  const currentWeekTransactions = useMemo(
    () => currentMonthTransactions
      .filter((transaction) => transaction.week_number === currentWeekNumber),
    [currentMonthTransactions, currentWeekNumber],
  );
  const currentWeekRecentTransactions = useMemo(
    () => [...currentWeekTransactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6),
    [currentWeekTransactions],
  );
  const monthlySummary = useMemo(
    () => buildMonthlySummary(currentMonthTransactions),
    [currentMonthTransactions],
  );

  const resetForm = () => {
    setForm(createEmptyForm(today));
  };

  const createPurchaseMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCard) {
        throw new Error('Selecciona una tarjeta.');
      }

      const amount = Number(form.amount);
      if (!form.merchant.trim() || !amount || amount <= 0) {
        throw new Error('Completa comercio y monto.');
      }

      const transaction = await createTransaction({
        date: form.date,
        amount,
        currency: 'USD',
        merchant: form.merchant.trim(),
        category: form.category,
        card_id: selectedCard.id,
        week_number: getCurrentWeekNumber(form.date),
        paid_by: form.paid_by,
        notes: form.notes.trim() || undefined,
      });

      await updateCreditCard(selectedCard.id, {
        current_balance: selectedCard.current_balance + amount,
      });

      return transaction;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['credit-cards'] }),
      ]);
      toast.success('Compra registrada en gastos de tarjeta.');
      resetForm();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'No se pudo registrar la compra.');
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <section className="relative overflow-hidden rounded-[34px] border border-slate-200/70 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),rgba(241,245,249,0.82)_38%,rgba(226,232,240,0.68)_100%)] px-6 py-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.9),rgba(15,23,42,0.92)_38%,rgba(2,6,23,0.98)_100%)] md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.08),transparent_34%)]" />
        <div className="relative flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al panel
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              <WalletCards className="h-3.5 w-3.5 text-slate-700 dark:text-slate-200" />
              Flujo de billetera
            </div>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-display font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Recordemos siempre, analicemos antes de comprar.
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
              Siempre analicemos las compras que hacemos.
            </p>
          </div>
        </div>
      </section>

      {cardsLoading && (
        <div className="glass-card p-10 text-center text-muted-foreground">
          Cargando tarjetas...
        </div>
      )}

      {cardsError && (
        <div className="glass-card p-10 text-center text-destructive">
          {cardsError instanceof Error ? cardsError.message : 'No se pudieron cargar las tarjetas.'}
        </div>
      )}

      {!cardsLoading && !cardsError && creditCards.length > 0 && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,252,0.94))] p-5 shadow-[0_28px_80px_-38px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.92))] md:p-6">
            {!selectedCard ? (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-slate-950 dark:text-white">Tus tarjetas</h2>
                  <p className="text-sm text-muted-foreground">
                    Toca una tarjeta para abrir compra rapida y actividad reciente.
                  </p>
                </div>

                <WalletCardStack
                  cards={creditCards}
                  selectedCardId={null}
                  onSelectCard={setSelectedCardId}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedCardId(null)}
                  className="inline-flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition-colors hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Ver tarjetas
                </button>

                <WalletCardStack
                  cards={[selectedCard]}
                  selectedCardId={selectedCard.id}
                  onSelectCard={() => undefined}
                  renderSelectedCardContent={(card) => {
                    const cardTransactions = transactions
                      .filter((transaction) => transaction.card_id === card.id)
                      .slice(0, 5);

                    return (
                      <WalletPurchasePanel
                        selectedCard={card}
                        recentTransactions={cardTransactions}
                        form={form}
                        onFormChange={(updates) => setForm((current) => ({ ...current, ...updates }))}
                        onSubmit={() => createPurchaseMutation.mutate()}
                        onClear={resetForm}
                        saving={createPurchaseMutation.isPending}
                      />
                    );
                  }}
                />
              </div>
            )}
          </div>

          <WeeklySpendingPanel
            weekNumber={currentWeekNumber}
            transactions={currentWeekRecentTransactions}
            total={currentWeekTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)}
          />

          <MonthlySummaryPanel
            summary={monthlySummary}
            monthLabel={formatMonthLabel(today)}
          />
        </section>
      )}
    </div>
  );
}

function WeeklySpendingPanel({
  weekNumber,
  transactions,
  total,
}: {
  weekNumber: number;
  transactions: Transaction[];
  total: number;
}) {
  return (
    <aside className="rounded-[32px] border border-slate-200/70 bg-white/95 p-5 shadow-[0_22px_70px_-44px_rgba(15,23,42,0.42)] dark:border-white/10 dark:bg-slate-950/90 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Semana {weekNumber}
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-slate-950 dark:text-white">
            Gastos de la semana
          </h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          <ReceiptText className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
        <p className="text-xs text-slate-500 dark:text-slate-400">Total usado</p>
        <p className="mt-1 font-display text-3xl font-semibold text-slate-950 dark:text-white">
          {formatUSD(total)}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            No hay compras registradas esta semana.
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-950 dark:text-white">{transaction.merchant}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {transaction.date} - {categoryLabel(transaction.category)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-slate-950 dark:text-white">
                  {formatUSD(transaction.amount)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

function MonthlySummaryPanel({
  summary,
  monthLabel,
}: {
  summary: MonthlySummary;
  monthLabel: string;
}) {
  return (
    <div className="rounded-[32px] border border-slate-200/70 bg-white/95 p-5 shadow-[0_22px_70px_-44px_rgba(15,23,42,0.42)] dark:border-white/10 dark:bg-slate-950/90 md:p-6 xl:col-span-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {monthLabel}
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-slate-950 dark:text-white">
            Resumen del mes
          </h2>
        </div>
        <CalendarDays className="h-5 w-5 text-slate-500 dark:text-slate-300" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <SummaryTile label="Total gastado" value={formatUSD(summary.total)} icon={<TrendingUp className="h-4 w-4" />} />
        <SummaryTile label="Compras" value={String(summary.count)} icon={<ReceiptText className="h-4 w-4" />} />
        <SummaryTile label="Promedio" value={formatUSD(summary.average)} icon={<WalletCards className="h-4 w-4" />} />
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {summary.categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 md:col-span-2">
            Aun no hay actividad para este mes.
          </div>
        ) : (
          summary.categories.map((category) => (
            <div key={category.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{categoryLabel(category.label)}</span>
              <span className="text-sm font-semibold text-slate-950 dark:text-white">{formatUSD(category.amount)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SummaryTile({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <span className="text-slate-500 dark:text-slate-300">{icon}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

type MonthlySummary = {
  total: number;
  count: number;
  average: number;
  categories: Array<{ label: string; amount: number }>;
};

function buildMonthlySummary(transactions: Transaction[]): MonthlySummary {
  const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const categories = transactions.reduce<Record<string, number>>((groups, transaction) => {
    groups[transaction.category] = (groups[transaction.category] ?? 0) + transaction.amount;
    return groups;
  }, {});

  return {
    total,
    count: transactions.length,
    average: transactions.length ? total / transactions.length : 0,
    categories: Object.entries(categories)
      .map(([label, amount]) => ({ label, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4),
  };
}

function formatMonthLabel(date: string) {
  return new Intl.DateTimeFormat('es-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}
