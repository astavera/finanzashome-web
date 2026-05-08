import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Folder, RotateCcw } from 'lucide-react';
import { FixedExpensesManager } from '@/components/weekly-planner/FixedExpensesManager';
import { WeekCard } from '@/components/weekly-planner/WeekCard';
import { useFinancialConfig } from '@/hooks/use-financial-config';
import { useWeeklyPlannerData } from '@/hooks/use-weekly-planner-data';
import {
  formatMonthLabel,
  getFridayForWeekOfMonth,
  isSameMonth,
  shiftMonth,
} from '@/lib/date-ranges';
import { formatUSD } from '@/lib/currency';
import { toast } from 'sonner';

const weeks = [1, 2, 3, 4];

function getWeekFromSearch(searchParams: URLSearchParams) {
  const week = Number(searchParams.get('week'));
  return weeks.includes(week) ? week : 1;
}

export default function FixedExpenses() {
  const [selectedMonth, setSelectedMonth] = useState(() => new Date());
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedWeek, setSelectedWeek] = useState(() => getWeekFromSearch(searchParams));
  const weeklyPlannerData = useWeeklyPlannerData(selectedMonth);
  const financialConfig = useFinancialConfig();
  const { fixedExpenses, weeklyExpenses } = weeklyPlannerData;
  const config = financialConfig.data;
  const extraIncomes = config?.extraIncomes ?? { 1: 0, 2: 0, 3: 0, 4: 0 };
  const weeklyIncome = config?.weeklyIncome ?? 1536;
  const paidTotal = weeklyExpenses
    .filter((expense) => expense.status === 'Paid')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const pendingTotal = weeklyExpenses
    .filter((expense) => expense.status !== 'Paid')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const monthTotal = paidTotal + pendingTotal;
  const viewingCurrentMonth = isSameMonth(selectedMonth);
  const selectedWeekExpenses = weeklyExpenses.filter((expense) => expense.week_number === selectedWeek);
  const selectedWeekFixedExpenses = fixedExpenses.filter((expense) => expense.week_number === selectedWeek);
  const selectedWeekFixedTotal = selectedWeekFixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const weekSummaries = useMemo(() => weeks.map((week) => {
    const weekExpenses = weeklyExpenses.filter((expense) => expense.week_number === week);
    const weekFixedExpenses = fixedExpenses.filter((expense) => expense.week_number === week);

    return {
      week,
      pending: weekExpenses.filter((expense) => expense.status !== 'Paid').length,
      count: weekExpenses.length,
      total: weekExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      fixedTotal: weekFixedExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    };
  }), [fixedExpenses, weeklyExpenses]);

  useEffect(() => {
    setSelectedWeek(getWeekFromSearch(searchParams));
  }, [searchParams]);

  const handleSelectWeek = (week: number) => {
    setSelectedWeek(week);
    setSearchParams({ week: String(week) });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 animate-fade-in">
      <div className="planner-card flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {viewingCurrentMonth ? 'Mes activo' : 'Historial mensual'}
          </p>
          <h1 className="font-display text-2xl font-semibold capitalize tracking-tight">
            {formatMonthLabel(selectedMonth)}
          </h1>
          <p className="text-sm text-muted-foreground">
            {viewingCurrentMonth
              ? 'Gastos fijos organizados por viernes de pago.'
              : 'Vista guardada de lo pagado y pendiente en ese mes.'}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              type="button"
              className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedMonth((month) => shiftMonth(month, -1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Anterior
            </button>
            <button
              type="button"
              className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedMonth(new Date())}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Hoy
            </button>
            <button
              type="button"
              className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedMonth((month) => shiftMonth(month, 1))}
            >
              Siguiente
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-sm">
          <div className="planner-panel px-2.5 py-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
            <p className="font-semibold">{formatUSD(monthTotal)}</p>
          </div>
          <div className="planner-panel px-2.5 py-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Pendiente</p>
            <p className="font-semibold">{formatUSD(pendingTotal)}</p>
          </div>
          <div className="planner-panel px-2.5 py-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Pagado</p>
            <p className="font-semibold">{formatUSD(paidTotal)}</p>
          </div>
        </div>
      </div>

      {weeklyPlannerData.error && (
        <div className="planner-card p-4 text-center text-sm text-destructive">
          {weeklyPlannerData.error instanceof Error ? weeklyPlannerData.error.message : 'No se pudieron cargar los gastos fijos'}
        </div>
      )}

      {financialConfig.error && (
        <div className="planner-card p-4 text-center text-sm text-destructive">
          {financialConfig.error instanceof Error ? financialConfig.error.message : 'No se pudo cargar la configuracion financiera'}
        </div>
      )}

      <div className="grid gap-3 xl:grid-cols-[220px_minmax(0,1fr)_360px]">
        <aside className="planner-card h-fit p-3 xl:sticky xl:top-20">
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Semanas del mes</p>
            <h2 className="font-display text-base font-semibold">Carpetas</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {weekSummaries.map((summary) => (
              <button
                key={summary.week}
                type="button"
                onClick={() => handleSelectWeek(summary.week)}
                className={`rounded-md border p-2 text-left transition-colors ${
                  selectedWeek === summary.week
                    ? 'border-foreground/30 bg-muted/70 text-foreground'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  <span className="text-sm font-semibold">Semana {summary.week}</span>
                  {summary.pending > 0 && (
                    <span className="ml-auto rounded border border-border bg-card px-1.5 py-0.5 text-[10px]">
                      {summary.pending}
                    </span>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
                  <span>{formatUSD(summary.total)}</span>
                  <span className="text-right">{summary.count} items</span>
                  <span className="text-muted-foreground">Fijos</span>
                  <span className="text-right">{formatUSD(summary.fixedTotal)}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section id={`week-${selectedWeek}`} className="min-w-0 scroll-mt-24">
          <WeekCard
            week={selectedWeek}
            weeklyIncome={weeklyIncome}
            expenses={selectedWeekExpenses}
            extraIncome={extraIncomes[selectedWeek] || 0}
            dueDate={getFridayForWeekOfMonth(selectedWeek, selectedMonth)}
            onExtraIncomeChange={(value) => {
              financialConfig.updateExtraIncome(selectedWeek, value).catch((error) => {
                toast.error(error instanceof Error ? error.message : 'No se pudo actualizar el ingreso extra');
              });
            }}
            onStatusChange={(id, status) => {
              weeklyPlannerData.updateExpense(id, { status }).catch((error) => {
                toast.error(error instanceof Error ? error.message : 'No se pudo actualizar el gasto');
              });
            }}
            onUpdateExpense={(id, updates) => {
              weeklyPlannerData.updateExpense(id, updates).catch((error) => {
                toast.error(error instanceof Error ? error.message : 'No se pudo actualizar el gasto');
              });
            }}
            onDeleteExpense={(id) => {
              weeklyPlannerData.deleteExpense(id).catch((error) => {
                toast.error(error instanceof Error ? error.message : 'No se pudo eliminar el gasto');
              });
            }}
          />

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="planner-panel p-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Semana</p>
              <p className="text-sm font-semibold">Semana {selectedWeek}</p>
            </div>
            <div className="planner-panel p-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Fijos</p>
              <p className="text-sm font-semibold">{formatUSD(selectedWeekFixedTotal)}</p>
            </div>
            <div className="planner-panel p-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Items</p>
              <p className="text-sm font-semibold">{selectedWeekExpenses.length}</p>
            </div>
          </div>
        </section>

        <aside className="xl:sticky xl:top-20 xl:h-fit">
          <FixedExpensesManager
            fixedExpenses={fixedExpenses}
            selectedWeek={selectedWeek}
            onAdd={(expense) => {
              weeklyPlannerData.addFixedExpense(expense).catch((error) => {
                toast.error(error instanceof Error ? error.message : 'No se pudo agregar el gasto fijo');
              });
            }}
            onUpdate={(id, updates) => {
              weeklyPlannerData.updateFixedExpense(id, updates).catch((error) => {
                toast.error(error instanceof Error ? error.message : 'No se pudo actualizar el gasto fijo');
              });
            }}
            onDelete={(id) => {
              weeklyPlannerData.deleteFixedExpense(id).catch((error) => {
                toast.error(error instanceof Error ? error.message : 'No se pudo eliminar el gasto');
              });
            }}
          />
        </aside>
      </div>
    </div>
  );
}
