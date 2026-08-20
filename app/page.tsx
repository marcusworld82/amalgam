'use client';

import { CSSProperties, PointerEvent, ReactNode, useEffect, useRef, useState } from 'react';

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

type IconName = 'capsule' | 'leaf' | 'drop' | 'bubble' | 'bolt' | 'ring' | 'wave' | 'pulse' | 'moon' | 'star' | 'shield' | 'grid';

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
    case 'shield':
      return (
        <svg {...p}>
          <path d="M32 6l20 8v14c0 14-8 24-20 30-12-6-20-16-20-30V14l20-8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M23 32l6 6 12-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...p}>
          <rect x="10" y="10" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <rect x="26" y="10" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <rect x="42" y="10" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <rect x="10" y="26" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <rect x="26" y="26" width="12" height="12" rx="3" fill="currentColor" />
          <rect x="42" y="26" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <rect x="10" y="42" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <rect x="26" y="42" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <rect x="42" y="42" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
  }
}

/* ---------------- data ---------------- */

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

const SUPPLEMENTS = [
  'Magnesium', 'D3', 'K2', 'B12', 'Protein Powder', 'Creatine', 'Electrolytes', 'Omega-3', 'Milk Thistle',
  'Prebiotics', 'Probiotics', 'Postbiotics', 'Synbiotics', 'Saffron', 'Dandelion', "Lion's Mane", 'Ashwagandha',
  'Turmeric', 'Zinc', 'Vitamin C', 'Collagen', 'NAC', 'Rhodiola', 'Bacopa', 'L-Theanine', 'CoQ10', 'Multivitamins',
  'Vitamin B-Complex', 'Vitamin A', 'Vitamin E', 'Folate', 'Folic Acid', 'Biotin', 'Bromelain', 'Calcium', 'Iron',
  'Potassium', 'Selenium', 'Copper', 'Chromium', 'Manganese', 'Iodine', 'Krill Oil', 'Cod Liver Oil', 'Flaxseed Oil',
  'MCT Oil', 'Essential Amino Acids', 'BCAAs', 'Fiber Supplement', 'Digestive Enzymes', 'Melatonin', '5-HTP', 'GABA',
  'Garlic', 'Ginger', 'Elderberry', 'Grape Seed Extract', 'Inulin', 'Reishi Mushroom', 'Spirulina', 'Acerola',
  'Taurine', 'NMN', 'CaAKG', 'Spermidine', 'Raw Liver Capsules', 'Raw Bone Marrow Capsules', 'Glutamine',
  'L-Carnitine', 'Peptides',
];

const ELEMENTS = [
  { sym: 'O', name: 'Oxygen', desc: 'The most abundant element in the body by mass (~65%). Every cell uses oxygen to convert food into the energy that powers movement, thought, and recovery.' },
  { sym: 'C', name: 'Carbon', desc: 'The structural backbone of all organic molecules — proteins, fats, carbohydrates, and DNA. Carbon chains form the framework of every tissue (~18% of body mass).' },
  { sym: 'H', name: 'Hydrogen', desc: 'Found in water and nearly every biological molecule (~10% of body mass). Essential for hydration, energy transfer, and the chemical reactions that sustain life.' },
  { sym: 'N', name: 'Nitrogen', desc: 'A core building block of amino acids, proteins, and DNA (~3% of body mass). Critical for muscle repair, enzyme function, and genetic coding.' },
  { sym: 'Ca', name: 'Calcium', desc: 'The most abundant mineral in the body (~1.5%). Builds bones and teeth, and powers muscle contraction, nerve signaling, and healthy blood clotting.' },
  { sym: 'P', name: 'Phosphorus', desc: 'Partners with calcium to strengthen bones and teeth (~1% of body mass). Stores cellular energy as ATP and forms the backbone of DNA.' },
  { sym: 'K', name: 'Potassium', desc: 'A key electrolyte (~0.25% of body mass) that regulates fluid balance, nerve impulses, and steady muscle and heart function.' },
  { sym: 'S', name: 'Sulfur', desc: 'A component of key amino acids and antioxidants (~0.25% of body mass). Supports skin, hair, joint health, and the body\'s detoxification pathways.' },
];

const WHY = [
  'Oxygen fuels every cell, powering energy, focus, and recovery.',
  'Carbon forms the backbone of proteins, fats, carbs, and DNA.',
  'Hydrogen, mostly in water, drives hydration and the reactions in every cell.',
  'Nitrogen builds the amino acids and proteins behind muscle repair and enzymes.',
  'Calcium supports bones, teeth, muscle contraction, and nerve signaling.',
  'Phosphorus stores cellular energy as ATP and strengthens bone structure.',
  'Potassium regulates hydration, nerve signals, and steady heart rhythm.',
  'Sulfur supports skin, joints, antioxidants, and detoxification pathways.',
];

const STATS = [
  { value: 74, label: 'of US adults are overweight or obese.', desc: 'Overweight is defined as a BMI of 25–29.9, obesity as 30–39.9, and severe (class III) obesity as 40+. Excess body fat raises the risk of heart disease, type 2 diabetes, and many cancers — making body composition one of the strongest signals of long-term health.' },
  { value: 75, label: 'do not meet recommended physical activity levels.', desc: 'US guidelines call for at least 150 minutes of moderate (or 75 minutes of vigorous) aerobic activity per week, plus muscle-strengthening on 2+ days. Falling short is linked to weaker cardiovascular health, lower metabolic resilience, and reduced longevity.' },
  { value: 38, label: 'have pre-diabetes.', desc: 'Pre-diabetes means blood sugar is elevated (fasting glucose 100–125 mg/dL or A1C 5.7–6.4%) but not yet diabetic. Most people don\'t know they have it, yet it sharply raises the odds of progressing to type 2 diabetes, heart disease, and stroke.' },
  { value: 88, label: 'are not metabolically healthy.', desc: 'Metabolic health means optimal levels across blood sugar, blood pressure, cholesterol, triglycerides, and waist size — without medication. Falling outside even one marker is associated with higher risk of chronic disease, even at a normal weight.' },
  { value: 90, label: 'do not meet recommended intake levels for at least one essential nutrient.', desc: 'Common shortfalls include vitamin D, magnesium, potassium, fiber, calcium, and omega-3s. Chronic gaps quietly affect energy, mood, immunity, bone density, and long-term disease risk — long before they show up on a standard lab panel.' },
  { value: 75, label: 'do not meet recommended daily total water intake levels.', desc: 'Guidelines suggest roughly 3.7 L/day for men and 2.7 L/day for women from all fluids and foods. Even mild dehydration (1–2% body weight) can impair focus, mood, energy, kidney function, and exercise performance.' },
];

const LIVE = [
  'WHOOP — Recovery, strain, sleep, HRV, respiratory rate, SpO₂, skin temp, workouts',
  'Dexcom G7 — Continuous glucose, GMI, time-in-range, sensor sessions',
];

const SOON = ['Apple Health', 'Google Health Connect', '+ more'];

const HEAT = [
  0.9, 0.7, 1, 0.4, 0.8, 0.95, 0.6, 1, 0.85, 0.5, 0.75, 0.9, 1, 0.65,
  0.3, 0.8, 0.9, 1, 0.55, 0.7, 0.95, 0.85, 0.4, 1, 0.75, 0.6, 0.9, 0.8,
  1, 0.5, 0.85, 0.7, 0.95, 0.35, 0.8, 1, 0.65, 0.9, 0.75, 0.55, 0.95, 0.85,
];

type BgIcon = { icon: IconName; x: number; y: number; s: number; speed: number; anim: 'a' | 'b' | 'c' };

const BG_ICONS: BgIcon[] = [
  { icon: 'capsule', x: 6, y: 15, s: 52, speed: 0.14, anim: 'a' },
  { icon: 'leaf', x: 88, y: 12, s: 46, speed: 0.09, anim: 'b' },
  { icon: 'star', x: 15, y: 70, s: 40, speed: 0.12, anim: 'c' },
  { icon: 'drop', x: 78, y: 55, s: 44, speed: 0.07, anim: 'a' },
  { icon: 'bubble', x: 45, y: 18, s: 34, speed: 0.16, anim: 'b' },
  { icon: 'bolt', x: 30, y: 85, s: 42, speed: 0.1, anim: 'c' },
  { icon: 'moon', x: 65, y: 80, s: 40, speed: 0.08, anim: 'a' },
  { icon: 'ring', x: 92, y: 70, s: 36, speed: 0.13, anim: 'b' },
  { icon: 'wave', x: 10, y: 40, s: 50, speed: 0.07, anim: 'c' },
  { icon: 'pulse', x: 55, y: 60, s: 46, speed: 0.11, anim: 'a' },
  { icon: 'capsule', x: 38, y: 35, s: 36, speed: 0.15, anim: 'b' },
  { icon: 'leaf', x: 72, y: 25, s: 38, speed: 0.09, anim: 'c' },
  { icon: 'star', x: 25, y: 10, s: 30, speed: 0.17, anim: 'a' },
  { icon: 'drop', x: 60, y: 45, s: 34, speed: 0.08, anim: 'b' },
  { icon: 'bubble', x: 85, y: 40, s: 30, speed: 0.15, anim: 'c' },
  { icon: 'bolt', x: 48, y: 75, s: 36, speed: 0.1, anim: 'a' },
  { icon: 'moon', x: 20, y: 55, s: 34, speed: 0.12, anim: 'b' },
  { icon: 'ring', x: 35, y: 60, s: 32, speed: 0.14, anim: 'c' },
  { icon: 'wave', x: 80, y: 85, s: 44, speed: 0.07, anim: 'a' },
  { icon: 'pulse', x: 5, y: 85, s: 42, speed: 0.09, anim: 'b' },
  { icon: 'capsule', x: 58, y: 8, s: 34, speed: 0.13, anim: 'c' },
  { icon: 'leaf', x: 42, y: 90, s: 36, speed: 0.11, anim: 'a' },
  { icon: 'star', x: 70, y: 65, s: 28, speed: 0.16, anim: 'b' },
  { icon: 'bubble', x: 12, y: 28, s: 26, speed: 0.18, anim: 'c' },
];

/* ---------------- motion components ---------------- */

function CountUp({ value, prefix = '~', suffix = '%' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1500;
        const tick = (t: number) => {
          const k = clamp((t - start) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          setN(Math.round(eased * value));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}{n}{suffix}
    </span>
  );
}

function SplitWords({ text, startDelay = 0, step = 0.06 }: { text: string; startDelay?: number; step?: number }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span className="wmask" key={i}>
          <span className="wword" style={{ transitionDelay: `${startDelay + i * step}s` }}>
            {w}&nbsp;
          </span>
        </span>
      ))}
    </>
  );
}

function Tilt({ children, wide = false, delay = 0 }: { children: ReactNode; wide?: boolean; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    const inner = el?.firstElementChild as HTMLElement | null;
    if (!el || !inner) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    inner.style.transform = `perspective(950px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-8px)`;
  };

  const onLeave = () => {
    const inner = ref.current?.firstElementChild as HTMLElement | null;
    if (inner) inner.style.transform = '';
  };

  return (
    <div
      ref={ref}
      className={`tilt${wide ? ' feature-wide' : ''}`}
      data-reveal
      style={{ transitionDelay: `${delay}s` }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  );
}

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const items = [...SUPPLEMENTS, ...SUPPLEMENTS];
  return (
    <div className={`marquee-track${reverse ? ' reverse' : ''}`} aria-hidden={reverse}>
      {items.map((s, i) => (
        <span className="mq-item" key={`${s}-${i}`}>
          {s}<span className="mq-dot">•</span>
        </span>
      ))}
    </div>
  );
}

function ElementCard({ sym, name, desc, index }: { sym: string; name: string; desc: string; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`flip${flipped ? ' flipped' : ''}`}
      data-reveal="flip"
      style={{ transitionDelay: `${index * 0.08}s` }}
      onClick={() => setFlipped(!flipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFlipped(!flipped)}
      aria-label={`${name} card, tap to flip`}
    >
      <div className="flip-inner">
        <div className="flip-face flip-front">
          <span className="el-sym">{sym}</span>
          <span className="el-name">{name}</span>
          <span className="flip-hint">Tap →</span>
        </div>
        <div className="flip-face flip-back">
          <span className="el-name">{name}</span>
          <p className="flip-desc">{desc}</p>
          <span className="flip-hint">← Tap to flip back</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, desc, index }: { value: number; label: string; desc: string; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`flip flip-stat${flipped ? ' flipped' : ''}`}
      data-reveal="flip"
      style={{ transitionDelay: `${index * 0.1}s` }}
      onClick={() => setFlipped(!flipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFlipped(!flipped)}
      aria-label={`~${value}% ${label}, tap for more`}
    >
      <div className="flip-inner">
        <div className="flip-face flip-front">
          <span className="stat-num"><CountUp value={value} /></span>
          <span className="stat-label">{label}</span>
          <span className="flip-hint">Tap for more →</span>
        </div>
        <div className="flip-face flip-back">
          <span className="stat-num stat-num-sm">~{value}%</span>
          <p className="flip-desc">{desc}</p>
          <span className="flip-hint">← Tap to flip back</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */

export default function Page() {
  const journeyRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        const y = window.scrollY;

        const el = journeyRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          setP(clamp(-rect.top / (rect.height - vh)));
        }
        if (bgRef.current) {
          const max = document.documentElement.scrollHeight - vh;
          const bp = max > 0 ? clamp(y / max) : 0;
          bgRef.current.style.backgroundPosition = `50% ${bp * 100}%`;
        }
        if (marqueeRef.current) {
          const dy = y - lastY.current;
          const skew = Math.min(10, Math.max(-10, dy * 0.35));
          marqueeRef.current.style.transform = `skewX(${(-skew).toFixed(2)}deg)`;
        }

        const layer = iconsRef.current;
        if (layer) {
          const gate = document.getElementById('rhythm');
          const show = gate ? gate.getBoundingClientRect().top < vh * 0.55 : true;
          layer.style.opacity = show ? '1' : '0';
          const range = vh + 320;
          const kids = layer.children;
          for (let i = 0; i < kids.length; i++) {
            const kid = kids[i] as HTMLElement;
            const speed = parseFloat(kid.dataset.speed || '0.1');
            const off = (y * speed) % range;
            const rot = y * speed * 0.06;
            kid.style.transform = `translateY(${(160 - off).toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;
          }
        }

        lastY.current = y;
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
      { threshold: 0.15 }
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

  return (
    <main>
      <div className="bg-flow" ref={bgRef} aria-hidden />
      <div className="orb orb-1" aria-hidden />
      <div className="orb orb-2" aria-hidden />
      <div className="orb orb-3" aria-hidden />
      <div className="bg-icons" ref={iconsRef} aria-hidden>
        {BG_ICONS.map((b, i) => (
          <span key={i} className="bg-icon" data-speed={b.speed} style={{ left: `${b.x}%`, top: `${b.y}%` }}>
            <span className={`floater-inner float-${b.anim}`} style={{ animationDelay: `${i * 0.5}s` }}>
              <Icon name={b.icon} size={b.s} />
            </span>
          </span>
        ))}
      </div>
      <div className="grain" aria-hidden />

      <header className="site-header">
        <a className="wordmark" href="#top">AMALGAM</a>
        <nav>
          <a href="#story">Story</a>
          <a href="#features">Features</a>
          <a href="https://tryamalgam.com/request-invite" className="btn-pill btn-small">Enter Amalgam</a>
        </nav>
      </header>

      {/* ---------- pinned scroll journey ---------- */}
      <section className="journey" id="top" ref={journeyRef} style={{ height: `${(N + 1) * 100 + 100}vh` }}>
        <div className="journey-sticky">
          <div
            className="hero-intro"
            style={{ opacity: introVis, transform: `translateY(${seg * -70}px)`, pointerEvents: seg < 0.6 ? 'auto' : 'none' }}
          >
            <p className="hero-kicker rise d1">Your daily ritual</p>
            <h1 className="hero-title rise d2">AMALGAM</h1>
            <p className="hero-sub rise d3">Every dose, every day. Held together.</p>
            <div className="hero-cta rise d4">
              <a href="https://tryamalgam.com/request-invite" className="btn-pill">Enter Amalgam</a>
              <a href="#features" className="btn-pill btn-ghost">See features</a>
            </div>
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

      {/* ---------- supplement marquee (velocity-reactive) ---------- */}
      <div className="marquee" ref={marqueeRef} aria-label="Supported supplements">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>

      {/* ---------- the rhythm ---------- */}
      <section className="section statement" id="rhythm">
        <p className="kicker" data-reveal>The rhythm</p>
        <h2 className="section-title" data-reveal="words">
          <SplitWords text="Health is not a dashboard." />
          <br />
          <SplitWords text="It’s a rhythm." startDelay={0.3} />
        </h2>
      </section>

      {/* ---------- meet amalgam ---------- */}
      <section className="section" id="story">
        <div className="meet-grid">
          <Tilt delay={0}>
            <article className="card meet-card">
              <p className="feature-tag">Meet Amalgam</p>
              <p>Amalgam is a daily ritual companion. It brings your supplements, medications, hydration, sleep, movement, and wearable signals into one calm place — then helps you see what actually works.</p>
            </article>
          </Tilt>
          <Tilt delay={0.1}>
            <article className="card meet-card">
              <p className="feature-tag">Our purpose</p>
              <p>We built Amalgam because most health apps either overwhelm you with data or reduce you to a score. We wanted something quieter: a tool that listens to your inputs, respects your time, and turns small daily actions into a clearer picture over time.</p>
            </article>
          </Tilt>
          <Tilt delay={0.2}>
            <article className="card meet-card">
              <p className="feature-tag">How it helps</p>
              <p>Whether you’re managing a supplement stack, tracking a chronic condition, optimizing sleep, or simply trying to stay consistent, Amalgam helps you notice patterns, avoid gaps, and make choices that fit your actual life.</p>
            </article>
          </Tilt>
          <Tilt delay={0.3}>
            <article className="card meet-card">
              <p className="feature-tag">What’s next</p>
              <p>Amalgam will keep deepening — more wearable integrations, richer health insights from Amala, and a ritual that grows with you. The goal is not more data. It’s a calmer, more personal path to feeling better.</p>
            </article>
          </Tilt>
        </div>
      </section>

      {/* ---------- features ---------- */}
      <section className="section" id="features">
        <p className="kicker" data-reveal>Features</p>
        <h2 className="section-title" data-reveal="words">
          <SplitWords text="Built for the way you" />
          <br />
          <SplitWords text="actually take care of yourself." startDelay={0.3} />
        </h2>
        <div className="bento">
          <Tilt delay={0}>
            <article className="card">
              <div className="card-icon"><Icon name="capsule" size={40} /></div>
              <p className="feature-tag">Ritual</p>
              <h3>Daily Ritual</h3>
              <p>Your full schedule of supplements and medications, organized exactly the way you actually take them. Define your ritual once — doses, timing, form, personal notes — and Amala synthesizes it into a calm, ordered daily flow that reads like a checklist without ever feeling like one.</p>
              <p>Morning fuel, midday focus, evening wind-down, and night recovery each hold their place. You always know what’s next, what’s already done, and what you can trust to be there tomorrow — without ever having to check a label.</p>
            </article>
          </Tilt>
          <Tilt delay={0.1}>
            <article className="card">
              <div className="card-icon"><Icon name="pulse" size={40} /></div>
              <p className="feature-tag">Pulse</p>
              <h3>Dose Tracking</h3>
              <p>Whether it’s a capsule, drop, tincture, spray, or mist, a single tap logs your progress in the moment. There’s no judgment for the days that get away from you and no clutter for the days that go perfectly — just an honest record of what you actually took, and when.</p>
              <p>Every log flows quietly into Amala, feeding your streaks, weekly pulse, and Health Index without ever asking you to think about it twice.</p>
            </article>
          </Tilt>
          <Tilt delay={0.2}>
            <article className="card">
              <div className="card-icon"><Icon name="star" size={40} /></div>
              <p className="feature-tag">Synthesis</p>
              <h3>Health Profile</h3>
              <p>Share a few brief details about your daily rhythm — from lifestyle habits and nutrition to current medications — and Amala synthesizes them into a holistic 0–100 Health Index. You get a clear, single view of your metabolic balance, stress load, symptom picture, and where the weakest links quietly live.</p>
              <p>From that same profile, Amalgam curates a supplement ritual designed for your body’s natural cycle — perfectly mapped from morning to night, and refined every time your inputs shift.</p>
            </article>
          </Tilt>
          <Tilt wide delay={0.1}>
            <article className="card">
              <div className="card-icon"><Icon name="ring" size={40} /></div>
              <p className="feature-tag">Connections</p>
              <h3>Integrations</h3>
              <p>Amalgam meets you where your data already lives, working quietly in the background so you don’t have to. By connecting passively to your wearables and health platforms, it transforms silent biometric streams — like recovery depth, sleep architectures, glucose behaviors, and strain patterns — into actionable contexts for your daily ritual.</p>
              <p>Instead of forcing you to jump between fragmented dashboards, Amalgam unifies these disparate signals into a singular, cohesive view. It acts as an automated ledger that listens to your body’s baseline in real time, helping you adjust your supplement stack, notice subtle physiological shifts, and understand the genuine impact of your habits without demanding your constant attention.</p>
              <div className="chips">
                <span className="chips-label">Live now</span>
                {LIVE.map((c, i) => (
                  <span key={c} className="chip chip-live" style={{ '--d': `${0.3 + i * 0.12}s` } as CSSProperties}>
                    <span className="dot" />{c}
                  </span>
                ))}
                <span className="chips-label">Coming soon</span>
                {SOON.map((c, i) => (
                  <span key={c} className="chip chip-soon" style={{ '--d': `${0.55 + i * 0.12}s` } as CSSProperties}>
                    <span className="dot" />{c}
                  </span>
                ))}
              </div>
            </article>
          </Tilt>
          <Tilt wide delay={0.15}>
            <article className="card" id="ai">
              <div className="ai-feature">
                <div className="ai-orb" aria-hidden>
                  <div className="ai-orb-ring" />
                  <div className="ai-orb-core"><Icon name="bolt" size={48} /></div>
                </div>
                <div>
                  <p className="feature-tag">Intelligence</p>
                  <h3>Amala AI</h3>
                  <p>Amala is the quiet intelligence beneath your entire experience — the layer that watches your inputs, listens to your rhythm, and translates daily details into insight. From lifestyle levers and morning notes to sleep, stress, and supplement patterns, everything you give her is synthesized into something clearer than the sum of its parts. Every recommendation, every Health Index shift, every nudge in your ritual is filtered through Amala first — so the guidance you see stays true to your body, your goals, and the version of yourself you’re becoming.</p>
                  <p>And when you want to go deeper, you can simply ask. A private conversation with the intelligence that already knows your ritual, your data, and your goals — “why am I taking this?”, “how did last week actually go?”, “what should I lean into before travel?” — answered in context, drawing on your Health Profile, current stack, integrations, and recent trends. It’s the closest thing to a knowledgeable friend who has been paying quiet attention all along.</p>
                </div>
              </div>
            </article>
          </Tilt>
          <Tilt wide delay={0.2}>
            <article className="card">
              <div className="card-icon"><Icon name="grid" size={40} /></div>
              <p className="feature-tag">Patterns</p>
              <h3>Consistency Heatmap</h3>
              <p>A calm grid shows where you’ve stayed steady and where the week got the better of you. Streaks reveal themselves without shouting, and gaps read as information rather than failure.</p>
              <p>Zoom out and the shape of your year appears — the seasons where your ritual clicked, the stretches that quietly slipped, and the direction you’re actually moving.</p>
              <div className="heat" aria-hidden>
                {HEAT.map((v, i) => (
                  <span key={i} style={{ opacity: 0.15 + v * 0.85, '--d': `${0.2 + i * 0.025}s` } as CSSProperties} />
                ))}
              </div>
            </article>
          </Tilt>
        </div>
        <p className="more-link" data-reveal>
          <a href="https://tryamalgam.com/features">Show all features →</a>
        </p>
      </section>

      {/* ---------- the body ---------- */}
      <section className="section" id="body">
        <p className="kicker" data-reveal>The body</p>
        <h2 className="section-title" data-reveal="words">
          <SplitWords text="What the Body Needs to Thrive" />
        </h2>
        <p className="section-copy" data-reveal>
          Your body is built from essential elements, minerals, water, vitamins, and nutrients that support energy,
          recovery, focus, metabolism, and long-term health.
        </p>
        <p className="sub-label" data-reveal>What the body is made of</p>
        <div className="elements-grid">
          {ELEMENTS.map((el, i) => (
            <ElementCard key={el.sym} {...el} index={i} />
          ))}
        </div>
        <p className="sub-label" data-reveal>Why they matter</p>
        <ul className="why-grid" data-reveal>
          {WHY.map((w) => (
            <li key={w}><span className="why-dot" />{w}</li>
          ))}
        </ul>
      </section>

      {/* ---------- path to balance ---------- */}
      <section className="section statement">
        <p className="kicker" data-reveal>The path to balance</p>
        <p className="section-copy statement-copy" data-reveal>
          True replenishment is a daily ritual — from natural sunlight and conscious hydration to intentional
          vitamins and nutrition, every element plays a vital role in sustaining lasting internal harmony and balance.
        </p>
      </section>

      {/* ---------- modern condition ---------- */}
      <section className="section" id="condition">
        <p className="kicker" data-reveal>The modern condition</p>
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} index={i} />
          ))}
        </div>
        <p className="section-copy statement-copy" data-reveal style={{ marginTop: '64px' }}>
          Busy schedules, processed foods, and inconsistency — even with the best intentions, modern life can easily
          disrupt the harmony of our internal rhythm.
        </p>
        <h2 className="section-title signal" data-reveal="words">
          <SplitWords text="In a world of noise," />
          <br />
          <SplitWords text="Amalgam provides the signal." startDelay={0.35} />
        </h2>
      </section>

      {/* ---------- moment of clarity ---------- */}
      <section className="section statement">
        <h2 className="section-title" data-reveal="words">
          <SplitWords text="A Moment of Clarity" />
        </h2>
        <p className="section-copy statement-copy" data-reveal>
          Consistency turns good intentions into lasting change. By bringing awareness to your daily habits,
          you create the clarity your body needs to perform at its best.
        </p>
        <p className="sub-label" data-reveal>Begin your daily ritual</p>
        <a href="https://tryamalgam.com/request-invite" className="btn-pill" data-reveal>Enter Amalgam</a>
      </section>

      {/* ---------- privacy ---------- */}
      <section className="section statement" id="privacy">
        <div className="card-icon privacy-icon" data-reveal><Icon name="shield" size={44} /></div>
        <p className="kicker" data-reveal>Privacy</p>
        <h2 className="section-title" data-reveal="words">
          <SplitWords text="Your data is a sanctuary." />
        </h2>
        <p className="section-copy statement-copy" data-reveal>
          Your rituals, readings, and reflections are deeply personal. Amalgam is built with industry-leading
          encryption and strict data architecture, ensuring your health journey remains entirely yours — private,
          protected, and held in confidence.
        </p>
        <p className="more-link" data-reveal>
          <a href="https://tryamalgam.com/privacy-security">The Anatomy of Your Sanctuary →</a>
        </p>
      </section>

      {/* ---------- final CTA ---------- */}
      <section className="section cta" id="enter">
        <h2 className="cta-title" data-reveal="words">
          <SplitWords text="Start" />
          <br />
          <SplitWords text="with today." startDelay={0.2} />
        </h2>
        <p className="section-copy" data-reveal>
          No setup ceremony. Add what you take, when you take it, and let Amalgam hold the rest.
        </p>
        <a href="https://tryamalgam.com/request-invite" className="btn-pill" data-reveal>Enter Amalgam</a>
      </section>

      <footer className="site-footer">
        <span className="wordmark">AMALGAM</span>
        <span>&copy; 2026 Amalgam. Every dose, every day. Held together.</span>
        <a href="https://tryamalgam.com/privacy-security">Privacy</a>
      </footer>
    </main>
  );
}
