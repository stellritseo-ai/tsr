import storyImg from "@/assets/story-ingredients.jpg";

export function Story() {
  return (
    <section id="story" className="relative py-28 px-6 overflow-hidden">
      <div className="blur-blob bg-[oklch(0.78_0.07_130)] top-20 -left-32 size-[400px] opacity-40" />
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-luxe">
            <img src={storyImg} alt="Botanical ingredients" loading="lazy" className="size-full object-cover" />
          </div>
          <div className="absolute -bottom-8 -right-4 glass rounded-2xl p-6 w-64 shadow-soft animate-float-slow">
            <div className="text-xs tracking-[0.25em] uppercase text-muted-foreground">Since 2019</div>
            <div className="mt-2 font-display text-3xl">Rooted in nature.</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Every formula begins on our apothecary bench.
            </div>
          </div>
        </div>

        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-accent">Our Philosophy</span>
          <h2 className="mt-3 font-display text-5xl md:text-6xl leading-[1.05] text-balance">
            Crafted with nature.<br />
            <em className="not-italic text-gradient-gold">Designed for results.</em>
          </h2>
          <p className="mt-7 text-lg text-muted-foreground leading-relaxed max-w-xl">
            TSR blends cold‑pressed natural oils, raw shea butter, fresh aloe vera, rosemary,
            avocado, vitamin E, and rare botanical extracts into skin and hair rituals that
            actually work — without compromise.
          </p>

          <ul className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-5">
            {[
              ["Slow‑crafted", "Hand‑poured in small batches."],
              ["Clinically clean", "No parabens, sulfates, silicones."],
              ["Botanically rich", "30+ active plant ingredients."],
              ["Visibly potent", "Results within four weeks."],
            ].map(([title, sub]) => (
              <li key={title} className="border-l border-accent/40 pl-5">
                <div className="font-display text-xl">{title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{sub}</div>
              </li>
            ))}
          </ul>

          <a
            href="#ingredients"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-foreground/20 px-7 py-3.5 text-sm hover:bg-foreground/5 transition"
          >
            Discover the ingredients
          </a>
        </div>
      </div>
    </section>
  );
}
