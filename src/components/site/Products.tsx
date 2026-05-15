import { Star, Plus } from "lucide-react";
import oil from "@/assets/product-growth-oil.jpg";
import spray from "@/assets/product-hydrating-spray.jpg";
import butter from "@/assets/product-hair-butter.jpg";
import soap from "@/assets/product-soap.jpg";

const products = [
  { name: "Growth Oil", price: 38, img: oil, ingredients: "Rosemary · Argan · Castor", rating: 4.9, tag: "Bestseller" },
  { name: "Hydrating Spray", price: 24, img: spray, ingredients: "Aloe · Rose Water · Vit. E", rating: 4.8, tag: "New" },
  { name: "Hair Butter", price: 32, img: butter, ingredients: "Shea · Avocado · Mango", rating: 4.9, tag: "Restock" },
  { name: "Aloe Shea Bar", price: 18, img: soap, ingredients: "Aloe · Shea · Olive", rating: 4.7, tag: "Editor's Pick" },
];

export function Products() {
  return (
    <section id="products" className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-accent">The Collection</span>
            <h2 className="mt-3 font-display text-5xl md:text-6xl max-w-2xl text-balance">
              Rituals crafted for visible results.
            </h2>
          </div>
          <a href="#" className="text-sm story-link">View All Products →</a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <article
              key={p.name}
              className="group relative rounded-3xl overflow-hidden bg-card border border-border/60 hover:shadow-luxe transition-all duration-700"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--gradient-warm)]">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-110"
                />
                <span className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] tracking-widest uppercase">
                  {p.tag}
                </span>
                <button
                  aria-label={`Add ${p.name} to cart`}
                  className="absolute bottom-4 right-4 size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-luxe translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-ink"
                >
                  <Plus className="size-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-2xl">{p.name}</h3>
                  <span className="text-base">${p.price}</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground tracking-wide">{p.ingredients}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-accent text-accent" />
                  ))}
                  <span className="ml-1">{p.rating} · 1.2k reviews</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
