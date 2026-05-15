import { useState } from "react";
import beforeAfter from "@/assets/before-after.jpg";

const stats = [
  { value: "95%", label: "Hydration improvement" },
  { value: "87%", label: "Stronger hair roots" },
  { value: "92%", label: "Reduction in breakage" },
  { value: "98%", label: "Softer skin texture" },
];

export function Results() {
  const [pos, setPos] = useState(50);
  return (
    <section id="results" className="relative py-28 px-6 bg-[var(--gradient-warm)]">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-accent">Visible Results</span>
          <h2 className="mt-3 font-display text-5xl md:text-6xl text-balance">
            Four weeks. <em className="not-italic text-gradient-gold">A new ritual.</em>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl">
            Independent consumer study, 248 participants, after 28 days of daily use.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl glass p-6">
                <div className="font-display text-4xl text-gradient-gold">{s.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-luxe select-none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPos(((e.clientX - rect.left) / rect.width) * 100);
            }}
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPos(((e.touches[0].clientX - rect.left) / rect.width) * 100);
            }}
          >
            <img src={beforeAfter} alt="After" loading="lazy" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
              <img src={beforeAfter} alt="Before" className="absolute inset-0 size-full object-cover grayscale brightness-90 contrast-90" style={{ width: `${100 / (pos / 100)}%` }} />
              <span className="absolute top-5 left-5 glass rounded-full px-4 py-1 text-[10px] tracking-widest uppercase">Before</span>
            </div>
            <span className="absolute top-5 right-5 glass rounded-full px-4 py-1 text-[10px] tracking-widest uppercase">After</span>
            <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-luxe pointer-events-none" style={{ left: `${pos}%` }}>
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-12 rounded-full glass border border-white/60 flex items-center justify-center text-xs">
                ⇆
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
