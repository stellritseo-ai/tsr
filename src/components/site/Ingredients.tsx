import aloe from "@/assets/ing-aloe.jpg";
import shea from "@/assets/ing-shea.jpg";
import rosemary from "@/assets/ing-rosemary.jpg";
import avocado from "@/assets/ing-avocado.jpg";
import vite from "@/assets/ing-vitamin-e.jpg";
import argan from "@/assets/ing-argan.jpg";

const ingredients = [
  { name: "Aloe Vera", img: aloe, benefit: "Deep hydration & calm", note: "Cold-extracted gel" },
  { name: "Shea Butter", img: shea, benefit: "Restores skin barrier", note: "Unrefined, raw" },
  { name: "Rosemary Oil", img: rosemary, benefit: "Stimulates roots", note: "Wild-harvested" },
  { name: "Avocado Oil", img: avocado, benefit: "Softens & nourishes", note: "First cold press" },
  { name: "Vitamin E", img: vite, benefit: "Antioxidant shield", note: "Plant-derived" },
  { name: "Argan Oil", img: argan, benefit: "Smooths & strengthens", note: "Moroccan sourced" },
];

export function Ingredients() {
  return (
    <section id="ingredients" className="relative py-28 px-6 bg-secondary/40 overflow-hidden">
      <div className="blur-blob bg-[oklch(0.85_0.08_75)] -top-20 right-10 size-[500px] opacity-50" />
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] uppercase text-accent">Hero Ingredients</span>
          <h2 className="mt-3 font-display text-5xl md:text-6xl text-balance">
            Six botanicals. <em className="not-italic text-gradient-gold">Endless rituals.</em>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Each ingredient is sourced for purity, potency, and the visible difference it makes on skin and hair.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredients.map((i) => (
            <article
              key={i.name}
              className="group relative rounded-3xl glass p-6 transition-all duration-700 hover:-translate-y-1 hover:shadow-luxe overflow-hidden"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <img
                  src={i.img}
                  alt={i.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl">{i.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{i.benefit}</p>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-accent shrink-0 mt-1">{i.note}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
