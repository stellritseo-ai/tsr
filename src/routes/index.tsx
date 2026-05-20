import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Products } from "@/components/site/Products";
import { Story } from "@/components/site/Story";
import { Ingredients } from "@/components/site/Ingredients";
import { BestSellers } from "@/components/site/BestSellers";
import { Results } from "@/components/site/Results";
import { Testimonials } from "@/components/site/Testimonials";
import { Gallery } from "@/components/site/Gallery";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "TSR Beauty — Nature‑Powered Skin & Hair Care" },
      {
        name: "description",
        content:
          "Handcrafted skincare and haircare infused with botanical ingredients — aloe vera, shea butter, rosemary, argan and more.",
      },
      { property: "og:title", content: "TSR Beauty — Nature‑Powered Skin & Hair Care" },
      {
        property: "og:description",
        content: "Botanical rituals designed to nourish, hydrate, strengthen and restore.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
});

function Index() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav onCartOpen={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Marquee />
        <Products onAddToCart={() => setCartOpen(true)} />
        <Story />
        <Ingredients />
        <BestSellers />
        <Results />
        <Testimonials />
        <Gallery />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
