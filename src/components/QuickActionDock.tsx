import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, RefreshCw } from 'lucide-react';
import { assetPath } from '@/lib/asset-path';
import { cn } from '@/lib/utils';

const weekActions = [1, 2, 3, 4] as const;
const STORAGE_KEY = 'quick-action-dock-position';
const DOCK_SIZE = 56;
const MOBILE_DOCK_SIZE = 48;
const EDGE_PADDING = 12;

type DockPosition = {
  x: number;
  y: number;
};

function getDockSize() {
  return window.matchMedia('(min-width: 640px)').matches ? DOCK_SIZE : MOBILE_DOCK_SIZE;
}

function clampPosition(position: DockPosition): DockPosition {
  const size = getDockSize();

  return {
    x: Math.min(Math.max(EDGE_PADDING, position.x), window.innerWidth - size - EDGE_PADDING),
    y: Math.min(Math.max(EDGE_PADDING, position.y), window.innerHeight - size - EDGE_PADDING),
  };
}

function getInitialPosition(): DockPosition {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return clampPosition(JSON.parse(saved) as DockPosition);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  const size = getDockSize();
  const bottomOffset = window.matchMedia('(min-width: 640px)').matches ? 20 : 80;

  return {
    x: window.innerWidth - size - EDGE_PADDING,
    y: window.innerHeight - size - bottomOffset,
  };
}

export function QuickActionDock() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<DockPosition | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const ignoreClickRef = useRef(false);
  const cornerVideo = assetPath('corner-video.mp4');

  useEffect(() => {
    setPosition(getInitialPosition());

    const handleResize = () => {
      setPosition((current) => {
        if (!current) return getInitialPosition();
        const next = clampPosition(current);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!dockRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!position) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      drag.moved = true;
      setOpen(false);
    }

    const next = clampPosition({
      x: drag.originX + deltaX,
      y: drag.originY + deltaY,
    });
    setPosition(next);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (drag.moved && position) {
      const next = clampPosition(position);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      ignoreClickRef.current = true;
      window.setTimeout(() => {
        ignoreClickRef.current = false;
      }, 0);
    }

    dragRef.current = null;
  };

  if (!position) {
    return null;
  }

  return (
    <div
      ref={dockRef}
      className="fixed z-40 h-12 w-12 touch-none sm:h-14 sm:w-14"
      style={{ left: position.x, top: position.y }}
    >
      <div
        className={cn(
          'absolute bottom-full right-0 mb-2 origin-bottom-right rounded-lg border border-border bg-card p-1.5 shadow-lg transition-all',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        )}
      >
        <div className="grid min-w-[142px] gap-1">
          <QuickActionLink to="/wallet" onClick={() => setOpen(false)}>
            <CreditCard className="h-3.5 w-3.5" />
            Compra
          </QuickActionLink>

          <div className="my-1 h-px bg-border" />

          <div className="grid grid-cols-4 gap-1">
            {weekActions.map((week) => (
              <Link
                key={week}
                to={`/fixed-expenses?week=${week}`}
                onClick={() => setOpen(false)}
                className="flex h-7 items-center justify-center rounded-md border border-border bg-background text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                W{week}
              </Link>
            ))}
          </div>

          <div className="my-1 h-px bg-border" />

          <QuickActionLink to="/exchange" onClick={() => setOpen(false)}>
            <RefreshCw className="h-3.5 w-3.5" />
            Rate
          </QuickActionLink>
        </div>
      </div>

      <button
        type="button"
        aria-label="Abrir acciones rapidas"
        aria-expanded={open}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={() => {
          if (ignoreClickRef.current) return;
          setOpen((current) => !current);
        }}
        className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-card shadow-[0_14px_34px_-22px_rgba(15,23,42,0.8)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 sm:h-14 sm:w-14"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_38%),linear-gradient(135deg,rgba(16,185,129,0.08),transparent_48%,rgba(15,23,42,0.22))]" />
        <video
          className="pointer-events-none relative h-full w-full object-cover object-center opacity-80 transition-opacity group-hover:opacity-95"
          src={cornerVideo}
          aria-hidden="true"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        />
      </button>
    </div>
  );
}

function QuickActionLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex h-7 items-center gap-2 rounded-md px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </Link>
  );
}
