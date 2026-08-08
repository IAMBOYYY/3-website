import { motion } from 'framer-motion';
import { brainSections, heroStats } from '../data/brainData';
import { Icon } from './icons';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ----------------------------------- hero --------------------------------- */

export function Hero() {
  return (
    <section
      id="hero"
      data-section
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      {/* readability scrim */}
      <div
        aria-hidden="true"
        className="vignette pointer-events-none absolute inset-0"
      />
      {/* MRI scan sweep */}
      <div aria-hidden="true" className="scanline" />

      {/* HUD frame — the "lab instrument" look */}
      <div
        aria-hidden="true"
        className="mono pointer-events-none absolute inset-6 hidden justify-between text-[10px] uppercase tracking-[0.28em] text-slate-500 lg:flex"
      >
        <span className="flex gap-2">
          <span className="text-slate-700">⌖</span> Subject 03 · <span className="text-slate-400">Homo sapiens</span>
        </span>
        <span className="flex gap-2">
          <span className="text-slate-700">◈</span> Scan 01 · <span className="text-slate-400">Cerebrum</span>
        </span>
      </div>
      <div
        aria-hidden="true"
        className="mono pointer-events-none absolute inset-x-6 bottom-6 hidden justify-between text-[10px] uppercase tracking-[0.28em] text-slate-500 lg:flex"
      >
        <span>
          X 0.00 <span className="text-slate-700">/</span> Y 1.30 <span className="text-slate-700">/</span> Z 0.00
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1 w-1 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(123,232,255,0.9)]" />
          86,000,000,000 neurons online
        </span>
      </div>

      {/* center stage */}
      <div className="pointer-events-auto relative z-10 mx-auto w-full max-w-6xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="eyebrow mb-8"
        >
          An interactive 3D journey
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 34, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.12, ease: EASE }}
          className="display-outline hero-title text-balance leading-[0.95]"
        >
          The Human
          <span className="block text-gradient mt-1">Brain</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.42, ease: EASE }}
          className="mx-auto mt-9 max-w-xl text-[15px] leading-relaxed text-slate-400 md:text-lg"
        >
          The most complex structure in the known universe.
          Scroll to dissect it — one region, one signal, one story at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: EASE }}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.06] sm:grid-cols-4"
        >
          {heroStats.map((s) => (
            <div
              key={s.label}
              className="group bg-[#07080f] px-4 py-5 transition-colors duration-300 hover:bg-[#0a0c16]"
            >
              <div className="mono text-2xl font-medium tracking-tight text-slate-100 md:text-3xl">
                {s.value}
              </div>
              <div className="mono mt-1.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-slate-500"
      >
        <span className="mono text-[10px] uppercase tracking-[0.34em]">
          Scroll to begin the scan
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.div
            className="absolute left-0 top-0 h-3 w-px bg-cyan-300 shadow-[0_0_8px_rgba(123,232,255,0.8)]"
            animate={{ y: [-12, 40] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}

/* -------------------------------- region card ------------------------------ */

function RegionCard({ index }: { index: number }) {
  const section = brainSections[index];
  const left = index % 2 === 0;

  return (
    <section id={section.id} data-section className="relative flex min-h-svh items-center">
      {/* ghost index — outlined mono number on the empty side */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 hidden select-none items-center md:flex ${
          left ? 'justify-end pr-[6%]' : 'justify-start pl-[6%]'
        }`}
      >
        <span
          className="mono text-[30vh] font-semibold leading-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(214,224,255,0.09)',
          }}
        >
          {String(section.index).padStart(2, '0')}
        </span>
      </div>

      <div
        className={`pointer-events-auto relative z-10 mx-auto w-full max-w-6xl px-6 ${
          left ? 'md:pr-[46%]' : 'md:pl-[46%]'
        }`}
      >
        <motion.article
          initial={{ opacity: 0, y: 56 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ duration: 0.95, ease: EASE }}
          className="glass-card relative overflow-hidden rounded-3xl p-8 md:p-11"
        >
          {/* region accent spine */}
          <span
            className="absolute inset-y-0 left-0 w-[3px]"
            style={{
              background: `linear-gradient(180deg, ${section.accent}, transparent)`,
              boxShadow: `0 0 18px ${section.accent}66`,
            }}
          />
          <span
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-[0.13] blur-3xl"
            style={{ background: section.accent }}
          />

          <div className="relative">
            {/* meta row */}
            <div className="mono mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.26em]">
              <span className="text-slate-500">
                {String(section.index).padStart(2, '0')} / {String(brainSections.length).padStart(2, '0')}
              </span>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: section.accent }} />
              <span className="text-slate-400">{section.eyebrow}</span>
              {section.deep && (
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] tracking-[0.22em] text-slate-400">
                  ◇ deep structure
                </span>
              )}
            </div>

            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {section.title}
            </h2>
            <p
              className="mono mt-3 text-[11px] font-medium uppercase tracking-[0.26em] md:text-xs"
              style={{ color: section.accent }}
            >
              {section.tagline}
            </p>

            <p className="mt-6 max-w-xl leading-relaxed text-slate-300">
              {section.description}
            </p>

            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {section.functions.map((fn, i) => (
                <motion.li
                  key={fn}
                  initial={{ opacity: 0, x: left ? -16 : 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-8% 0px' }}
                  transition={{ duration: 0.55, delay: 0.12 + i * 0.07, ease: EASE }}
                  className="flex items-start gap-3 border-b border-white/[0.05] pb-3 text-[14px] text-slate-200"
                >
                  <span className="mono mt-0.5 text-[10px] tracking-widest" style={{ color: section.accent }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {fn}
                </motion.li>
              ))}
            </ul>

            <div className="mt-9 flex items-baseline gap-4 border-t border-white/[0.07] pt-6">
              <span className="mono text-4xl font-medium tracking-tight text-white md:text-5xl">
                {section.stat}
              </span>
              <span className="mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-slate-500">
                {section.statLabel}
              </span>
            </div>
          </div>
        </motion.article>
      </div>

      {/* keep-scrolling hint */}
      <div
        className={`mono absolute bottom-10 hidden items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-600 md:flex ${
          left ? 'right-[10%]' : 'left-[10%]'
        }`}
      >
        <span style={{ color: section.accent }}>
          <Icon name="arrowDown" size={12} />
        </span>
        Keep scrolling
      </div>
    </section>
  );
}

/* ---------------------------------- finale --------------------------------- */

interface FinaleProps {
  onReplay: () => void;
}

export function Finale({ onReplay }: FinaleProps) {
  return (
    <section id="finale" data-section className="relative flex min-h-svh flex-col justify-center overflow-hidden">
      <div aria-hidden="true" className="scanline" />
      <div className="pointer-events-auto relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="eyebrow mb-8"
        >
          Scan complete
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="display text-balance text-white"
        >
          Eighty-six billion neurons.
          <br />
          <span className="text-gradient">One you.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.9, delay: 0.28, ease: EASE }}
          className="mx-auto mt-9 max-w-xl leading-relaxed text-slate-400"
        >
          Every region you just explored works in concert — a thousand trillion signals
          every second, weaving together everything you think, feel and do.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-14"
        >
          <button
            type="button"
            onClick={onReplay}
            className="mono group inline-flex cursor-pointer items-center gap-3 rounded-full border border-cyan-300/35 bg-cyan-300/[0.07] px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-cyan-100 transition-all duration-300 hover:bg-cyan-300/[0.15] hover:shadow-[0_0_36px_rgba(123,232,255,0.3)]"
          >
            Replay the scan
            <Icon name="arrowRight" size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mono mt-16 text-[10px] uppercase tracking-[0.28em] text-slate-600"
        >
          React Three Fiber · GSAP · Lenis — model CC-BY 4.0
        </motion.p>
      </div>
    </section>
  );
}

/* ---------------------------------- export --------------------------------- */

interface SectionsProps {
  onReplay: () => void;
}

export function Sections({ onReplay }: SectionsProps) {
  return (
    <>
      <Hero />
      {brainSections.map((s, i) => (
        <RegionCard key={s.id} index={i} />
      ))}
      <Finale onReplay={onReplay} />
    </>
  );
}
