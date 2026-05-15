import { BadgeCheck, Star } from "lucide-react";

const reviews = [
  {
    name: "Amara O.",
    title: "Loyalist for 2 years",
    text: "The Growth Oil completely transformed my edges. My hair feels stronger and the scent is heavenly — like a spa in my bathroom.",
  },
  {
    name: "Lila S.",
    title: "Verified buyer",
    text: "I've tried every luxury brand. Nothing compares to the Hair Butter — soft, nourishing, never greasy. My ritual every Sunday.",
  },
  {
    name: "Naomi K.",
    title: "Verified buyer",
    text: "The Aloe Shea Bar leaves my skin glowing for days. I gifted three to friends, and now they're all converted.",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="blur-blob bg-[oklch(0.85_0.08_75)] top-10 left-1/2 -translate-x-1/2 size-[600px] opacity-40" />
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] uppercase text-accent">In Their Words</span>
          <h2 className="mt-3 font-display text-5xl md:text-6xl text-balance">
            Quietly devoted.
          </h2>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <figure
              key={r.name}
              className="rounded-3xl bg-card border border-border/60 p-8 shadow-soft hover:shadow-luxe transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 font-display text-2xl leading-snug">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <div className="size-11 rounded-full bg-[var(--gradient-gold)]" />
                <div>
                  <div className="text-sm font-medium flex items-center gap-1.5">
                    {r.name}
                    <BadgeCheck className="size-4 text-accent" />
                  </div>
                  <div className="text-xs text-muted-foreground">{r.title}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
