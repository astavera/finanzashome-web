import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';

export function ResetSettings() {
  const [showReset, setShowReset] = useState(false);

  return (
    <>
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-destructive">Restablecer datos de ejemplo</h3>
            <p className="text-xs text-muted-foreground mt-1">Restaura los datos a los valores iniciales</p>
          </div>
          <Button variant="destructive" size="sm" className="gap-2" onClick={() => setShowReset(true)}>
            <RotateCcw className="w-4 h-4" /> Restablecer
          </Button>
        </div>
      </div>

      <DeleteConfirmation
        open={showReset}
        onOpenChange={setShowReset}
        title="Restablecer todos los datos"
        description="Esto restaurara los datos a los valores de ejemplo originales. Se perderan tus cambios."
        onConfirm={() => {
          toast.error('El restablecimiento local ya no esta conectado. Usa el flujo de seed/reset de Supabase.');
          setShowReset(false);
        }}
      />
    </>
  );
}
