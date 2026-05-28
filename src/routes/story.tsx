import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { ArrowRight, Leaf, Shield, Heart, Sparkles, Droplets, Wind, Star } from "lucide-react";

// Images
import heroImg from "@/assets/probg.jpg";
import founderImg from "@/assets/books.png";
import ingredientsImg from "@/assets/ingredients-comp.png";
import experienceImg from "@/assets/experience.png";

export const Route = createFileRoute("/story")({
  component: StoryPage,
  head: () => ({
    meta: [{ title: "Our Story | TSR Skin & Hair Care — Elevated Self‑Care" }],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
});

function StoryPage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-foreground selection:bg-accent/20">
      <Nav onCartOpen={() => setCartOpen(true)} />

      <main className="overflow-hidden">
        {/* LUXURY HERO BANNER */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImg}
              alt="Luxury Beauty Hero"
              className="size-full object-cover scale-105 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FDFCF9]/20 to-[#FDFCF9]" />
          </div>

          <div className="relative z-10 text-center px-6 animate-fade-up">
            <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-foreground/60 mb-6 opacity-0 animate-fade-in [animation-delay:400ms]">
              Our Essence
            </span>
            <h1 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-tight max-w-4xl mx-auto text-balance">
              Crafted for Healthy Hair & <br className="hidden md:block" />
              <em className="italic font-normal">Timeless Beauty</em>
            </h1>
            <p className="mt-8 font-serif italic text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in [animation-delay:800ms]">
              TSR™ Skin & Hair Care blends luxurious botanical ingredients with modern beauty rituals to create premium products designed to nourish, restore, and elevate everyday self‑care.
            </p>
          </div>
        </section>

        {/* LUXURY INTRO TEXT */}
        <section className="py-24 px-6 bg-[#FDFCF9]">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground/80 tracking-tight">
              More than beauty products — <span className="text-foreground font-semibold">TSR™</span> is a commitment to confidence, wellness, and intentional care. Every formula is thoughtfully created to support stronger, healthier‑looking hair and deeply nourished skin using rich botanical ingredients inspired by nature and luxury skincare traditions.
            </p>
          </div>
        </section>

        {/* OUR STORY EDITORIAL SECTION */}
        <section className="py-32 px-6 border-y border-border/40 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src={founderImg}
                  alt="TSR Founder"
                  className="size-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
              </div>
              <div className="space-y-8">
                <div className="inline-block w-12 h-[1px] bg-accent/40 mb-2" />
                <h2 className="font-display text-5xl md:text-6xl">Our Story</h2>
                <div className="space-y-6 text-muted-foreground leading-loose font-serif text-lg">
                  <p>
                    TSR™ Skin & Hair Care was founded with a simple vision: to create luxurious products that help people feel confident in their natural beauty.
                  </p>
                  <p>
                    Inspired by real experiences with dryness, thinning hair, breakage, and sensitive skin, TSR™ was created to offer a premium self‑care experience built around nourishment, hydration, and restoration.
                  </p>
                  <p>
                    We believe beauty should feel elegant, intentional, and empowering. That’s why every product is carefully formulated using botanical ingredients known for their moisturizing, strengthening, and restorative properties.
                  </p>
                  <p>
                    From rich hair butters to lightweight hydrating sprays and luxurious body care essentials, TSR™ products are designed to transform daily routines into moments of confidence and care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRAND PHILOSOPHY SECTION */}
        <section className="py-32 px-6 bg-ink text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <span className="text-[10px] tracking-[0.4em] uppercase text-white/40">The Ethos</span>
              <h2 className="mt-6 font-display text-5xl md:text-7xl">Our Philosophy</h2>
              <div className="mt-8 flex items-center justify-center gap-4 text-accent font-display text-2xl italic">
                <span>Repair</span>
                <span className="size-1 rounded-full bg-accent/40" />
                <span>Restore</span>
                <span className="size-1 rounded-full bg-accent/40" />
                <span>Regrow</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-start">
              <p className="text-xl text-white/80 leading-relaxed font-serif">
                At TSR™, we believe healthy beauty begins with consistency, nourishment, and quality ingredients. Our philosophy focuses on creating products that support the natural lifecycle of your skin and hair.
              </p>
              <ul className="grid grid-cols-1 gap-6">
                {[
                  "Deep hydration",
                  "Scalp nourishment",
                  "Moisture retention",
                  "Hair strength and softness",
                  "Healthy-looking skin",
                  "Everyday luxury self-care"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <span className="size-8 rounded-full border border-accent/30 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                      <Sparkles className="size-3 text-accent" />
                    </span>
                    <span className="text-lg text-white/90 tracking-wide">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* BOTANICAL INGREDIENTS SHOWCASE */}
        <section className="py-32 px-6 bg-[#FDFCF9]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 space-y-8">
                <span className="text-[10px] tracking-[0.4em] uppercase text-accent">Pure Potency</span>
                <h2 className="font-display text-5xl md:text-6xl">Powered by Botanical Ingredients</h2>
                <p className="text-muted-foreground font-serif text-lg leading-relaxed">
                  Every TSR™ formula is enriched with carefully selected ingredients known for their nourishing and restorative benefits. We source with intention and formulate for results.
                </p>
              </div>
              <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img src={ingredientsImg} alt="Botanical Composition" className="size-full object-cover" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: "Rosemary Oil", desc: "Helps support healthier-looking hair and scalp care" },
                    { name: "Shea Butter", desc: "Deeply moisturizes and softens" },
                    { name: "Aloe Vera", desc: "Hydrates and refreshes" }
                  ].map((ing, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border-white/40">
                      <h4 className="font-display text-xl mb-1">{ing.name}</h4>
                      <p className="text-xs text-muted-foreground tracking-wide uppercase">{ing.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Castor Oil", desc: "Helps support moisture retention" },
                { name: "Argan Oil", desc: "Adds softness and shine" },
                { name: "Vitamin E", desc: "Rich antioxidant nourishment" },
                { name: "Clove Extract", desc: "Botanical care with refreshing properties" }
              ].map((ing, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-border/40 text-center hover:border-accent/40 transition-colors">
                  <h4 className="font-display text-lg mb-2">{ing.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ing.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LUXURY EXPERIENCE SECTION */}
        <section className="relative py-40 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={experienceImg} alt="Luxury Texture" className="size-full object-cover" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            <h2 className="font-display text-5xl md:text-7xl mb-8">Elevated Self‑Care</h2>
            <div className="space-y-6 font-serif text-xl leading-relaxed opacity-90">
              <p>
                TSR™ Skin & Hair Care is designed to bring a luxury beauty experience into everyday routines.
              </p>
              <p>
                From elegant packaging to rich textures and sophisticated fragrances, every detail is created to feel premium, calming, and indulgent.
              </p>
              <p>
                Our collections are inspired by modern luxury skincare, spa rituals, and high-end beauty aesthetics that prioritize both beauty and wellness.
              </p>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE TSR SECTION */}
        <section className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4 block">The Distinction</span>
              <h2 className="font-display text-5xl">Why Customers Love TSR™</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                {
                  title: "Premium Botanical Formulas",
                  text: "Luxurious ingredients selected to nourish hair and skin naturally.",
                  icon: Leaf
                },
                {
                  title: "Luxury Beauty Experience",
                  text: "Elegant textures, premium packaging, and sophisticated branding.",
                  icon: Sparkles
                },
                {
                  title: "Hydration & Restoration",
                  text: "Products designed to support moisture, softness, and healthier-looking beauty.",
                  icon: Droplets
                },
                {
                  title: "Crafted With Care",
                  text: "Every formula is created with attention to quality, experience, and performance.",
                  icon: Heart
                }
              ].map((item, i) => (
                <div key={i} className="space-y-6 text-center group">
                  <div className="inline-flex size-16 items-center justify-center rounded-full bg-[#FDFCF9] border border-border/40 group-hover:border-accent/40 transition-all duration-500">
                    <item.icon className="size-6 text-accent" />
                  </div>
                  <h3 className="font-display text-2xl">{item.title}</h3>
                  <p className="text-muted-foreground font-serif text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-24 px-6 bg-[#1A1A1A] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-display text-4xl md:text-6xl text-white mb-8">Experience Luxury Botanical Care</h2>
            <p className="text-white/60 font-serif text-lg mb-12">
              Discover premium skincare and haircare designed to nourish, hydrate, and restore.
            </p>
            <a
              href="/products"
              className="inline-flex items-center gap-3 rounded-full bg-white text-ink px-10 py-5 text-sm tracking-[0.2em] uppercase font-medium hover:bg-accent hover:text-white transition-all duration-500 shadow-xl"
            >
              Explore The Collection
              <ArrowRight className="size-4" />
            </a>
          </div>
        </section>

        {/* ELEGANT CONTACT FOOTER */}
        <section className="py-24 px-6 bg-[#FDFCF9] border-t border-border/20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-end">
            <div className="space-y-8">
              <h2 className="font-display text-4xl">Contact TSR™ <br />Skin & Hair Care</h2>
              <div className="space-y-2 font-serif text-lg text-muted-foreground">
                <p>Orlando, FL 32835</p>
                <p>Phone: 407-694-8624</p>
              </div>
            </div>
            <div className="flex md:justify-end gap-12 text-[10px] tracking-[0.3em] uppercase text-foreground/40 font-medium">
              <a href="#" className="hover:text-accent transition-colors">Instagram</a>
              <a href="#" className="hover:text-accent transition-colors">Pinterest</a>
              <a href="#" className="hover:text-accent transition-colors">TikTok</a>
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
