'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

type IconName = 'capsule' | 'leaf' | 'drop' | 'bubble' | 'bolt' | 'ring' | 'wave' | 'pulse' | 'moon' | 'star';

function Icon({ name, size = 64 }: { name: IconName; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 64 64', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' } as const;
  switch (name) {
    case 'capsule':
      return (
        <svg {...p}>
          <rect x="10" y="25" width="44" height="14" rx="7" transform="rotate(-45 32 32)" stroke="currentColor" strokeWidth="2.5" />
          <path d="M32 17.5 L32 46.5" transform="rotate(-45 32 32)" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...p}>
          <path d="M50 14C30 16 16 28 14 50c22-2 34-16 36-36Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M18 46C26 34 36 26 46 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'drop':
      return (
        <svg {...p}>
          <path d="M32 8C24 20 16 28 16 38a16 16 0 0 0 32 0c0-10-8-18-16-30Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M24 40a8 8 0 0 0 8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'bubble':
      return (
        <svg {...p}>
          <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="26" cy="26" r="4" fill="currentColor" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...p}>
          <path d="M36 6 14 36h14l-4 22 24-32H34l2-20Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case 'ring':
      return (
        <svg {...p}>
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 8" strokeLinecap="round" />
        </svg>
      );
    case 'wave':
      return (
        <svg {...p}>
          <path d="M8 40c6-12 12-12 18 0s12 12 18 0 10-10 12-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M8 24c6-12 12-12 18 0s12 12 18 0 10-10 12-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
        </svg>
      );
    case 'pulse':
      return (
        <svg {...p}>
          <path d="M6 34h14l6-16 10 30 8-22 4 8h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...p}>
          <path d="M40 10a22 22 0 1 0 14 26A26 26 0 0 1 40 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case 'star':
      return (
        <svg {...p}>
          <path d="M32 8c2 12 8 20 22 22-14 2-20 10-22 22-2-12-8-20-22-22 14-2 20-10 22-22Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
  }
}

type Floater = { icon: IconName; x: number; y: number; s: number; depth: number; anim: 'a' | 'b' | 'c' };
type Step = { word: string; sub: string; floaters: Floater[] };

const STEPS: Step[] = [
  {
    word: 'Supplements',
    sub: 'Every dose remembered. Every stack understood.',
    floaters: [
      { icon: 'capsule', x: 14, y: 20, s: 92, depth: 1.5, anim: 'a' },
      { icon: 'leaf', x: 78, y: 16, s: 76, depth: 1.0, anim: 'b' },
      { icon: 'leaf', x: 10, y: 64, s: 56, depth: 0.8, anim: 'c' },
      { icon: 'bubble', x: 84, y: 60, s: 42, depth: 1.7, anim: 'a' },
      { icon: 'star', x: 70, y: 80, s: 46, depth: 1.2, anim: 'b' },
      { icon: 'capsule', x: 26, y: 82, s: 54, depth: 0.9, anim: 'c' },
    ],
  },
  {
    word: 'Hydration',
    sub: 'Water is a metric, not a vibe.',
    floaters: [
      { icon: 'drop', x: 16, y: 18, s: 84, depth: 1.4, anim: 'a' },
      { icon: 'bubble', x: 80, y: 22, s: 52, depth: 1.1, anim: 'b' },
      { icon: 'bubble', x: 12, y: 60, s: 36, depth: 0.9, anim: 'c' },
      { icon: 'drop', x: 86, y: 66, s: 58, depth: 1.6, anim: 'b' },
      { icon: 'wave', x: 24, y: 80, s: 80, depth: 1.0, anim: 'a' },
      { icon: 'bubble', x: 68, y: 78, s: 44, depth: 1.3, anim: 'c' },
    ],
  },
  {
    word: 'Movement',
    sub: 'Steps, strain, and the story in between.',
    floaters: [
      { icon: 'bolt', x: 14, y: 22, s: 88, depth: 1.5, anim: 'a' },
      { icon: 'ring', x: 80, y: 16, s: 72, depth: 1.0, anim: 'b' },
      { icon: 'pulse', x: 10, y: 66, s: 74, depth: 0.9, anim: 'c' },
      { icon: 'bolt', x: 84, y: 62, s: 50, depth: 1.7, anim: 'b' },
      { icon: 'ring', x: 26, y: 80, s: 48, depth: 1.2, anim: 'a' },
      { icon: 'star', x: 70, y: 80, s: 44, depth: 1.1, anim: 'c' },
    ],
  },
  {
    word: 'Stress',
    sub: 'See the spike before you feel it.',
    floaters: [
      { icon: 'pulse', x: 16, y: 20, s: 90, depth: 1.4, anim: 'a' },
      { icon: 'wave', x: 78, y: 18, s: 78, depth: 1.0, anim: 'b' },
      { icon: 'ring', x: 12, y: 62, s: 52, depth: 0.8, anim: 'c' },
      { icon: 'moon', x: 84, y: 60, s: 56, depth: 1.5, anim: 'b' },
      { icon: 'wave', x: 26, y: 82, s: 58, depth: 1.1, anim: 'a' },
      { icon: 'bubble', x: 68, y: 78, s: 40, depth: 1.3, anim: 'c' },
    ],
  },
  {
    word: 'Sleep',
    sub: 'Recovery you can actually read.',
    floaters: [
      { icon: 'moon', x: 16, y: 18, s: 90, depth: 1.5, anim: 'a' },
      { icon: 'star', x: 80, y: 20, s: 60, depth: 1.0, anim: 'b' },
      { icon: 'star', x: 12, y: 62, s: 42, depth: 0.9, anim: 'c' },
      { icon: 'moon', x: 84, y: 64, s: 52, depth: 1.6, anim: 'b' },
      { icon: 'star', x: 28, y: 82, s: 50, depth: 1.2, anim: 'a' },
      { icon: 'bubble', x: 66, y: 80, s: 38, depth: 1.1, anim: 'c' },
    ],
  },
];

export default function Page() {
  const journeyRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = journeyRef.current;
        const vh = window.innerHeight;
        if (el) {
          const rect = el.getBoundingClientRect();
          setP(clamp(-rect.top / (rect.height - vh)));
        }
        if (bgRef.current) {
          const max = document.documentElement.scrollHeight - vh;
          const bp = max > 0 ? clamp(window.scrollY / max) : 0;
          bgRef.current.style.backgroundPosition = `50% ${bp * 100}%`;
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.2 }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const N = STEPS.length;
  const seg = p * (N + 1);
  const introVis = clamp(1 - seg * 1.15);
  const capsuleRot = Math.sin(p * Math.PI * 2.5) * 16;
  const capsuleX = Math.sin(p * Math.PI * 2) * 26;
  const capsuleScale = 0.92 + 0.16 * Math.sin(p * Math.PI);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main>
      <div className="bg-flow" ref={bgRef} aria-hidden />
      <div className="orb orb-1" aria-hidden />
      <div className="orb orb-2" aria-hidden />
      <div className="orb orb-3" aria-hidden />
      <div className="grain" aria-hidden />

      <header className="site-header">
        <a className="wordmark" href="#top">AMALGAM</a>
        <nav>
          <a href="#story">Story</a>
          <a href="#ai">Intelligence</a>
          <a href="#enter" className="btn-pill btn-small">Request invite</a>
        </nav>
      </header>

      <section className="journey" id="top" ref={journeyRef} style={{ height: `${(N + 1) * 100 + 100}vh` }}>
        <div className="journey-sticky">
          <div
            className="hero-intro"
            style={{ opacity: introVis, transform: `translateY(${seg * -70}px)`, pointerEvents: seg < 0.6 ? 'auto' : 'none' }}
          >
            <p className="hero-kicker rise d1">Health, in one place</p>
            <h1 className="hero-title rise d2">AMALGAM</h1>
            <p className="hero-sub rise d3">Your body, decoded.</p>
            <a href="#enter" className="btn-pill rise d4">Enter Amalgam</a>
            <div className="scroll-hint rise d5"><span />Scroll</div>
          </div>

          <div
            className="capsule-stage"
            style={{ transform: `translate(-50%, -50%) translateX(${capsuleX}px) scale(${capsuleScale})` }}
          >
            <div className="capsule-glow" aria-hidden />
            <div className="capsule-halo" aria-hidden />
            <div className="capsule-bob">
              <img
                src="/botanical-capsule.jpeg"
                alt="Amalgam botanical capsule"
                className="capsule"
                style={{ transform: `rotate(${capsuleRot}deg)` }}
              />
            </div>
            <div className="capsule-shadow" aria-hidden />
          </div>

          {STEPS.map((s, i) => {
            const local = clamp(seg - 1 - i);
            const vis = clamp(1 - Math.abs(seg - 1 - i - 0.5) * 2);
            return (
              <div
                key={s.word}
                className="step"
                style={{ opacity: vis, visibility: vis <= 0.02 ? 'hidden' : 'visible' }}
                aria-hidden={vis <= 0.02}
              >
                <h2 className="step-word" style={{ transform: `translate(-50%, -50%) translateY(${(local - 0.5) * -90}px)` }}>
                  {s.word}
                </h2>
                {s.floaters.map((f, j) => (
                  <div
                    key={j}
                    className="floater"
                    style={{
                      left: `${f.x}%`,
                      top: `${f.y}%`,
                      transform: `translate(-50%, -50%) translateY(${(local - 0.5) * f.depth * -240}px) rotate(${(local - 0.5) * f.depth * 36}deg)`,
                    }}
                  >
                    <span className={`floater-inner float-${f.anim}`} style={{ animationDelay: `${j * 0.65}s` }}>
                      <Icon name={f.icon} size={f.s} />
                    </span>
                  </div>
                ))}
                <p className="step-sub" style={{ transform: `translate(-50%, 0) translateY(${(local - 0.5) * 46}px)` }}>
                  {s.sub}
                </p>
              </div>
            );
          })}

          <div className="dots" aria-hidden>
            {STEPS.map((_, i) => (
              <span key={i} className={seg - 1 >= i && seg - 1 < i + 1 ? 'on' : ''} />
            ))}
          </div>
        </div>
      </section>

      <section className="section story" id="story">
        <p className="kicker" data-reveal>The story</p>
        <h2 className="section-title" data-reveal>One body.<br />One story.</h2>
        <p className="section-copy" data-reveal>
          Amalgam isn&rsquo;t another dashboard of disconnected charts. It reads your supplements, hydration,
          movement, stress, and sleep as one continuous narrative &mdash; then tells you what tomorrow should look like.
        </p>
        <div className="bento">
          <article className="card" data-reveal>
            <div className="card-icon"><Icon name="pulse" size={40} /></div>
            <h3>Track</h3>
            <p>Log your stack, water, steps, and sleep in seconds. No friction, no guilt trips.</p>
          </article>
          <article className="card" data-reveal>
            <div className="card-icon"><Icon name="wave" size={40} /></div>
            <h3>Understand</h3>
            <p>Patterns surface on their own &mdash; which habits lift you, and which quietly drain you.</p>
          </article>
          <article className="card" data-reveal>
            <div className="card-icon"><Icon name="star" size={40} /></div>
            <h3>Improve</h3>
            <p>Daily AI recommendations tuned to your body, not a generic template.</p>
          </article>
        </div>
      </section>

      <section className="section ai" id="ai">
        <div className="ai-orb" data-reveal aria-hidden>
          <div className="ai-orb-ring" />
          <div className="ai-orb-core"><Icon name="bolt" size={56} /></div>
        </div>
        <div className="ai-copy">
          <p className="kicker" data-reveal>Amalgam Intelligence</p>
          <h2 className="section-title" data-reveal>It knows what<br />yesterday did to you.</h2>
          <p className="section-copy" data-reveal>
            Every morning, Amalgam reads the night before &mdash; sleep quality, stress load, hydration debt &mdash;
            and hands you a plan that already accounts for it. Recovery stops being a guess.
          </p>
          <a href="#enter" className="btn-pill" data-reveal>Get early access</a>
        </div>
      </section>

      <section className="section cta" id="enter">
        <h2 className="cta-title" data-reveal>Enter<br />Amalgam</h2>
        <p className="section-copy" data-reveal>Request your invite. We open the doors in small waves.</p>
        {sent ? (
          <p className="cta-done" data-reveal>You&rsquo;re on the list. Watch your inbox.</p>
        ) : (
          <form className="cta-form" onSubmit={submit} data-reveal>
            <input type="email" required placeholder="you@email.com" aria-label="Email address" />
            <button type="submit" className="btn-pill">Request invite</button>
          </form>
        )}
      </section>

      <footer className="site-footer">
        <span className="wordmark">AMALGAM</span>
        <span>&copy; 2026 Amalgam. Your body, decoded.</span>
      </footer>
    </main>
  );
}
