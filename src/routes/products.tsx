import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { ArrowRight, Leaf, Sparkles, Star, CheckCircle2, Search, SlidersHorizontal, ShoppingBag } from "lucide-react";
import { products, Product } from "@/data/products";
import { useCart } from "@/store/cartStore";
import { getProducts } from "@/lib/serverFunctions";

// Images for hero
import heroImg from "@/assets/Hair-Butter1.jpg";
import aloeSheaImg from "@/assets/Aloe-Shea.jpg";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [{ title: "Collection | TSR Skin & Hair Care — Luxury Botanical Hair Care" }],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
});

function ProductsPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [liveProducts, setLiveProducts] = useState<Product[]>(products);

  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        const data = await getProducts();
        if (data && Array.isArray(data) && data.length > 0) {
          setLiveProducts(data as Product[]);
        }
      } catch (err) {
        console.error("Failed to load live products, falling back to static:", err);
      }
    };
    fetchLiveProducts();
  }, []);

  const categories = ["all", "hair", "skin", "bundles", "men"];

  const filteredProducts = useMemo(() => {
    return liveProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [liveProducts, searchQuery, activeCategory]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-foreground selection:bg-accent/20 selection:text-white">
      <Nav onCartOpen={() => setCartOpen(true)} />

      <main className="overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative min-h-[70vh] flex items-center justify-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={heroImg}
              alt="Luxury Collection"
              className="size-full object-cover scale-105 animate-slow-zoom opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCF9]/50 via-transparent to-[#FDFCF9]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center px-6 animate-fade-up">
            <span className="inline-block text-[10px] tracking-[0.5em] uppercase text-accent mb-6 font-medium">
              The Collection
            </span>
            <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-[1.1] mb-8">
              Luxury Botanical <br />
              <em className="italic font-normal">Self‑Care Rituals</em>
            </h1>
            <div className="flex flex-col items-center gap-6">
              <div className="h-[1px] w-24 bg-accent/40" />
              <p className="max-w-2xl font-serif text-lg text-muted-foreground leading-relaxed italic">
                A premium collection crafted to nourish, strengthen, and restore through luxurious botanical everyday rituals.
              </p>
            </div>
          </div>
        </section>

        {/* FILTER & SEARCH SECTION */}
        <section className="sticky top-20 z-40 bg-[#FDFCF9]/80 backdrop-blur-md border-y border-border/40 py-6 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] tracking-[0.2em] uppercase transition-all ${
                    activeCategory === cat 
                      ? "bg-ink text-white shadow-soft" 
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <input 
                type="text"
                placeholder="Search ritual..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/30 border border-transparent focus:border-accent/30 rounded-full py-3 pl-12 pr-6 text-sm outline-none transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </section>

        {/* COLLECTION GRID */}
        <section id="collection" className="py-24 px-6 bg-[#FDFCF9]">
          <div className="max-w-7xl mx-auto">
            {filteredProducts.length === 0 ? (
              <div className="py-40 text-center space-y-6">
                <div className="size-20 rounded-full bg-secondary mx-auto flex items-center justify-center">
                  <Search className="size-8 text-muted-foreground/40" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-3xl">No rituals found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
                </div>
                <button 
                  onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                  className="text-xs tracking-widest uppercase font-bold text-accent hover:text-ink transition underline underline-offset-8"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-32">
                {filteredProducts.map((product, i) => (
                  <div key={product.id} className={`flex flex-col lg:flex-row gap-16 items-center animate-fade-up [animation-delay:${i * 100}ms]`}>
                    {/* IMAGE - LEFT SIDE */}
                    <div className="relative shrink-0 w-full lg:w-[500px] h-[500px] rounded-3xl overflow-hidden shadow-soft transition-all duration-700 group hover:shadow-luxe">
                      <img src={product.image} alt={product.name} className="size-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="glass px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-ink/80 backdrop-blur-md">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT - RIGHT SIDE */}
                    <div className="flex-1 space-y-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-baseline border-b border-border/40 pb-6">
                          <h3 className="font-display text-4xl md:text-5xl">{product.name}</h3>
                          <span className="font-display text-3xl text-accent">${product.price}</span>
                        </div>

                        <p className="font-serif text-muted-foreground leading-relaxed italic text-xl">
                          {product.description}
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] tracking-[0.25em] uppercase text-accent font-medium">
                          {(product.ingredients || product.includes || []).map((item, idx) => (
                            <span key={idx} className="flex items-center gap-2">
                              <Sparkles className="size-3.5 opacity-50" />
                              {item}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {product.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-4 text-base text-foreground/70">
                              <div className="size-2 rounded-full bg-accent/30" />
                              {benefit}
                            </div>
                          ))}
                        </div>

                        <div className="pt-8 flex items-center gap-6">
                          <button 
                            onClick={() => handleAddToCart(product)}
                            className="bg-ink text-white px-10 py-5 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-accent transition-all duration-500 shadow-luxe flex items-center gap-3"
                          >
                            <ShoppingBag className="size-4" />
                            Add To Ritual
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RELATED PRODUCTS / YOU MAY ALSO LIKE */}
        <section className="py-32 px-6 bg-secondary/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-16">
              <h2 className="font-display text-4xl">Recommended Rituals</h2>
              <div className="h-px flex-1 mx-12 bg-border/40 hidden md:block" />
              <button className="text-[10px] tracking-[0.4em] uppercase font-bold text-accent">View All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {liveProducts.slice(0, 3).map((p) => (
                <div key={p.id} className="group space-y-6">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-soft">
                    <img src={p.image} alt={p.name} className="size-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-display text-2xl">{p.name}</h3>
                      <span className="text-accent">${p.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 italic font-serif">{p.description}</p>
                    <button 
                      onClick={() => handleAddToCart(p)}
                      className="text-[10px] tracking-[0.3em] uppercase font-bold pt-4 hover:text-accent transition-colors flex items-center gap-2"
                    >
                      Quick Add <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INGREDIENT STORY SECTION */}
        <section className="py-32 px-6 bg-ink text-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/4" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-12 gap-20 items-center">
              <div className="lg:col-span-6 space-y-10">
                <div className="space-y-4">
                  <span className="text-[10px] tracking-[0.4em] uppercase text-accent">The Source</span>
                  <h2 className="font-display text-5xl md:text-7xl">Powered By Botanical Ingredients</h2>
                  <p className="font-serif text-lg text-white/60 leading-relaxed italic">
                    Every TSR™ formula is enriched with carefully selected botanical ingredients inspired by luxurious beauty rituals and nourishing self-care traditions.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {[
                    "Rosemary", "Castor Oil", "Aloe Vera",
                    "Shea Butter", "Mango Oil", "Vitamin E",
                    "Argan Oil", "Peppermint", "Batana Oil"
                  ].map((ing, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <div className="h-[1px] w-4 bg-accent/40 group-hover:w-8 transition-all duration-500" />
                      <span className="text-xs tracking-widest text-white/80 group-hover:text-white">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img src={aloeSheaImg} alt="Botanical Ingredients" className="size-full object-cover" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-out infinite alternate;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
