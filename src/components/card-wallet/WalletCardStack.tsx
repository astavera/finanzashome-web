import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { formatUSD } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { getCardImage, getCardSurface } from '@/lib/card-appearance';
import type { CreditCard } from '@/lib/types';

export function WalletCardStack({
  cards,
  selectedCardId,
  onSelectCard,
  renderSelectedCardContent,
}: {
  cards: CreditCard[];
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  renderSelectedCardContent?: (card: CreditCard) => ReactNode;
}) {
  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedCardId) ?? null,
    [cards, selectedCardId],
  );
  const inactiveCards = selectedCard
    ? cards.filter((card) => card.id !== selectedCard.id)
    : cards;

  if (!selectedCard) {
    return (
      <div className="mx-auto w-full max-w-[500px] pb-4 pt-1">
        {cards.map((card, index) => (
          <WalletCardButton
            key={card.id}
            card={card}
            index={index}
            selected={false}
            stacked
            onSelect={() => onSelectCard(card.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[520px] space-y-3 pb-4 pt-1">
      <div className="rounded-[30px] border border-slate-200/70 bg-white/80 p-3 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.65)] dark:border-white/10 dark:bg-white/5">
        <WalletCardButton
          card={selectedCard}
          index={0}
          selected
          onSelect={() => onSelectCard(selectedCard.id)}
        />

        {renderSelectedCardContent && (
          <div className="mt-2">
            {renderSelectedCardContent(selectedCard)}
          </div>
        )}
      </div>

      {inactiveCards.length > 0 && (
        <div className="px-1 pt-1">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Otras tarjetas
          </p>
          <div className="pb-2">
            {inactiveCards.map((card, index) => (
              <WalletCardButton
                key={card.id}
                card={card}
                index={index}
                selected={false}
                stacked
                compact
                onSelect={() => onSelectCard(card.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WalletCardButton({
  card,
  index,
  selected,
  stacked = false,
  compact = false,
  onSelect,
}: {
  card: CreditCard;
  index: number;
  selected: boolean;
  stacked?: boolean;
  compact?: boolean;
  onSelect: () => void;
}) {
  const available = Math.max(0, card.credit_limit - card.current_balance);
  const img = getCardImage(card);
  const surface = getCardSurface(card);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative block w-full text-left transition-[transform,opacity,margin] duration-500 ease-out',
        stacked && index > 0 && (compact ? '-mt-[108px]' : '-mt-[118px] md:-mt-[126px]'),
        selected ? 'opacity-100' : 'opacity-90 hover:-translate-y-1 hover:opacity-100',
      )}
      style={{ zIndex: 50 - index }}
    >
      <div
        className={cn(
          'relative overflow-hidden border shadow-[0_22px_52px_-34px_rgba(15,23,42,0.92)] transition-[height,box-shadow,border-color] duration-500 ease-out',
          selected
            ? 'h-56 rounded-[28px] border-white/45 shadow-[0_30px_70px_-34px_rgba(15,23,42,0.96)] ring-1 ring-slate-300/30 md:h-60'
            : compact
              ? 'h-[9.5rem] rounded-[24px] border-white/12 p-4 group-hover:border-white/28 md:h-40'
              : 'h-44 rounded-[26px] border-white/12 p-4 group-hover:border-white/28 md:h-48',
          selected && 'p-5',
        )}
        style={{
          background: img
            ? 'linear-gradient(135deg, rgba(15,23,42,0.35), rgba(15,23,42,0.7))'
            : surface.background,
        }}
      >
        {img && (
          <>
            <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/35 to-black/80" />
          </>
        )}
        <div className="absolute -right-8 top-4 h-28 w-28 rounded-full bg-white/12 blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_35%,rgba(255,255,255,0.02)_60%,rgba(0,0,0,0.15))]" />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className="truncate font-display text-2xl font-bold tracking-tight"
                style={{ color: img ? 'white' : surface.accent }}
              >
                {card.card_name}
              </p>
              <p
                className="mt-1 truncate text-xs uppercase tracking-[0.18em]"
                style={{ color: img ? 'rgba(255,255,255,0.68)' : surface.subAccent }}
              >
                {card.issuer} - {card.network}
              </p>
            </div>
            <div
              className={cn(
                'rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur',
                selected ? 'bg-white/20 text-white' : 'bg-black/25 text-white/88',
              )}
            >
              {selected ? 'Activa' : 'Abrir'}
            </div>
          </div>

          <div>
            <p
              className="font-mono text-lg tracking-[0.2em]"
              style={{ color: img ? 'white' : surface.accent }}
            >
              **** **** **** {card.last4}
            </p>
            <div className={cn('grid grid-cols-2 gap-2 text-xs', selected ? 'mt-4' : 'mt-3')}>
              <CardStat label="Balance" value={formatUSD(card.current_balance)} img={Boolean(img)} surface={surface} />
              <CardStat label="Disponible" value={formatUSD(available)} img={Boolean(img)} surface={surface} />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function CardStat({
  label,
  value,
  img,
  surface,
}: {
  label: string;
  value: string;
  img: boolean;
  surface: ReturnType<typeof getCardSurface>;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 backdrop-blur">
      <span style={{ color: img ? 'rgba(255,255,255,0.62)' : surface.subAccent }}>{label}</span>
      <p className="mt-1 font-semibold" style={{ color: img ? 'white' : surface.accent }}>
        {value}
      </p>
    </div>
  );
}
