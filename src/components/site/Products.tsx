import { Star, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/store/cartStore";
import { products as staticProducts, Product } from "@/data/products";
import { getProducts } from "@/lib/serverFunctions";
import { Link } from "@tanstack/react-router";

export function Products({ onAddToCart }: { onAddToCart?: () => void } = {}) {
  const { addItem } = useCart();
  const [liveProducts, setLiveProducts] = useState<Product[]>(staticProducts);

  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        const data = await getProducts();
        if (data && Array.isArray(data) && data.length > 0) {
          const resolved = data.map((p: any) => {
            const staticMatch = staticProducts.find((sp) => sp.id === p.id);
            const resolvedImg = staticMatch && (!p.image || p.image.startsWith('/src/assets/')) ? staticMatch.image : p.image;
            const isBook = p.category === 'books';
            if (p.price >= 20 && !isBook) {
              return {
                ...p,
                image: resolvedImg,
                originalPrice: p.price,
                price: Math.round((p.price * 0.5) * 100) / 100
              };
            }
            return {
              ...p,
              image: resolvedImg
            };
          });
          setLiveProducts(resolved as Product[]);
        }
      } catch (err) {
        console.error("Failed to load live products, falling back to static:", err);
      }
    };
    fetchLiveProducts();
  }, []);

  const handleAddToCart = (p: Product) => {
    addItem(p);
    if (onAddToCart) onAddToCart();
  };

  const getProductDetails = (product: Product) => {
    switch (product.id) {
      case "oil":
        return { rating: 4.9, tag: "Bestseller" };
      case "spray":
        return { rating: 4.8, tag: "New" };
      case "butter":
        return { rating: 4.9, tag: "Restock" };
      case "aloe-bar":
        return { rating: 4.7, tag: "Editor's Pick" };
      default:
        return { rating: 4.8, tag: product.category };
    }
  };

  const renderProductCard = (p: Product, idx: number) => {
    const details = getProductDetails(p);
    const ingredientsStr = p.ingredients ? p.ingredients.join(" · ") : (p.includes ? p.includes.join(" · ") : "");

    return (
      <article
        key={`${p.id}-${idx}`}
        className="shrink-0 w-[280px] sm:w-[310px] group relative rounded-3xl overflow-hidden bg-card border border-border/60 hover:shadow-luxe transition-all duration-700 font-sans"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--gradient-warm)]">
          <Link to="/product/$productId" params={{ productId: p.id }} className="block size-full cursor-pointer">
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-110"
            />
          </Link>
          <span className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] tracking-widest uppercase text-ink font-semibold">
            {details.tag}
          </span>
          <button
            onClick={() => handleAddToCart(p)}
            aria-label={`Add ${p.name} to cart`}
            className="absolute bottom-4 right-4 size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-luxe translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-ink z-10 cursor-pointer border-none"
          >
            <Plus className="size-5" />
          </button>
        </div>
        <div className="p-6 text-left">
          <div className="flex items-center justify-between gap-4">
            <Link to="/product/$productId" params={{ productId: p.id }} className="hover:text-accent transition-colors no-underline block truncate">
              <h3 className="font-display text-xl sm:text-2xl truncate">{p.name}</h3>
            </Link>
            {p.originalPrice ? (
              <div className="text-right shrink-0">
                <span className="text-xs line-through text-muted-foreground/60 mr-2">${p.originalPrice.toFixed(2)}</span>
                <span className="text-base font-bold text-gold">${p.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-base font-bold text-accent shrink-0">${p.price}</span>
            )}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground tracking-wide truncate">{ingredientsStr}</p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3 fill-accent text-accent" />
            ))}
            <span className="ml-1">{details.rating} · 1.2k reviews</span>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section id="products" className="relative py-28 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-accent">The Collection</span>
            <h2 className="mt-3 font-display text-5xl md:text-6xl max-w-2xl text-balance">
              Rituals crafted for visible results.
            </h2>
          </div>
          <a href="/products" className="text-sm story-link">View All Products →</a>
        </div>

        <div className="overflow-hidden w-full relative">
          <div className="marquee-track">
            <div className="marquee-list">
              {liveProducts.map((p, idx) => renderProductCard(p, idx))}
            </div>
            <div className="marquee-list" aria-hidden="true">
              {liveProducts.map((p, idx) => renderProductCard(p, idx + liveProducts.length))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 35s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-list {
          display: flex;
          gap: 24px;
          padding-right: 24px;
          flex-shrink: 0;
        }
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
