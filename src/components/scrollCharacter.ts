// Side-effect module: when imported it mounts a scroll-interactive character overlay.
import "./scrollCharacter.css";

// defensive init: do not run heavy DOM logic during module evaluation which could throw and stop app bootstrap
try {
  // Configuration
  const FRAME_COUNT = 6; // use 6 provided PNGs
  const IMAGE_BASE = '/images/scroll-anime-'; // user should place images at public/images/scroll-anime-1.png ... -6.png
  const IMAGE_EXT = '.png';

  // The overlay element and state
  const container = document.createElement('div');
  container.className = 'scroll-anime-character-container';

  const img = document.createElement('img');
  img.alt = 'scroll-anime-character';
  img.draggable = false;
  // start hidden until a frame is ready
  img.style.visibility = 'hidden';
  img.width = 400; // soft layout hint; CSS controls size responsively
  container.appendChild(img);

  // Insert at end of body so it doesn't affect layout
  function mount() {
    if (!document.body.contains(container)) document.body.appendChild(container);
  }

  // Cleanup if needed
  function unmount() {
    try {
      if (container.parentElement) container.parentElement.removeChild(container);
      removeListeners();
    } catch (e) {
      // ignore
    }
  }

  // Load frames (array of paths)
  const frames: string[] = [];
  for (let i = 1; i <= FRAME_COUNT; i++) frames.push(`${IMAGE_BASE}${i}${IMAGE_EXT}`);

  // Preload frames so we can log missing files early
    // Preload frames and try a fallback to bundled assets if none of the public images load.
    (async function preloadFrames() {
      try {
        let successCount = 0;
        await Promise.all(frames.map((src, idx) => new Promise<void>((resolve) => {
          const im = new Image();
          im.onload = () => { successCount++; resolve(); };
          im.onerror = () => { console.warn(`[scrollCharacter] failed to load public frame ${idx + 1}: ${src}`); resolve(); };
          im.src = src;
        })));

        if (successCount === 0) {
          // Try to find frames inside src/assets using Vite's import.meta.globEager as a fallback
          try {
            const glob: Record<string, any> = (import.meta as any).globEager ? (import.meta as any).globEager('/src/assets/scroll-anime-*.png') : {};
            const found = Object.keys(glob).sort().map(k => glob[k].default || glob[k]);
            if (found.length) {
              frames.length = 0;
              found.forEach((v: string) => frames.push(v));
              console.info('[scrollCharacter] fallback: using bundled frames from src/assets', frames);
              successCount = found.length;
            } else {
              console.warn('[scrollCharacter] no frames found in src/assets fallback');
            }
          } catch (err) {
            console.warn('[scrollCharacter] import.meta.globEager fallback failed', err);
          }
        }

        console.info('[scrollCharacter] frame preload finished; successful frames:', successCount);
      } catch (err) {
        console.error('[scrollCharacter] preload error', err);
      }
    })();

  // Scroll -> reveal mapping
  let lastScrollY = 0;
  let targetProgress = 0; // 0..1 how much character is revealed (0 = just head visible)
  let currentProgress = 0;

  // Determine document sections: we'll use the first 4 top-level sections by selecting elements with role=region or direct children of #root > sections. Fall back to body height if not found.
  function getRevealPoints() {
    // find top offsets of first 4 major sections
    const roots = Array.from(document.querySelectorAll('section, main > section, [data-section], #root > div > section')) as HTMLElement[];
    const sections = roots.length ? roots.slice(0, 4) : [];
    const points: number[] = [];
    if (sections.length) {
      for (let i = 0; i < sections.length; i++) {
        points.push(sections[i].getBoundingClientRect().top + window.scrollY);
      }
    } else {
      // fallback split by viewport heights
      const h = window.innerHeight;
      points.push(window.scrollY + h * 0.5);
      points.push(window.scrollY + h * 1.5);
      points.push(window.scrollY + h * 2.5);
      points.push(window.scrollY + h * 3.5);
    }
    return points;
  }

  let revealPoints = [] as number[];
  const resizeHandler = () => { revealPoints = getRevealPoints(); };

  // Performance: use rAF loop
  let rafId = 0;
  let idleFrame = 0;
  let idleTimer = 0;
  const IDLE_FRAME_DURATION = 120; // ms per frame

  // Map scroll position to progress:
  function updateTargetProgress() {
    const y = window.scrollY || 0;
    lastScrollY = y;
    // If we have revealPoints[0..2], map between top and 3rd point
    const start = revealPoints[0] ?? 0;
    const end = revealPoints[2] ?? (start + window.innerHeight * 2);
    const clamped = Math.max(0, Math.min(1, (y - start) / Math.max(1, end - start)));
    targetProgress = clamped;
  }

  // Fade after 4th section
  function computeOpacity() {
    if (!revealPoints.length) return 1;
    const fourth = revealPoints[3] ?? (revealPoints[0] + window.innerHeight * 3);
    const fadeStart = fourth - window.innerHeight * 0.25;
    const fadeEnd = fourth + window.innerHeight * 0.75;
    const y = (window.scrollY || 0) + window.innerHeight * 0.5; // middle of viewport
    if (y < fadeStart) return 1;
    if (y > fadeEnd) return 0;
    return 1 - (y - fadeStart) / (fadeEnd - fadeStart);
  }

  // Idle micro-motion using frame sprite animation
  function pickIdleFrame(ts: number) {
    const lastTs = (pickIdleFrame as any).__lastTs || ts;
    idleTimer += ts - lastTs;
    (pickIdleFrame as any).__lastTs = ts;
    if (idleTimer >= IDLE_FRAME_DURATION) {
      idleTimer = 0;
      idleFrame = (idleFrame + 1) % FRAME_COUNT;
    }
    return idleFrame;
  }

  // Update loop
  function loop(ts: number) {
    try {
      updateTargetProgress();
      // smooth current towards target
      currentProgress += (targetProgress - currentProgress) * 0.2; // ease

      // translateY mapping: when progress=0 -> only head slightly visible (translateY(20%))
      // when progress=1 -> fully visible (translateY(-40%))
      // We use percentages to keep it responsive with CSS widths
      const translatePct = 20 - currentProgress * 60; // 20% -> -40%
      container.style.transform = `translateX(-50%) translateY(${translatePct}%)`;

      // opacity fade
      const op = computeOpacity();
      container.style.opacity = String(op);

      // choose idle frame but still show when scrolling
      const f = pickIdleFrame(ts);
      // Use the image frames as overlay. We also slightly rotate/scale for breathing effect.
      img.src = frames[f];
      // reveal image once we set the first valid src
      if (img.style.visibility !== 'visible') {
        img.style.visibility = 'visible';
      }
      const idleAngle = Math.sin(ts / 900 + f) * 0.6; // subtle
      const idleScale = 1 + Math.abs(Math.sin(ts / 1200 + f)) * 0.006;
      img.style.transform = `rotate(${idleAngle}deg) scale(${idleScale})`;
    } catch (err) {
      // swallow errors to avoid breaking host app
      console.error('[scrollCharacter] animation loop error', err);
      return;
    }
    rafId = requestAnimationFrame(loop);
  }

  // Scroll listener to make movement responsive to wheel/scroll events
  function onScroll() {
    updateTargetProgress();
  }

  function removeListeners() {
    try {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resizeHandler);
      if (rafId) cancelAnimationFrame(rafId);
    } catch (e) {
      // ignore
    }
  }

  function init() {
    try {
      // ensure DOM present
      revealPoints = getRevealPoints();
      mount();
      updateTargetProgress();
      rafId = requestAnimationFrame(loop);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', resizeHandler, { passive: true });

      // expose unmount for debugging on window
      (window as any).__scrollCharacterUnmount = unmount;
    } catch (err) {
      console.error('[scrollCharacter] init error', err);
    }
  }

  // Start init after DOM is ready to avoid throwing during module import
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // schedule after microtask to avoid blocking
      setTimeout(init, 0);
    } else {
      window.addEventListener('DOMContentLoaded', () => setTimeout(init, 0), { once: true });
    }
  }
} catch (e) {
  // A final guard: any exception should not block the host app
  console.error('[scrollCharacter] module error', e);
}
