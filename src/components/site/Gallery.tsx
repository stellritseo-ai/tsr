import { Instagram } from "lucide-react";
import g1 from "@/assets/Hair-Butter1.jpg";
import g2 from "@/assets/Growth-Oil2.jpg";
import g3 from "@/assets/Rosemary.jpg";
import g4 from "@/assets/Goat-Milk.jpg";
import g5 from "@/assets/Charcoal-Detox.jpg";
import g6 from "@/assets/Hydrating-Spray.jpg";

const items = [
  { src: g1, span: "md:row-span-2" },
  { src: g2, span: "" },
  { src: g3, span: "" },
  { src: g4, span: "" },
  { src: g5, span: "md:row-span-2" },
  { src: g6, span: "" },
];

export function Gallery() {
  return (
    <section id="gallery" className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-accent">@tsr.beauty</span>
            <h2 className="mt-3 font-display text-5xl md:text-6xl text-balance">From the rituals.</h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-sm story-link">
            <Instagram className="size-4" /> Follow our journal
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 auto-rows-[18rem]">
          {items.map((it, i) => (
            <a
              key={i}
              href="#"
              className={`group relative rounded-3xl overflow-hidden ${it.span}`}
            >
              <img src={it.src} alt="" loading="lazy" className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-5">
                <Instagram className="size-5 text-cream" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
