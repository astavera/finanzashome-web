import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Project } from '@/lib/types';

type ProjectCurrency = Project['currency'];

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Omit<Project, 'id'>) => void;
  initialData?: Project | null;
}

export function ProjectForm({ open, onOpenChange, onSave, initialData }: ProjectFormProps) {
  const [form, setForm] = useState({
    project_name: '',
    target_amount: '',
    current_amount: '',
    currency: 'USD' as 'USD' | 'COP',
    country_tag: 'US',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        project_name: initialData.project_name,
        target_amount: String(initialData.target_amount),
        current_amount: String(initialData.current_amount),
        currency: initialData.currency,
        country_tag: initialData.country_tag || 'US',
        notes: initialData.notes || '',
      });
    } else {
      setForm({ project_name: '', target_amount: '', current_amount: '0', currency: 'USD', country_tag: 'US', notes: '' });
    }
  }, [initialData, open]);

  const handleSave = () => {
    if (!form.project_name || !form.target_amount) return;
    onSave({
      project_name: form.project_name,
      target_amount: +form.target_amount,
      current_amount: +form.current_amount || 0,
      currency: form.currency,
      country_tag: form.country_tag,
      notes: form.notes || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{initialData ? 'Editar meta' : 'Agregar meta'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Nombre del proyecto</Label>
            <Input value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} className="bg-secondary/30 mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Moneda</Label>
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as ProjectCurrency, country_tag: e.target.value === 'COP' ? 'CO' : 'US' })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                <option value="USD">USD</option>
                <option value="COP">COP</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Pais</Label>
              <select value={form.country_tag} onChange={(e) => setForm({ ...form, country_tag: e.target.value })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                <option value="US">Estados Unidos</option>
                <option value="CO">Colombia</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Meta</Label>
              <Input type="number" value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Ahorrado actual</Label>
              <Input type="number" value={form.current_amount} onChange={(e) => setForm({ ...form, current_amount: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Notas</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-secondary/30 mt-1 min-h-[60px]" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleSave}>{initialData ? 'Guardar cambios' : 'Agregar meta'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
