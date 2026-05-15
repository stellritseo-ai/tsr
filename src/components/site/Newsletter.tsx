import { ArrowRight } from "lucide-react";

export function Newsletter() {
  return (
    <section id="contact" className="relative py-28 px-6 overflow-hidden">
      <div className="blur-blob bg-[oklch(0.78_0.07_130)] -top-10 -left-10 size-[400px] opacity-40" />
      <div className="blur-blob bg-[oklch(0.85_0.08_75)] -bottom-10 -right-10 size-[400px] opacity-50" />

      <div className="relative mx-auto max-w-4xl glass rounded-[2.5rem] px-8 md:px-16 py-16 md:py-20 text-center shadow-luxe">
        <span className="text-xs tracking-[0.3em] uppercase text-accent">The Ritual</span>
        <h2 className="mt-3 font-display text-5xl md:text-6xl text-balance">
          Join the TSR Beauty Ritual
        </h2>
        <p className="mt-5 text-muted-foreground max-w-lg mx-auto">
          Exclusive offers, slow‑skincare wisdom, and early access to new launches.
          Delivered, gently, once a month.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-9 max-w-lg mx-auto flex flex-col sm:flex-row gap-3 p-2 sm:p-2 rounded-full sm:bg-card sm:border sm:border-border"
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 bg-card sm:bg-transparent rounded-full sm:rounded-none px-6 py-4 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 text-sm hover:bg-ink transition group">
            Subscribe
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        <p className="mt-4 text-[11px] text-muted-foreground tracking-wide">
          No spam — unsubscribe in one click.
        </p>
      </div>
    </section>
  );
}
