import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import butter from "@/assets/product-hair-butter.jpg";
import oil from "@/assets/product-growth-oil.jpg";
import soap from "@/assets/product-soap.jpg";
import spray from "@/assets/product-hydrating-spray.jpg";

const items = [
  { name: "Hair Butter", desc: "Whipped shea, avocado, mango — sealed in moisture for days.", img: butter, price: 32 },
  { name: "Growth Oil", desc: "Rosemary, argan, castor. Roots fed, lengths strengthened.", img: oil, price: 38 },
  { name: "Aloe Shea Soap", desc: "A creamy artisan bar that leaves skin softened and calm.", img: soap, price: 18 },
  { name: "Hydrating Spray", desc: "Aloe and rose water mist — hydration at first touch.", img: spray, price: 24 },
];

export function BestSellers() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="px-6 mx-auto max-w-7xl flex items-end justify-between flex-wrap gap-6 mb-12">
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-accent">Loved Most</span>
          <h2 className="mt-3 font-display text-5xl md:text-6xl text-balance max-w-2xl">
            The bestsellers — back, again.
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} aria-label="Previous" className="size-12 rounded-full border border-border hover:bg-secondary transition flex items-center justify-center">
            <ArrowLeft className="size-4" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Next" className="size-12 rounded-full bg-primary text-primary-foreground hover:bg-ink transition flex items-center justify-center">
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      <div ref={ref} className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it) => (
          <article
            key={it.name}
            className="snap-start shrink-0 w-[85vw] sm:w-[55vw] lg:w-[38vw] xl:w-[32vw] rounded-[2rem] overflow-hidden bg-[var(--gradient-warm)] shadow-soft hover:shadow-luxe transition-all duration-700"
          >
            <div className="relative aspect-[5/6] overflow-hidden">
              <img src={it.img} alt={it.name} loading="lazy" className="size-full object-cover" />
              <div className="absolute bottom-5 left-5 right-5 glass rounded-2xl p-5 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-3xl">{it.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{it.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg">${it.price}</div>
                  <button className="mt-2 text-xs tracking-widest uppercase story-link">Add</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
