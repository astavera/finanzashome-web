import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  ConversionCalculator,
  CurrentExchangeRateCard,
  ExchangeRateUpdateCard,
  QuickReferenceCard,
} from '@/components/exchange-rate';
import { useFinancialConfig } from '@/hooks/use-financial-config';

const DEFAULT_EXCHANGE_RATE = {
  provider_name: 'Remitly',
  rate_cop_per_usd: 4000,
  last_updated: new Date().toISOString().slice(0, 10),
  source: 'manual' as const,
};

export default function ExchangeRatePage() {
  const financialConfig = useFinancialConfig();
  const exchangeRate = financialConfig.data?.exchangeRate ?? DEFAULT_EXCHANGE_RATE;
  const [usdInput, setUsdInput] = useState('100');
  const [copInput, setCopInput] = useState('400000');
  const [editRate, setEditRate] = useState(String(exchangeRate.rate_cop_per_usd));
  const [editNotes, setEditNotes] = useState(exchangeRate.notes || '');
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setEditRate(String(exchangeRate.rate_cop_per_usd));
    setEditNotes(exchangeRate.notes || '');
  }, [exchangeRate.last_updated, exchangeRate.notes, exchangeRate.rate_cop_per_usd]);

  const updateManualRate = async () => {
    await financialConfig.updateExchangeRate({
      rate_cop_per_usd: Number(editRate),
      source: 'manual',
      notes: editNotes || 'Actualizacion manual',
    });
    toast.success('Tasa de cambio actualizada');
  };

  const fetchLiveRate = async () => {
    setFetching(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) throw new Error('No se pudo obtener la tasa');

      const data = await response.json();
      const copRate = data.rates?.COP;
      if (!copRate) throw new Error('No se pudo obtener la tasa');

      const roundedRate = Math.round(copRate);
      setEditRate(String(roundedRate));
      await financialConfig.updateExchangeRate({
        rate_cop_per_usd: roundedRate,
        source: 'live',
        notes: 'Tasa en vivo desde exchangerate-api.com (aproximacion a Remitly)',
      });
      toast.success(`Tasa en vivo obtenida: 1 USD = ${roundedRate.toLocaleString()} COP`);
    } catch {
      toast.error('No se pudo obtener la tasa en vivo. Actualizala manualmente.');
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Tasa de cambio</h1>
        <p className="text-muted-foreground text-sm">Tasa COP/USD de Remitly para metas de Colombia</p>
      </div>

      <CurrentExchangeRateCard exchangeRate={exchangeRate} />
      <ExchangeRateUpdateCard
        editRate={editRate}
        editNotes={editNotes}
        fetching={fetching}
        onEditRateChange={setEditRate}
        onEditNotesChange={setEditNotes}
        onUpdateManual={updateManualRate}
        onFetchLive={fetchLiveRate}
      />
      <ConversionCalculator
        usdInput={usdInput}
        copInput={copInput}
        rate={exchangeRate.rate_cop_per_usd}
        onUsdChange={setUsdInput}
        onCopChange={setCopInput}
      />
      <QuickReferenceCard rate={exchangeRate.rate_cop_per_usd} />
    </div>
  );
}
