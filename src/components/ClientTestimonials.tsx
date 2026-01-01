import React, { useEffect, useRef, useState } from 'react';

type Testimonial = {
  name: string;
  role: string;
  rating: number;
  image: string;
  text: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Maryam',
    role: 'Tech Startup',
    rating: 4,
    image: '/images/maryam@.jpg',
    text: 'The service was reliable and the communication smooth throughout. Kuch choti delays hui, but the final result was definitely worth it.'
  },
  {
    name: 'Irtza Imtiaz',
    role: 'E-commerce Brand',
    rating: 5,
    image: '/images/irtza.jpg',
    text: 'The service was smooth from start to finish — everything delivered exactly the way my e-commerce brand required.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Local Business',
    rating: 5,
    image: '/images/emily.jpg',
    text: 'Amazing attention to detail that helped us stand out in a competitive market. Highly recommended!'
  },
  {
    name: 'Alex Thompson',
    role: 'Fashion Brand',
    rating: 4,
    image: '/images/alex.jpg',
    text: 'Really impressed with how smoothly everything was handled — the final outcome matched our fashion brand’s style perfectly.'
  },
  {
    name: 'Zayden Faruq',
    role: 'Digital Agency',
    rating: 5,
    image: '/images/furqan.jpg',
    text: 'Working with NAFI was a game-changer. Every project exceeded our expectations. Highly recommend!'
  }
];

const Star = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="18" height="18" fill="#FFC107" aria-hidden>
    <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.563L19.335 24 12 20.201 4.665 24l1.635-8.687L.6 9.75l7.732-1.732L12 .587z" />
  </svg>
);

export default function ClientTestimonials(): JSX.Element {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [animating, setAnimating] = useState(false);
  const animRef = useRef<number | null>(null);
  const ANIM_MS = 500;
  const AUTOPLAY_MS = 2000; // 2s per your request
  const timeoutRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(AUTOPLAY_MS);
  const lastStartRef = useRef<number | null>(null);
  const currentRef = useRef<number>(0);

  useEffect(() => {
    // start the timer when component mounts
    startTimer();
    return () => pauseTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTimer = (ms?: number) => {
    clearTimer();
    const wait = typeof ms === 'number' ? ms : remainingRef.current || AUTOPLAY_MS;
    lastStartRef.current = Date.now();
    timeoutRef.current = window.setTimeout(() => {
      // compute next based on latest current value (avoid stale closure)
      const idx = (currentRef.current + 1) % TESTIMONIALS.length;
      goTo(idx, 1, true);
      // reset remaining and restart timer
      remainingRef.current = AUTOPLAY_MS;
      lastStartRef.current = Date.now();
      // clear current timeout ref before creating a new one
      timeoutRef.current = null;
      startTimer();
    }, wait) as unknown as number;
  };

  const pauseTimer = () => {
    if (timeoutRef.current) {
      const now = Date.now();
      if (lastStartRef.current) {
        const elapsed = now - lastStartRef.current;
        remainingRef.current = Math.max(0, (remainingRef.current || AUTOPLAY_MS) - elapsed);
      }
      clearTimer();
      lastStartRef.current = null;
    }
  };

  const resetTimer = () => {
    remainingRef.current = AUTOPLAY_MS;
    startTimer();
  };

  useEffect(() => {
    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, []);

  const goTo = (index: number, dir = 1, force = false) => {
    const cur = force ? currentRef.current : current;
    if (!force && (animating || index === cur)) return;
    // allow forced transition even if animating to avoid getting stuck
    if (animRef.current) {
      clearTimeout(animRef.current);
      animRef.current = null;
    }
    setPrev(cur);
    setCurrent(index);
    setDirection(dir);
    setAnimating(true);
    animRef.current = window.setTimeout(() => {
      setPrev(null);
      setAnimating(false);
    }, ANIM_MS);
  };

  const next = (fromTimer = false) => {
    const from = currentRef.current;
    const idx = (from + 1) % TESTIMONIALS.length;
    // when called from timer, force transition to avoid stuck animating state
    goTo(idx, 1, fromTimer);
    if (fromTimer) {
      remainingRef.current = AUTOPLAY_MS;
      startTimer();
    } else {
      resetTimer();
    }
  };

  const prevBtn = () => {
    const from = currentRef.current;
    const idx = (from - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    goTo(idx, -1);
    resetTimer();
  };

  // Accessible keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prevBtn();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const renderCard = (t: Testimonial, role = 'current', idx?: number) => {
    const base = 'w-full max-w-5xl bg-white rounded-2xl shadow-lg border border-gray-200 p-5 md:p-8 flex items-center gap-6 z-10';
    const img = (
      <img
        src={t.image}
        alt={t.name}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f3f4f6'/><circle cx='50' cy='40' r='26' fill='%23d1d5db'/></svg>";
        }}
        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#FFC107]"
      />
    );

    return (
      <article
        key={idx ?? t.name}
        className={base}
        aria-hidden={role === 'prev'}
        role="group"
        aria-label={`${t.name}, ${t.role}`}
      >
        <div className="flex-shrink-0">{img}</div>
          <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`inline-block ${i < t.rating ? '' : 'opacity-30'}`} />
            ))}
          </div>
          <p
            className="text-gray-800 italic text-base md:text-lg leading-relaxed mb-4 cursor-pointer"
            onMouseEnter={() => pauseTimer()}
            onMouseLeave={() => startTimer()}
            onTouchStart={() => pauseTimer()}
            onTouchEnd={() => startTimer()}
          >
            "{t.text}"
          </p>
          <div>
            <div className="font-bold text-black text-sm md:text-base">{t.name}</div>
            <div className="text-gray-500 text-xs md:text-sm">{t.role}</div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="py-12 px-4 md:px-8 w-full">
      <div className="flex flex-col items-center w-full">
        
        {/* TESTIMONIAL CARD WITH ARROWS */}
        <div
          className="relative w-full max-w-5xl flex items-center justify-center min-h-[400px]"
          onMouseEnter={() => pauseTimer()}
          onMouseLeave={() => startTimer()}
          onTouchStart={() => pauseTimer()}
          onTouchEnd={() => startTimer()}
        >
          {/* Left arrow */}
          <button
            aria-label="Previous testimonial"
            onClick={prevBtn}
            className="absolute left-0 -translate-x-1/2 md:-translate-x-3/4 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow-md w-10 h-10 md:w-12 md:h-12 flex items-center justify-center z-20 "
          >
            <span className="text-lg md:text-xl">❮</span>
          </button>

          {/* Card viewport */}
          <div className="w-full px-12 md:px-20">
            <div className="relative w-full flex items-center justify-center">
              {/* animation keyframes */}
              <style>{`
                @keyframes enterFadeUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes exitFadeUp { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-6px); opacity: 0; } }
              `}</style>

              {/* Previous card (exiting) */}
              {prev !== null && (
                <div className="absolute inset-0 w-full flex items-center justify-center" style={{ pointerEvents: 'none' }}>
                  <div style={{ animation: `${ANIM_MS}ms exitFadeUp both ease`, width: '100%' }}>
                    {renderCard(TESTIMONIALS[prev], 'prev', prev)}
                  </div>
                </div>
              )}

              {/* Current card (visible) */}
              <div className="w-full flex items-center justify-center">
                <div style={{ animation: animating ? `${ANIM_MS}ms enterFadeUp both ease` : 'none', width: '100%' }}>
                  {renderCard(TESTIMONIALS[current], 'current', current)}
                </div>
              </div>
            </div>
          </div>

          {/* Right arrow */}
          <button
            aria-label="Next testimonial"
            onClick={() => next(false)}

            className="absolute right-0 translate-x-1/2 md:translate-x-3/4 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow-md w-10 h-10 md:w-12 md:h-12 flex items-center justify-center z-20 "
          >
            <span className="text-lg md:text-xl">❯</span>
          </button>
        </div>

        {/* PAGINATION DOTS - SEPARATE SIBLING BELOW CARD */}
        <div className="flex gap-2 justify-center items-center mt-8 w-full">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => { goTo(i, i > current ? 1 : -1); resetTimer(); }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === i ? 'bg-[#FFC107]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
