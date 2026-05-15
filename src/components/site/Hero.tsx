import heroImg from "@/assets/hero-product.jpg";
import { ArrowRight, Leaf, ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20 grain isolate">
      {/* Blur blobs */}
      <div className="blur-blob bg-[oklch(0.85_0.08_75)] -top-32 -left-20 size-[500px]" />
      <div className="blur-blob bg-[oklch(0.78_0.07_130)] bottom-0 -right-20 size-[600px] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs tracking-[0.2em] uppercase text-foreground/70">
            <Leaf className="size-3" /> Deep Hydration • Nourishing • Antioxidant Rich
          </span>
          <h1 className="mt-7 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] text-balance">
            Rosemary<br />
            <em className="not-italic text-gradient-gold"> & Clove</em> Lotion™
          </h1>
          <p className="mt-7 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Luxury botanical lotion infused with rosemary, clove, shea butter, and sweet almond oil for soft,
            healthy-looking skin.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#shop"
              className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 text-sm tracking-wide hover:bg-ink transition-all shadow-luxe"
            >
              See All Collection
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#ingredients"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-7 py-4 text-sm tracking-wide hover:bg-foreground/5 transition"
            >
              Explore Ingredients
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8 text-xs tracking-widest uppercase text-muted-foreground">
            <div><div className="text-2xl font-display text-foreground">12k+</div>5★ reviews</div>
            <div className="h-10 w-px bg-border" />
            <div><div className="text-2xl font-display text-foreground">100%</div>natural</div>
            <div className="h-10 w-px bg-border" />
            <div><div className="text-2xl font-display text-foreground">0</div>parabens</div>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/5] max-w-xl mx-auto">
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-luxe animate-float">
              <img src={heroImg} alt="Hair growth oil with rosemary and argan" className="size-full object-cover" />
            </div>

            {/* Floating glass cards */}
            <div className="absolute -left-6 top-10 glass rounded-2xl p-4 w-52 shadow-soft animate-float-slow">
              <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Bestseller</div>
              <div className="mt-1 font-display text-lg">Hair Butter</div>
              <div className="mt-1 text-xs text-muted-foreground">Mois Burize & Avocado Oil, Vitamin E</div>
              <div className="mt-2 text-sm font-medium">$29.99</div>
            </div>

            <div className="absolute -right-4 bottom-12 glass rounded-2xl p-4 w-56 shadow-soft animate-float">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[var(--gradient-gold)]" />
                <div>
                  <div className="text-xs text-muted-foreground">Loved by</div>
                  <div className="font-display text-base">12,400 rituals</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass rounded-full px-5 py-2.5 text-xs tracking-widest uppercase shadow-soft">
              ⊹ Cruelty‑free · Vegan ⊹
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
        <span>Scroll</span>
        <ChevronDown className="size-4 animate-scroll-hint" />
      </div>
    </section>
  );
}
