const items = [
  "Deep Hydration And Nourishment",
  "Softens And Smooths Dry Skin",
  "Antioxidant-Rich Botanical Ingredients",
  "Lightweight Daily Moisture Care",
  "Elegant Luxury Skincare Branding",
];

export function Marquee() {
  return (
    <div className="border-y border-border/50 py-5 overflow-hidden bg-secondary/40">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="font-display text-2xl mx-10 text-foreground/70 inline-flex items-center gap-10">
            {item}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
