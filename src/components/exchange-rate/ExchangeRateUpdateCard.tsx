import { RefreshCw, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ExchangeRateUpdateCardProps = {
  editRate: string;
  editNotes: string;
  fetching: boolean;
  onEditRateChange: (value: string) => void;
  onEditNotesChange: (value: string) => void;
  onUpdateManual: () => void;
  onFetchLive: () => void;
};

export function ExchangeRateUpdateCard({
  editRate,
  editNotes,
  fetching,
  onEditRateChange,
  onEditNotesChange,
  onUpdateManual,
  onFetchLive,
}: ExchangeRateUpdateCardProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold mb-4">Actualizar tasa de cambio</h3>
      <div className="space-y-3">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">COP por 1 USD</Label>
            <Input
              type="number"
              value={editRate}
              onChange={(event) => onEditRateChange(event.target.value)}
              className="bg-secondary/30 mt-1"
            />
          </div>
          <Button onClick={onUpdateManual} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Actualizar
          </Button>
          <Button variant="outline" onClick={onFetchLive} disabled={fetching} className="gap-2">
            <Wifi className="w-4 h-4" /> {fetching ? 'Buscando...' : 'Buscar en vivo'}
          </Button>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Notas</Label>
          <Textarea
            value={editNotes}
            onChange={(event) => onEditNotesChange(event.target.value)}
            className="bg-secondary/30 mt-1 min-h-[60px]"
            placeholder="Ej. tasa de Remitly de hoy"
          />
        </div>
      </div>
    </div>
  );
}
