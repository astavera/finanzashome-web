import type { CreditCard, Transaction } from '@/lib/types';
import { RecentCardActivity } from './RecentCardActivity';
import { WalletPurchaseFormPanel } from './WalletPurchaseFormPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type WalletPurchaseForm = {
  merchant: string;
  amount: string;
  category: string;
  date: string;
  paid_by: string;
  notes: string;
};

export function WalletPurchasePanel({
  selectedCard,
  recentTransactions,
  form,
  onFormChange,
  onSubmit,
  onClear,
  saving,
}: {
  selectedCard: CreditCard;
  recentTransactions: Transaction[];
  form: WalletPurchaseForm;
  onFormChange: (updates: Partial<WalletPurchaseForm>) => void;
  onSubmit: () => void;
  onClear: () => void;
  saving: boolean;
}) {
  return (
    <div className="relative min-h-[310px] overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/95 shadow-[0_14px_34px_-26px_rgba(15,23,42,0.42)] dark:border-white/10 dark:bg-slate-950/95">
      <Tabs defaultValue="purchase" className="p-3.5">
        <TabsList className="grid h-10 w-full grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-white/8">
          <TabsTrigger value="purchase" className="rounded-lg text-xs">Compra</TabsTrigger>
          <TabsTrigger value="activity" className="rounded-lg text-xs">Actividad</TabsTrigger>
        </TabsList>
        <TabsContent value="purchase" className="mt-3">
          <WalletPurchaseFormPanel
            selectedCard={selectedCard}
            form={form}
            onFormChange={onFormChange}
            onSubmit={onSubmit}
            onClear={onClear}
            saving={saving}
            compact
          />
        </TabsContent>
        <TabsContent value="activity" className="mt-3">
          <RecentCardActivity selectedCard={selectedCard} recentTransactions={recentTransactions} compact />
        </TabsContent>
      </Tabs>
    </div>
  );
}
