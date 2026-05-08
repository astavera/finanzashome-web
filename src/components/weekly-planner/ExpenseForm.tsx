import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EXPENSE_CATEGORIES, PAID_BY_OPTIONS, STATUS_OPTIONS } from '@/lib/types';
import type { WeeklyExpense } from '@/lib/types';
import { categoryLabel, statusLabel } from '@/lib/labels';

type ExpenseStatus = WeeklyExpense['status'];

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (expense: Omit<WeeklyExpense, 'id'>) => void;
  initialData?: WeeklyExpense | null;
  weekNumber: number;
}

export function ExpenseForm({ open, onOpenChange, onSave, initialData, weekNumber }: ExpenseFormProps) {
  const [form, setForm] = useState({
    concept: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    paid_by: 'Sebas' as string,
    status: 'Pending' as 'Paid' | 'Pending' | 'Partial',
    category: 'Other' as string,
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        concept: initialData.concept,
        amount: String(initialData.amount),
        date: initialData.date,
        paid_by: initialData.paid_by,
        status: initialData.status,
        category: initialData.category,
        notes: initialData.notes || '',
      });
    } else {
      setForm({ concept: '', amount: '', date: new Date().toISOString().slice(0, 10), paid_by: 'Sebas', status: 'Pending', category: 'Other', notes: '' });
    }
  }, [initialData, open]);

  const handleSave = () => {
    if (!form.concept || !form.amount) return;
    onSave({
      week_number: weekNumber,
      concept: form.concept,
      amount: +form.amount,
      currency: 'USD',
      date: form.date,
      paid_by: form.paid_by,
      status: form.status,
      category: form.category,
      notes: form.notes || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{initialData ? 'Editar gasto' : 'Agregar gasto'} - Semana {weekNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Concepto</Label>
            <Input value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} className="mt-1 bg-background" placeholder="Ej. renta, mercado" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Monto (USD)</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="no-number-spinner mt-1 bg-background" placeholder="0.00" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Fecha</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 bg-background" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Quien paga</Label>
              <select value={form.paid_by} onChange={(e) => setForm({ ...form, paid_by: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                {PAID_BY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Estado</Label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ExpenseStatus })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Categoria</Label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Notas (opcional)</Label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 bg-background" placeholder="Agrega una nota..." />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleSave}>{initialData ? 'Guardar cambios' : 'Agregar gasto'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
