import type { ExpenseCategory, WeeklyExpense } from './types';

export function statusLabel(status: WeeklyExpense['status']) {
  if (status === 'Paid') return 'Pagado';
  if (status === 'Pending') return 'Pendiente';
  return 'Parcial';
}

export function categoryLabel(category: ExpenseCategory | string) {
  const labels: Record<string, string> = {
    Housing: 'Vivienda',
    Groceries: 'Mercado',
    Transport: 'Transporte',
    Auto: 'Auto',
    Food: 'Comida',
    Utilities: 'Servicios',
    Subscriptions: 'Suscripciones',
    Health: 'Salud',
    Colombia: 'Colombia',
    Home: 'Hogar',
    Entertainment: 'Entretenimiento',
    Other: 'Otros',
  };

  return labels[category] ?? category;
}
