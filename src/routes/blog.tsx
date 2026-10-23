import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Newsletter } from "@/components/site/Newsletter";
import { Sparkles, Loader2 } from "lucide-react";
import heroImg from "@/assets/probg.jpg";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Journal & Blog | TSR Skin & Hair Care — Natural Rituals & Guides" },
      {
        name: "description",
        content:
          "Explore the TSR Journal for healthy hair routines, natural botanical ingredients, and holistic self-care rituals.",
      },
      { property: "og:title", content: "TSR Journal — Botanical Rituals & Wellness" },
      {
        property: "og:description",
        content: "Expert hair wellness guides and holistic rituals crafted for radiant beauty.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
});

function BlogPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const scriptId = "soro-blog-embed-script";

    // Remove any previous instance of the script so it re-executes cleanly on route visit
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://app.trysoro.com/api/embed/70b6143f-2cf8-4526-9f6d-d405ce392a28";
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setScriptLoaded(true);

    document.body.appendChild(script);

    // Failsafe timer so loading placeholder doesn't linger indefinitely
    const timer = setTimeout(() => {
      setScriptLoaded(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      const s = document.getElementById(scriptId);
      if (s) {
        s.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-foreground selection:bg-accent/20">
      <Nav onCartOpen={() => setCartOpen(true)} />

      <main className="overflow-hidden">
        {/* LUXURY HERO HEADER */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-6 text-center overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 -z-10">
            <img
              src={heroImg}
              alt="TSR Journal Header"
              className="size-full object-cover opacity-15 filter blur-[1px] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FDFCF9]/60 to-[#FDFCF9]" />
          </div>

          <div className="mx-auto max-w-4xl relative z-10 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium tracking-widest uppercase mb-6">
              <Sparkles className="size-3.5" />
              <span>TSR Journal & Stories</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground font-normal tracking-tight text-balance">
              Rituals, Hair Care & <span className="italic font-serif text-accent">Wellness</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto font-light leading-relaxed">
              Explore insightful guides, botanical ingredient spotlights, and timeless rituals designed to nurture healthy hair and glowing skin.
            </p>
          </div>
        </section>

        {/* SORO BLOG EMBED CONTAINER */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {!scriptLoaded && (
            <div className="flex flex-col items-center justify-center py-24 text-foreground/50 gap-4">
              <Loader2 className="size-8 animate-spin text-accent" />
              <p className="text-sm font-sans tracking-wide">Loading journal articles...</p>
            </div>
          )}

          {/* The required Soro blog embed container */}
          <div id="soro-blog" className="min-h-[500px] w-full" />
        </section>

        {/* NEWSLETTER SECTION */}
        <Newsletter />
      </main>

      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
