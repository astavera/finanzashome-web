import {
  ArrowLeftRight,
  CalendarDays,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  RefreshCw,
  ReceiptText,
  Settings,
  WalletCards,
} from 'lucide-react';

export const appNavItems = [
  { title: 'Panel principal', shortTitle: 'Inicio', url: '/', icon: LayoutDashboard, group: 'main' },
  { title: 'Planificador semanal', shortTitle: 'Plan', url: '/planner', icon: CalendarDays, group: 'main' },
  { title: 'Gastos fijos', shortTitle: 'Fijos', url: '/fixed-expenses', icon: ReceiptText, group: 'main' },
  { title: 'Tarjetas de credito', shortTitle: 'Tarjetas', url: '/cards', icon: CreditCard, group: 'main' },
  { title: 'Billetera', shortTitle: 'Billetera', url: '/wallet', icon: WalletCards, group: 'main' },
  { title: 'Transacciones', shortTitle: 'Historial', url: '/transactions', icon: ArrowLeftRight, group: 'money' },
  { title: 'Proyectos', shortTitle: 'Metas', url: '/projects', icon: FolderKanban, group: 'money' },
  { title: 'Tasa de cambio', shortTitle: 'Tasa', url: '/exchange', icon: RefreshCw, group: 'money' },
  { title: 'Ajustes', shortTitle: 'Ajustes', url: '/settings', icon: Settings, group: 'system' },
] as const;

export const topNavItems = appNavItems.filter((item) =>
  ['/', '/planner', '/fixed-expenses', '/cards', '/wallet', '/projects'].includes(item.url),
);

export const settingsNavItems = appNavItems.filter((item) =>
  ['/transactions', '/exchange', '/settings'].includes(item.url),
);

export const mobileNavItems = appNavItems.filter((item) =>
  ['/', '/planner', '/fixed-expenses', '/cards', '/settings'].includes(item.url),
);

export function getNavTitle(pathname: string) {
  return appNavItems.find((item) => item.url === pathname)?.title ?? 'Finanzas Hogar';
}
