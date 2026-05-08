import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreditCard } from '@/lib/types';

export function CardFormDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
  saving = false,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData?: CreditCard | null;
  onSave: (card: Partial<CreditCard> & { card_name: string }) => void;
  saving?: boolean;
}) {
  const [form, setForm] = useState({
    card_name: '', issuer: '', network: 'Visa', last4: '',
    credit_limit: '', current_balance: '0', closing_date: '', due_date: '',
    color_from: '#2a2a4a', color_to: '#4a4a6a', image_url: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        card_name: initialData.card_name,
        issuer: initialData.issuer,
        network: initialData.network,
        last4: initialData.last4,
        credit_limit: String(initialData.credit_limit),
        current_balance: String(initialData.current_balance),
        closing_date: String(initialData.closing_date),
        due_date: String(initialData.due_date),
        color_from: initialData.color_from,
        color_to: initialData.color_to,
        image_url: initialData.image_url || '',
      });
    } else if (open) {
      setForm({
        card_name: '', issuer: '', network: 'Visa', last4: '',
        credit_limit: '', current_balance: '0', closing_date: '', due_date: '',
        color_from: '#2a2a4a', color_to: '#4a4a6a', image_url: '',
      });
    }
  }, [initialData, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{initialData ? 'Editar tarjeta' : 'Agregar tarjeta de credito'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Nombre de la tarjeta</Label>
            <Input value={form.card_name} onChange={(e) => setForm({ ...form, card_name: e.target.value })} className="mt-1 bg-secondary/30" placeholder="Ej. Apple Card" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Banco emisor</Label>
              <Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="mt-1 bg-secondary/30" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Red</Label>
              <select value={form.network} onChange={(e) => setForm({ ...form, network: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm">
                <option>Visa</option><option>Mastercard</option><option>Amex</option><option>Discover</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Ultimos 4 digitos</Label>
              <Input value={form.last4} maxLength={4} onChange={(e) => setForm({ ...form, last4: e.target.value })} className="mt-1 bg-secondary/30" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Limite de credito</Label>
              <Input type="number" value={form.credit_limit} onChange={(e) => setForm({ ...form, credit_limit: e.target.value })} className="mt-1 bg-secondary/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Fecha de cierre (dia)</Label>
              <Input type="number" min={1} max={31} value={form.closing_date} onChange={(e) => setForm({ ...form, closing_date: e.target.value })} className="mt-1 bg-secondary/30" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Fecha de pago (dia)</Label>
              <Input type="number" min={1} max={31} value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="mt-1 bg-secondary/30" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">URL de imagen de la tarjeta (opcional)</Label>
            <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="mt-1 bg-secondary/30" placeholder="https://..." />
          </div>
          <Button className="w-full" disabled={saving} onClick={() => {
            if (form.card_name && form.last4) {
              onSave({
                card_name: form.card_name,
                issuer: form.issuer,
                network: form.network,
                last4: form.last4,
                credit_limit: +form.credit_limit || 0,
                current_balance: +form.current_balance || 0,
                closing_date: +form.closing_date || 1,
                due_date: +form.due_date || 15,
                color_from: form.color_from,
                color_to: form.color_to,
                image_url: form.image_url || undefined,
              });
            }
          }}>{saving ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Agregar tarjeta'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
