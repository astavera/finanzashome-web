import { BankBalanceTracker } from '@/components/weekly-planner/BankBalanceTracker';
import { CarPayoffPlan } from '@/components/weekly-planner/CarPayoffPlan';
import { MonthlySummary } from '@/components/weekly-planner/MonthlySummary';
import { useWeeklyPlannerData } from '@/hooks/use-weekly-planner-data';
import { toast } from 'sonner';
import { useFinancialConfig } from '@/hooks/use-financial-config';

export default function WeeklyPlanner() {
  const weeklyPlannerData = useWeeklyPlannerData();
  const financialConfig = useFinancialConfig();
  const { weeklyExpenses } = weeklyPlannerData;
  const config = financialConfig.data;
  const extraIncomes = config?.extraIncomes ?? { 1: 0, 2: 0, 3: 0, 4: 0 };
  const bankBalances = config?.bankBalances ?? [];
  const carPayoff = config?.carPayoff ?? [];
  const accumulatedCarSavings = config?.accumulatedCarSavings ?? 0;
  const appliedCarPaymentsToDate = config?.appliedCarPaymentsToDate ?? 0;
  const monthlyAllocations = config?.monthlyAllocations ?? [];
  const exchangeRate = config?.exchangeRate ?? {
    provider_name: 'Remitly',
    rate_cop_per_usd: 4000,
    last_updated: new Date().toISOString().slice(0, 10),
    source: 'manual' as const,
  };
  const weeklyIncome = config?.weeklyIncome ?? 1536;

  const weeks = [1, 2, 3, 4];

  const totalRemaining = weeks.reduce((sum, w) => {
    const weekExpenses = weeklyExpenses.filter((e) => e.week_number === w);
    const total = weekExpenses.reduce((s, e) => s + e.amount, 0);
    return sum + (weeklyIncome + (extraIncomes[w] || 0) - total);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight mb-1">Planificador semanal</h1>
        <p className="text-muted-foreground text-sm">Organiza el presupuesto del hogar semana por semana</p>
      </div>

      {weeklyPlannerData.isLoading && (
        <div className="planner-card p-4 text-center text-sm text-muted-foreground">
          Cargando gastos semanales...
        </div>
      )}

      {weeklyPlannerData.error && (
        <div className="planner-card p-4 text-center text-sm text-destructive">
          {weeklyPlannerData.error instanceof Error ? weeklyPlannerData.error.message : 'No se pudieron cargar los gastos semanales'}
        </div>
      )}

      {financialConfig.error && (
        <div className="planner-card p-4 text-center text-sm text-destructive">
          {financialConfig.error instanceof Error ? financialConfig.error.message : 'No se pudo cargar la configuracion financiera'}
        </div>
      )}

      <BankBalanceTracker bankBalances={bankBalances} onUpdate={(week, updates) => {
        financialConfig.updateBankBalance(week, updates).catch((error) => {
          toast.error(error instanceof Error ? error.message : 'No se pudo actualizar el balance bancario');
        });
      }} />
      <CarPayoffPlan
        carPayoff={carPayoff}
        onUpdate={(week, updates) => {
          financialConfig.updateCarPayoff(week, updates).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'No se pudo actualizar el pago del carro');
          });
        }}
        accumulatedSavings={accumulatedCarSavings}
        appliedPaymentsToDate={appliedCarPaymentsToDate}
        onAccumulatedChange={(value) => {
          financialConfig.updateAccumulatedSavings(value).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'No se pudo actualizar el ahorro acumulado');
          });
        }}
      />
      <MonthlySummary
        totalRemaining={totalRemaining}
        allocations={monthlyAllocations}
        onUpdateAllocation={(index, updates) => {
          financialConfig.updateAllocation(index, updates).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'No se pudo actualizar la asignacion');
          });
        }}
        onAddAllocation={(allocation) => {
          financialConfig.addAllocation(allocation).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'No se pudo agregar la asignacion');
          });
        }}
        onDeleteAllocation={(index) => {
          financialConfig.deleteAllocation(index).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'No se pudo eliminar la asignacion');
          });
        }}
        exchangeRate={exchangeRate}
        weeklyExpenses={weeklyExpenses}
      />
    </div>
  );
}
