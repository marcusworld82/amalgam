"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const systems = [
  ["01", "INTELLIGENCE", "Amala", "Your health has context. Amala understands it.", "Signals become an insight you can act on."],
  ["02", "RITUAL", "Daily ritual", "Your everyday operating system.", "Every dose, every day. Held together."],
  ["03", "AWARENESS", "Notice", "See what’s actually happening.", "Hydration, stress, sleep, CGM and movement in one calm place."],
  ["04", "RHYTHM", "Patterns", "Consistency becomes measurable.", "Small actions make a clearer picture over time."],
  ["05", "SYNTHESIS", "Perspective", "Your history becomes something you can learn from.", "Daily signals resolve into a single living health picture."]
] as const;

const data = ["Supplements", "Hydration", "Sleep", "Stress", "CGM", "Movement"];

export default function Home() {
  const page = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".hero-capsule", {
        y: 120,
        rotation: 12,
        scale: 0.82,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.2 }
      });

      gsap.utils.toArray<HTMLElement>(".orbit-chip").forEach((chip, index) => {
        gsap.to(chip, {
          rotation: index % 2 ? -130 : 130,
          x: (index % 2 ? -1 : 1) * (70 + index * 18),
          y: -50 + index * 24,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 }
        });
      });

      gsap.utils.toArray<HTMLElement>(".system").forEach((section) => {
        const visual = section.querySelector(".system-visual");
        const capsule = section.querySelector(".system-capsule");

        gsap.fromTo(
          visual,
          { y: 70, opacity: 0.25, rotate: -4 },
          {
            y: -30,
            opacity: 1,
            rotate: 2,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 }
          }
        );

        gsap.to(capsule, {
          rotation: 26,
          y: -65,
          scale: 1.09,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 }
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((item) => {
        gsap.from(item, {
          y: 42,
          opacity: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 82%" }
        });
      });
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={page}>
      <section className="hero">
        <div className="ambient ambient-a" />
        <div className="ambient ambient-b" />
        <div className="grain" />
        <header>
          <span className="wordmark">ə-māl-gəm</span>
          <span className="header-note">your daily ritual</span>
        </header>
        <div className="hero-orbit" aria-hidden="true">
          {data.map((item, i) => (
            <span key={item} className={`orbit-chip chip-${i}`}>
              {item}
            </span>
          ))}
        </div>
        <div className="hero-center">
          <div className="capsule-halo" />
          <img className="hero-capsule" src="/botanical-capsule.jpeg" alt="Amalgam botanical capsule" />
          <p className="definition">A mixture or blend of different elements combined into a unified whole.</p>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">AMALGAM / DAILY RITUAL</p>
          <h1>
            Every dose, every day.
            <em>Held together.</em>
          </h1>
          <p>Health, in all of its moving parts, held in one calm place.</p>
        </div>
        <div className="scroll-cue">
          SCROLL TO EXPERIENCE <span>↓</span>
        </div>
      </section>

      <section className="thesis">
        <p className="eyebrow">THE AMALGAM MOMENT</p>
        <h2>
          Health is not a dashboard.
          <em>It’s a rhythm.</em>
        </h2>
        <div className="thesis-grid">
          <p>Amalgam is a daily ritual companion. It brings your supplements, medications, hydration, sleep, movement, and wearable signals into one place — then helps you see what actually works.</p>
          <p>Not another wall of numbers. A quieter way to notice patterns, close gaps, and turn small daily actions into a clearer picture over time.</p>
        </div>
      </section>

      <section className="connection">
        <div className="connection-copy reveal">
          <p className="eyebrow">ONE PLACE FOR EVERYTHING</p>
          <h2>
            Your health, <em>finally connected.</em>
          </h2>
          <p>Sleep. Supplements. Medication. Hydration. Stress. Activity. Each signal has meaning when it belongs to the whole.</p>
        </div>
        <div className="connection-visual reveal">
          <div className="connection-core">AMALA</div>
          {data.map((item, i) => (
            <div className={`signal signal-${i}`} key={item}>
              {item}
            </div>
          ))}
          <div className="connection-lines" />
        </div>
      </section>

      <section className="systems-intro">
        <p className="eyebrow">THE SYSTEM</p>
        <h2>Connect → Understand → Act → Track → Learn → Adapt</h2>
      </section>

      {systems.map(([number, label, title, heading, detail], index) => (
        <section className={`system system-${index}`} key={label}>
          <div className="system-copy">
            <p className="system-index">
              {number} / {label}
            </p>
            <h2>{heading}</h2>
            <p>{detail}</p>
            <div className="system-progress">
              {systems.map(([n, l]) => (
                <span className={n === number ? "active" : ""} key={n}>
                  {n} {l}
                </span>
              ))}
            </div>
          </div>
          <div className="system-visual">
            <div className="visual-glow" />
            <img className="system-capsule" src="/botanical-capsule.jpeg" alt="" />
            <div className="glass-ui">
              <span>{title.toUpperCase()}</span>
              <strong>{index === 0 ? "78" : index === 1 ? "13 / 25" : index === 2 ? "62%" : index === 3 ? "8 days" : "One clear picture"}</strong>
              <small>{index === 0 ? "Health index · in context" : index === 1 ? "doses held together" : index === 2 ? "today’s rhythm" : index === 3 ? "current consistency" : "your next best action"}</small>
              <i />
            </div>
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
          </div>
        </section>
      ))}

      <section className="body">
        <p className="eyebrow">THE BODY IS AN AMALGAM</p>
        <h2>
          What the body needs <em>to thrive.</em>
        </h2>
        <p className="body-lead">Different elements. Different inputs. One living system.</p>
        <div className="elements">
          {["O", "C", "H", "N", "Ca", "P", "K", "S"].map((element, i) => (
            <article className={`element e-${i}`} key={element}>
              <span>{element}</span>
              <small>{["Oxygen", "Carbon", "Hydrogen", "Nitrogen", "Calcium", "Phosphorus", "Potassium", "Sulfur"][i]}</small>
            </article>
          ))}
        </div>
        <p className="body-close">
          Sleep · Nutrition · Supplements · Medication · Movement · Stress
          <br />
          <strong>All held together.</strong>
        </p>
      </section>

      <section className="bento">
        <div className="bento-head">
          <p className="eyebrow">THE DETAILS</p>
          <h2>Everything has a place.</h2>
        </div>
        <div className="bento-grid">
          <article className="bento-card large">
            <span>AMALA</span>
            <h3>Ask better questions.</h3>
            <p>Quiet, contextual intelligence grounded in your rhythm.</p>
            <div className="chat">
              Why am I taking this?
              <br />
              <b>Here’s the pattern I’m noticing…</b>
            </div>
          </article>
          <article className="bento-card cgm">
            <span>CGM</span>
            <h3>See the signal.</h3>
            <div className="chart" />
          </article>
          <article className="bento-card journal">
            <span>JOURNAL</span>
            <h3>Make space to notice.</h3>
            <p>Small reflections, held over time.</p>
          </article>
          <article className="bento-card reminders">
            <span>RITUAL</span>
            <h3>A reminder when it matters.</h3>
            <div className="mini-pill" />
          </article>
        </div>
      </section>

      <section className="sanctuary">
        <div className="sanctuary-mark">ə</div>
        <p className="eyebrow">PRIVATE BY DESIGN</p>
        <h2>
          Your data is a <em>sanctuary.</em>
        </h2>
        <p>Your rituals, readings, and reflections are deeply personal. Amalgam is built with a quieter, more intentional relationship with your health information.</p>
        <div className="start-card">
          <p>START WITH TODAY.</p>
          <h3>Every small action belongs somewhere.</h3>
          <button type="button">
            Enter Amalgam <span>↗</span>
          </button>
        </div>
      </section>

      <footer>
        <span>© AMALGAM</span>
        <span>EVERY DOSE, EVERY DAY. HELD TOGETHER.</span>
        <span>DESIGN STUDY / 2026</span>
      </footer>
    </main>
  );
}
