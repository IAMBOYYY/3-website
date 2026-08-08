import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrainScene } from './components/BrainScene';
import { Sections } from './components/Sections';
import { Brand, DotNav, LoadingOverlay, ProgressBar, TopHud } from './components/Chrome';
import { scrollState } from './scrollState';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modelError, setModelError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const loadedRef = useRef(false);

  const handleModelLoad = useCallback(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setModelError(false);
    // Tiny brand moment so the loader never flashes away instantly.
    window.setTimeout(() => setLoading(false), 350);
  }, []);

  const handleModelError = useCallback(() => {
    setModelError(true);
    setLoading(false);
  }, []);

  const handleRetry = useCallback(() => {
    setRetryKey((k) => k + 1);
    setModelError(false);
    setLoading(true);
  }, []);

  // Safety net: never leave the user stuck on the loader.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!loadedRef.current) {
        setModelError(true);
        setLoading(false);
      }
    }, 30000);
    return () => window.clearTimeout(timer);
  }, [retryKey]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: !reduced,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;
    // Expose for programmatic scrolling (nav + debugging).
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    const triggers = els.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) {
            scrollState.active = i;
            scrollState.local = 0;
            setActive(i);
          }
        },
        onUpdate: (self) => {
          if (self.isActive) scrollState.local = self.progress;
        },
      }),
    );

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('load', onLoad);
      triggers.forEach((t) => t.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
      if ((window as unknown as { __lenis?: Lenis }).__lenis === lenis) {
        (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      }
      lenisRef.current = null;
    };
  }, []);

  const scrollToSection = useCallback((index: number) => {
    const els = document.querySelectorAll<HTMLElement>('[data-section]');
    const el = els[index];
    if (!el) return;
    lenisRef.current?.scrollTo(el, {
      duration: 1.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  }, []);

  const scrollToTop = useCallback(() => {
    lenisRef.current?.scrollTo(0, { duration: 1.2 });
  }, []);

  return (
    <div className="min-h-svh text-slate-200">
      <BrainScene
        activeSection={active}
        retryKey={retryKey}
        onModelLoad={handleModelLoad}
        onModelError={handleModelError}
        onNavigate={scrollToSection}
      />

      {/* pointer-events-none lets clicks fall through to the 3D canvas; the
          individual cards/buttons re-enable pointer-events themselves. */}
      <main className="pointer-events-none relative z-10">
        <Sections onReplay={scrollToTop} />
      </main>

      <Brand onNavigate={scrollToTop} />
      <TopHud />
      <ProgressBar />
      <DotNav active={active} onNavigate={scrollToSection} />
      <LoadingOverlay loading={loading} error={modelError} onRetry={handleRetry} />
    </div>
  );
}

export default App;
