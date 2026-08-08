import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@react-three/drei';
import { brainSections } from '../data/brainData';
import { Icon } from './icons';

/* ---------------------------------- brand --------------------------------- */

interface BrandProps {
  onNavigate: () => void;
}

export function Brand({ onNavigate }: BrandProps) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      aria-label="Back to top"
      className="group fixed left-6 top-6 z-40 flex cursor-pointer items-center gap-3 bg-transparent"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-cyan-200 transition-all duration-300 group-hover:border-cyan-300/40 group-hover:shadow-[0_0_24px_rgba(123,232,255,0.25)]">
        <Icon name="neuron" size={17} strokeWidth={1.6} />
      </span>
      <span className="mono text-[13px] font-medium uppercase tracking-[0.28em] text-slate-200">
        Neuro<span className="text-cyan-200">verse</span>
      </span>
    </button>
  );
}

/* ------------------------------- top HUD ---------------------------------- */

export function TopHud() {
  return (
    <div className="mono fixed right-6 top-6 z-40 hidden items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-slate-500 md:flex">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(123,232,255,0.9)]" />
      <span>Human Brain · Anatomy Scan</span>
    </div>
  );
}

/* ------------------------------- progress bar ----------------------------- */

export function ProgressBar() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/[0.04]">
      <div
        ref={fillRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 shadow-[0_0_12px_rgba(123,232,255,0.6)]"
      />
    </div>
  );
}

/* -------------------------------- dot nav ---------------------------------- */

interface DotNavProps {
  active: number;
  onNavigate: (index: number) => void;
}

const NAV_ITEMS = [
  { id: 'hero', label: 'Intro' },
  ...brainSections.map((s) => ({ id: s.id, label: s.title })),
  { id: 'finale', label: 'Finale' },
];

export function DotNav({ active, onNavigate }: DotNavProps) {
  const current = NAV_ITEMS[active];
  return (
    <nav
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
      aria-label="Section navigation"
    >
      {/* live readout */}
      <div className="mono flex items-center gap-2 text-right text-[10px] uppercase tracking-[0.24em] text-slate-400">
        <span className="text-cyan-200 tabular-nums">{String(active + 1).padStart(2, '0')}</span>
        <span className="text-slate-600">/ {String(NAV_ITEMS.length).padStart(2, '0')}</span>
      </div>
      <div className="mono max-w-[9rem] truncate text-right text-[10px] uppercase tracking-[0.18em] text-slate-500">
        {current?.label}
      </div>

      <div className="relative flex flex-col items-center gap-3 pt-1">
        {/* rail */}
        <span className="absolute -right-[5px] top-0 h-full w-px bg-white/[0.07]" />
        {NAV_ITEMS.map((item, i) => {
          const isActive = active === i;
          const accent = i > 0 && i <= brainSections.length ? brainSections[i - 1].accent : undefined;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(i)}
              aria-label={item.label}
              title={item.label}
              className="group relative flex h-5 w-5 cursor-pointer items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'h-2 w-2'
                    : 'h-[5px] w-[5px] bg-slate-600 group-hover:bg-slate-300'
                }`}
                style={
                  isActive
                    ? {
                        background: accent ?? '#7be8ff',
                        boxShadow: `0 0 12px ${accent ?? '#7be8ff'}88`,
                      }
                    : undefined
                }
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------ loading overlay ---------------------------- */

interface LoadingOverlayProps {
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

export function LoadingOverlay({ loading, error, onRetry }: LoadingOverlayProps) {
  const { progress, active } = useProgress();
  // useProgress reports *completed* loaders, so we show a believable readout
  // that creeps up while anything is still loading and snaps to 100 when done.
  const shown = !active ? 100 : Math.min(90, Math.round(12 + progress * 0.78));

  return (
    <AnimatePresence>
      {(loading || error) && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeOut' } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05060b]"
        >
          <div className="scanline" />
          <div className="flex w-[min(92vw,24rem)] flex-col items-center gap-8">
            {error ? (
              <div className="text-center">
                <div className="mono mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10 text-red-300">
                  <Icon name="pulse" size={20} />
                </div>
                <p className="mono text-lg font-medium uppercase tracking-[0.2em] text-white">
                  Scan interrupted
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  The 3D model failed to download. Check your connection and try again.
                </p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mono mt-7 cursor-pointer rounded-full border border-cyan-300/40 bg-cyan-300/10 px-6 py-2.5 text-[11px] uppercase tracking-[0.28em] text-cyan-200 transition-all hover:bg-cyan-300/20 hover:shadow-[0_0_24px_rgba(123,232,255,0.35)]"
                >
                  Retry scan
                </button>
              </div>
            ) : (
              <>
                {/* animated brain glyph */}
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 animate-[spin_9s_linear_infinite] rounded-full border border-white/[0.06]" />
                  <div className="absolute inset-2 animate-[spin_6s_linear_infinite_reverse] rounded-full border border-dashed border-cyan-200/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon name="neuron" size={30} className="text-cyan-200" strokeWidth={1.4} />
                  </div>
                  <div className="absolute inset-0 -z-10 rounded-full bg-cyan-300/10 blur-2xl" />
                </div>

                <div className="w-full text-center">
                  <p className="mono text-[11px] uppercase tracking-[0.32em] text-slate-300">
                    Scanning the cortex
                  </p>
                  <p className="mono mt-1.5 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    Decoding mesh · {Math.round(shown)}%
                  </p>
                  <div className="mt-4 h-px w-full overflow-hidden rounded bg-white/[0.06]">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-300 to-indigo-400 transition-[width] duration-300"
                      style={{ width: `${shown}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
