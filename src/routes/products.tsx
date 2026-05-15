import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { ArrowRight, Leaf, Heart, Sparkles, Droplets, Star, Shield, Wind, CheckCircle2 } from "lucide-react";

// Images
import heroImg from "@/assets/Hair-Butter1.jpg";
import oilImg from "@/assets/product-growth-oil.jpg";
import sprayImg from "@/assets/Hydrating-Spray.jpg";
import butterImg from "@/assets/Hair-Butter-v2.jpg";
import bundleImg from "@/assets/3-Step-Hair-Growth.jpg";
import ingredientsImg from "@/assets/Goat-Milk.jpg";
import aloeSheaImg from "@/assets/Aloe-Shea.jpg";
import charcoalImg from "@/assets/Charcoal-Detox.jpg";
import lotionImg from "@/assets/Rosemary.jpg";
import menButterImg from "@/assets/Men’s-Repair-Hair.jpg";
import soapBundleImg from "@/assets/3-shop.jpg";
import menSprayImg from "@/assets/Leave-In-Hydrating.jpg";
import menOilImg from "@/assets/Men’s-Bald-Spot.jpg";



export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [{ title: "Collection | TSR Beauty — Luxury Botanical Hair Care" }],
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

  const products = [
    {
      id: "oil",
      name: "TSR™ Growth Oil",
      price: "$19.99",
      description: "A nutrient-rich botanical oil blend designed to nourish the scalp, strengthen roots, reduce breakage, and support healthier-looking hair growth while adding softness and shine.",
      ingredients: ["Castor Oil", "Rosemary Oil", "Argan Oil", "Vitamin E"],
      benefits: ["Helps reduce breakage", "Nourishes scalp", "Adds softness", "Supports healthier-looking hair"],
      image: oilImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "spray",
      name: "TSR™ Hydrating Spray",
      price: "$16.99",
      description: "A lightweight moisture mist formulated to hydrate dry hair, soften texture, refresh curls, and revitalize the scalp throughout the day.",
      ingredients: ["Aloe Vera", "Peppermint", "Vitamin E", "Glycerin"],
      benefits: ["Lightweight hydration", "Refreshes hair", "Softens strands", "Revitalizes scalp"],
      image: sprayImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "butter",
      name: "TSR™ Hair Butter",
      price: "$24.99",
      description: "A rich botanical butter crafted to deeply nourish strands, seal in moisture, soften texture, protect ends, and support fuller-looking healthy hair.",
      ingredients: ["Shea Butter", "Mango Oil", "Batana Oil", "Vitamin E"],
      benefits: ["Deep moisture", "Protects ends", "Softens texture", "Enhances fullness"],
      image: butterImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "bundle",
      name: "TSR™ 3-Step Hair Growth Bundle",
      price: "$49.99",
      description: "A complete luxury botanical hair ritual featuring Growth Oil, Hydrating Spray, and Hair Butter designed to hydrate, strengthen, nourish, and protect hair in one premium system.",
      includes: ["Growth Oil", "Hydrating Spray", "Hair Butter"],
      benefits: ["Complete hair ritual", "Moisture + nourishment", "Strength support", "Fuller-looking hair"],
      image: bundleImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "lotion",
      name: "TSR™ Rosemary & Clove Lotion",
      price: "$13.99",
      description: "A nourishing botanical lotion designed to hydrate skin deeply while leaving it soft, smooth, refreshed, and lightly scented with luxurious rosemary and clove notes.",
      ingredients: ["Rosemary", "Clove", "Shea Butter", "Vitamin E"],
      benefits: ["Deep hydration", "Smooth texture", "Lightweight moisture", "Luxurious finish"],
      image: lotionImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "aloe-bar",
      name: "TSR™ Aloe Shea Moisturizing Bar",
      price: "$9.99",
      description: "A moisturizing cleansing bar enriched with aloe and shea butter to gently cleanse while helping maintain soft, hydrated skin.",
      ingredients: ["Aloe Vera", "Shea Butter", "Botanical Oils"],
      benefits: ["Gentle cleansing", "Moisturizing care", "Soft skin finish", "Everyday luxury cleansing"],
      image: aloeSheaImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "charcoal-bar",
      name: "TSR™ Charcoal Detox Bar",
      price: "$10.99",
      description: "A detoxifying charcoal cleansing bar designed to deeply cleanse impurities while refreshing and revitalizing the skin.",
      ingredients: ["Activated Charcoal", "Essential Oils", "Botanical Base"],
      benefits: ["Detoxifying cleanse", "Removes impurities", "Refreshes skin", "Clean luxury feel"],
      image: charcoalImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "goat-milk-bar",
      name: "TSR™ Goat Milk Honey Bar",
      price: "$11.99",
      description: "A creamy goat milk and honey cleansing bar crafted to nourish and soften skin while delivering a luxurious bathing experience.",
      ingredients: ["Goat Milk", "Honey", "Nourishing Oils"],
      benefits: ["Nourishing cleanse", "Soft smooth skin", "Rich creamy lather", "Luxury moisture care"],
      image: ingredientsImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "soap-bundle",
      name: "TSR™ 3 Soap Bundle",
      price: "$27.99",
      description: "A premium bundle featuring the complete TSR™ luxury soap collection designed to cleanse, hydrate, soften, and refresh skin.",
      includes: ["Aloe Shea Bar", "Charcoal Detox Bar", "Goat Milk Honey Bar"],
      benefits: ["Complete skin ritual", "Diverse cleansing", "Hydration + Detox", "Luxury gift set"],
      image: soapBundleImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "men-butter",
      name: "TSR™ Men’s Repair Hair Butter",
      price: "$29.99",
      description: "A rich restorative hair butter designed specifically for men to deeply moisturize, soften texture, nourish dry hair, and support healthier-looking hair.",
      ingredients: ["Botanical Butters", "Growth Oils", "Vitamin E"],
      benefits: ["Deep moisture", "Texture softening", "Nourishes hair", "Helps reduce dryness"],
      image: menButterImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "men-spray",
      name: "TSR™ Leave-In Hydrating Spray",
      price: "$19.99",
      description: "A lightweight leave-in hydration spray designed for men to refresh hair, add moisture, soften texture, and support daily hair maintenance.",
      ingredients: ["Aloe Vera", "Hydration Complex", "Mint"],
      benefits: ["Lightweight moisture", "Refreshes hair", "Daily hydration", "Soft texture support"],
      image: menSprayImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "men-oil",
      name: "TSR™ Men’s Bald Spot Restore Oil",
      price: "$27.99",
      description: "A concentrated botanical oil blend crafted to nourish the scalp and support healthier-looking hair in thinning or sparse areas.",
      ingredients: ["Restorative Oils", "Botanical Extracts", "Biotin"],
      benefits: ["Nourishes scalp", "Supports fuller appearance", "Adds shine", "Lightweight oil care"],
      image: menOilImg,
      cta: "Order Now",
      link: "/contact"
    },
    {
      id: "men-bundle",
      name: "TSR™ Men’s Restoration System Bundle",
      price: "$64.99",
      description: "A complete men’s hair restoration ritual featuring premium hydration, moisture, and scalp care products designed to support healthier-looking hair.",
      includes: ["Repair Hair Butter", "Leave-In Spray", "Bald Spot Oil"],
      benefits: ["Full restoration system", "Complete men's ritual", "Moisture + Growth Support", "Premium hair care"],
      image: bundleImg,
      cta: "Order Now",
      link: "/contact"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-foreground selection:bg-accent/20 selection:text-white">
      <Nav onCartOpen={() => setCartOpen(true)} />

      <main className="overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={heroImg}
              alt="Luxury Collection"
              className="size-full object-cover scale-105 animate-slow-zoom opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCF9]/30 via-transparent to-[#FDFCF9]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center px-6 animate-fade-up">
            <span className="inline-block text-[10px] tracking-[0.5em] uppercase text-accent mb-6 font-medium">
              The Collection
            </span>
            <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[1.1] mb-8">
              Luxury Botanical <br />
              <em className="italic font-normal">Hair Care Collection</em>
            </h1>
            <div className="flex flex-col items-center gap-6">
              <div className="h-[1px] w-24 bg-accent/40" />
              <p className="text-sm tracking-[0.3em] uppercase text-foreground/60">Repair • Restore • Regrow</p>
              <p className="max-w-2xl font-serif text-lg md:text-xl text-muted-foreground leading-relaxed italic">
                A premium botanical hair care collection crafted to nourish the scalp, strengthen strands, hydrate deeply, and support healthier-looking hair through luxurious everyday rituals.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href="#collection" className="bg-ink text-white px-10 py-5 rounded-full text-[10px] tracking-[0.3em] uppercase font-medium hover:bg-accent transition-all duration-500 shadow-luxe">
                  Explore Collection
                </a>
                <a href="/story" className="bg-white/40 backdrop-blur-md border border-white/50 px-10 py-5 rounded-full text-[10px] tracking-[0.3em] uppercase font-medium hover:bg-white transition-all duration-500">
                  Discover Our Story
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED COLLECTION SECTION */}
        <section id="collection" className="py-32 px-6 bg-[#FDFCF9]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 max-w-3xl mx-auto">
              <span className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4 block">TSR™ COLLECTION</span>
              <h2 className="font-display text-5xl md:text-6xl mb-8">The Complete Luxury Hair Ritual</h2>
              <p className="font-serif text-lg text-muted-foreground italic leading-relaxed">
                Carefully crafted botanical formulas designed to hydrate, nourish, strengthen, soften, and protect hair while elevating your daily self-care routine.
              </p>
            </div>

            <div className="flex flex-col gap-32">
              {products.map((product, i) => (
                <div key={product.id} className={`flex flex-col lg:flex-row gap-16 items-center animate-fade-up [animation-delay:${i * 100}ms]`}>
                  {/* IMAGE - LEFT SIDE (500x500) */}
                  <div className="relative shrink-0 w-full lg:w-[500px] h-[500px] rounded-3xl overflow-hidden shadow-soft transition-all duration-700 group hover:shadow-luxe">
                    <img src={product.image} alt={product.name} className="size-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/20 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-white text-[10px] tracking-[0.4em] uppercase">Premium Care</span>
                    </div>
                  </div>

                  {/* CONTENT - RIGHT SIDE */}
                  <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline border-b border-border/40 pb-6">
                        <h3 className="font-display text-4xl md:text-5xl">{product.name}</h3>
                        <span className="font-display text-3xl text-accent">{product.price}</span>
                      </div>

                      <p className="font-serif text-muted-foreground leading-relaxed italic text-xl">
                        {product.description}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] tracking-[0.25em] uppercase text-accent font-medium">
                        {(product.ingredients || product.includes).map((item, idx) => (
                          <span key={idx} className="flex items-center gap-2">
                            <Sparkles className="size-3.5 opacity-50" />
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {product.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-4 text-base text-foreground/70">
                            <CheckCircle2 className="size-5 text-accent/60 shrink-0" />
                            {benefit}
                          </div>
                        ))}
                      </div>

                      <div className="pt-8">
                        {product.link ? (
                          <Link
                            to={product.link}
                            className="inline-flex items-center gap-5 text-[11px] tracking-[0.4em] uppercase font-bold text-ink hover:text-accent transition-all group/btn border-b border-ink/20 pb-2 hover:border-accent"
                          >
                            {product.cta}
                            <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-3" />
                          </Link>
                        ) : (
                          <button className="inline-flex items-center gap-5 text-[11px] tracking-[0.4em] uppercase font-bold text-ink hover:text-accent transition-all group/btn border-b border-ink/20 pb-2 hover:border-accent">
                            {product.cta}
                            <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-3" />
                          </button>
                        )}
                      </div>
                    </div>
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

        {/* PRODUCT EXPERIENCE SECTION */}
        <section className="py-32 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="font-display text-5xl md:text-6xl mb-6">Elevated Everyday Self‑Care</h2>
              <p className="font-serif text-lg text-muted-foreground italic">
                TSR™ transforms daily hair care into a luxurious ritual through premium textures and botanical nourishment.
              </p>
            </div>

            <div className="relative h-[70vh] rounded-3xl overflow-hidden shadow-luxe group">
              <img src={aloeSheaImg} alt="Luxury Experience" className="size-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                <div className="max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-12 rounded-2xl animate-fade-in">
                  <p className="font-display text-3xl md:text-4xl text-white leading-relaxed">
                    "A ritual crafted for those who seek the intersection of <em className="italic">nature and elegance</em>."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL SECTION */}
        <section className="py-32 px-6 bg-[#FDFCF9] border-y border-border/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { quote: "My hair feels softer, healthier, and visibly fuller.", author: "Elena R." },
                { quote: "The hydration spray became part of my daily routine instantly.", author: "Marcus T." },
                { quote: "The Hair Butter keeps my curls moisturized without heaviness.", author: "Sarah L." }
              ].map((t, i) => (
                <div key={i} className={`glass p-12 rounded-3xl border-white/50 space-y-8 animate-fade-up [animation-delay:${i * 200}ms]`}>
                  <div className="flex gap-1 text-accent">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="size-3 fill-current" />)}
                  </div>
                  <p className="font-display text-2xl leading-relaxed italic text-foreground/80">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] w-8 bg-accent/40" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{t.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-40 px-6 bg-ink text-white relative overflow-hidden text-center">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className="max-w-4xl mx-auto space-y-12 animate-fade-up">
            <h2 className="font-display text-5xl md:text-7xl">Begin Your Luxury <br />Hair Ritual</h2>
            <p className="font-serif text-xl text-white/60 italic max-w-2xl mx-auto">
              Discover premium botanical care crafted to nourish, hydrate, restore, and elevate healthier-looking hair through luxurious daily rituals.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <a href="#collection" className="bg-white text-ink px-12 py-5 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-accent hover:text-white transition-all duration-500">
                Explore Collection
              </a>
              <a href="/story" className="border border-white/20 px-12 py-5 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-white hover:text-ink transition-all duration-500">
                Discover Our Story
              </a>
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
      `}</style>
    </div>
  );
}
