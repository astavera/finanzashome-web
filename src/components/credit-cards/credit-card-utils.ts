import type { CreditCard } from '@/lib/types';

export function getUtilization(card: CreditCard) {
  if (card.credit_limit <= 0) return 0;
  return (card.current_balance / card.credit_limit) * 100;
}

export function getCreditCardTotals(creditCards: CreditCard[]) {
  const totalBalance = creditCards.reduce((sum, card) => sum + card.current_balance, 0);
  const totalLimit = creditCards.reduce((sum, card) => sum + card.credit_limit, 0);
  const totalAvailable = Math.max(0, totalLimit - totalBalance);
  const overallUtilization = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

  return {
    totalBalance,
    totalLimit,
    totalAvailable,
    overallUtilization,
  };
}

export function getOrdinal(day: number) {
  return `Dia ${day}`;
}
