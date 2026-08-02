import { useEffect, useRef, useState } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/locomotive-scroll.css';
import { BrainScene } from './components/BrainScene';
import { InfoSections } from './components/InfoSections';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locoScrollRef = useRef<LocomotiveScroll | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const locoScroll = new LocomotiveScroll({
      lenisOptions: {
        wrapper: scrollEl,
        content: scrollEl,
        smoothWheel: true,
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 3.5,
      },
      scrollCallback: ({ progress }) => {
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      },
      autoStart: true,
    });

    locoScrollRef.current = locoScroll;

    ScrollTrigger.scrollerProxy(scrollEl, {
      scrollTop(value?: number) {
        if (value !== undefined) {
          locoScroll.scrollTo(value, { immediate: true });
        }
        const scroll = locoScroll.lenisInstance?.scroll;
        return typeof scroll === 'number' ? scroll : 0;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: scrollEl.style.transform ? 'transform' : 'fixed',
    });

    const refreshHandler = () => {
      locoScroll.resize();
    };
    
    ScrollTrigger.addEventListener('refresh', refreshHandler);
    ScrollTrigger.refresh();

    return () => {
      locoScroll.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.removeEventListener('refresh', refreshHandler);
    };
  }, []);

  useEffect(() => {
    if (!locoScrollRef.current) return;
    locoScrollRef.current.resize();
  }, [scrollProgress]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div ref={scrollRef} data-scroll-container className="relative">
        <BrainScene scrollProgress={scrollProgress} />
        <InfoSections scrollProgress={scrollProgress} />
      </div>
    </div>
  );
}

export default App;