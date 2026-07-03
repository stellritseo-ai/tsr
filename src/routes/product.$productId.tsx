import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { useCart } from "@/store/cartStore";
import { products as staticProducts, Product } from "@/data/products";
import { getProducts } from "@/lib/serverFunctions";
import { Star, Plus, Minus, ShoppingBag, Sparkles, ShieldCheck, Truck, ArrowLeft, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/product/$productId")({
  component: ProductDetailPage,
  head: () => ({
    meta: [{ title: "Product Details | TSR Skin & Hair Care" }],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
});

const getProductImageSrc = (imgSrc?: string) => {
  if (!imgSrc) return "";
  if (imgSrc.startsWith("http://") || imgSrc.startsWith("https://") || imgSrc.startsWith("/")) {
    return imgSrc;
  }
  return `/${imgSrc}`;
};

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const [cartOpen, setCartOpen] = useState(false);
  const { state: cartState, addItem, updateQuantity } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"ingredients" | "benefits" | "shipping">("ingredients");
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        let resolvedProducts = staticProducts;
        if (data && Array.isArray(data) && data.length > 0) {
          resolvedProducts = data.map((p: any) => {
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
        }

        const found = resolvedProducts.find((p) => p.id === productId);
        if (found) {
          setProduct(found);
          document.title = `${found.name} | TSR Skin & Hair Care`;
          // Recommended products (excluding current one)
          const filtered = resolvedProducts.filter((p) => p.id !== productId);
          setRecommended(filtered.slice(0, 3));
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to load product data:", err);
        // Fallback to static products
        const found = staticProducts.find((p) => p.id === productId);
        if (found) {
          setProduct(found);
          const filtered = staticProducts.filter((p) => p.id !== productId);
          setRecommended(filtered.slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const existing = cartState.items.find(item => item.id === product.id);
    if (existing) {
      updateQuantity(product.id, existing.quantity + quantity);
    } else {
      addItem(product);
      if (quantity > 1) {
        updateQuantity(product.id, quantity);
      }
    }
    setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="size-10 animate-spin text-accent mx-auto" />
          <p className="font-serif italic text-muted-foreground">Opening collection cabinet...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] text-foreground flex flex-col justify-between">
        <Nav onCartOpen={() => setCartOpen(true)} />
        <main className="max-w-2xl mx-auto px-6 py-40 text-center space-y-6 font-sans">
          <h2 className="font-display text-4xl">Ritual Not Found</h2>
          <p className="text-muted-foreground font-serif italic">The botanical ritual you are looking for does not exist or has returned to the earth.</p>
          <Link
            to="/products"
            className="inline-block bg-ink text-white px-8 py-4 rounded-full text-xs tracking-widest uppercase font-semibold hover:bg-accent transition border-none cursor-pointer"
          >
            Explore The Collection
          </Link>
        </main>
        <Footer />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    );
  }

  const ingredientsList = product.ingredients || product.includes || [];

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-foreground selection:bg-accent/20 selection:text-white font-sans">
      <Nav onCartOpen={() => setCartOpen(true)} />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="mb-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-muted-foreground hover:text-ink transition"
          >
            <ArrowLeft className="size-4" /> Back to Collection
          </Link>
        </div>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Image Showcase Column */}
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-soft group">
            <img
              src={getProductImageSrc(product.image)}
              alt={product.name}
              className="size-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
            <div className="absolute top-6 left-6">
              <span className="glass px-4 py-2 rounded-full text-xs tracking-widest uppercase text-ink font-semibold">
                {product.category}
              </span>
            </div>
          </div>

          {/* Product Details Description Column */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1]">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                {/* Mock Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground tracking-wide font-medium">
                  4.9 · 1.2k Verified Reviews
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="border-y border-border/40 py-6 flex items-baseline gap-4">
              {product.originalPrice ? (
                <>
                  <span className="text-3xl font-display text-gold">${product.price.toFixed(2)}</span>
                  <span className="line-through text-muted-foreground/60 text-lg font-light">${product.originalPrice.toFixed(2)}</span>
                  <span className="glass px-2.5 py-1 rounded-full text-[9px] font-bold text-emerald-600 bg-emerald-50 tracking-wider uppercase ml-2">
                    50% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-display text-accent">${product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Product description statement */}
            <p className="font-serif text-lg text-muted-foreground leading-relaxed italic">
              {product.description}
            </p>

            {/* Quantity Selector and CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Quantity click counter */}
              <div className="flex items-center justify-between border border-border/80 rounded-full py-4 px-6 w-full sm:w-36 bg-card shrink-0">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-1 hover:text-accent transition cursor-pointer border-none bg-transparent"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <span className="font-semibold text-sm w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-1 hover:text-accent transition cursor-pointer border-none bg-transparent"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-ink text-white py-5 px-8 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:bg-accent hover:shadow-luxe transition-all duration-500 flex items-center justify-center gap-3 cursor-pointer border-none"
              >
                <ShoppingBag className="size-4" /> Add To Cart
              </button>
            </div>

            {/* Micro details / Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border/30">
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                <Truck className="size-5 text-accent/80 shrink-0" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                <ShieldCheck className="size-5 text-accent/80 shrink-0" />
                <span>100% Organic</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                <Sparkles className="size-5 text-accent/80 shrink-0" />
                <span>Cruelty Free</span>
              </div>
            </div>

            {/* Dynamic Tabs / Accordion detail info */}
            <div className="pt-6 border-t border-border/30 space-y-4">
              <div className="flex border-b border-border/40">
                <button
                  onClick={() => setActiveTab("ingredients")}
                  className={`flex-1 pb-4 text-xs tracking-widest uppercase font-bold transition-all border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent text-center cursor-pointer ${
                    activeTab === "ingredients" ? "border-accent text-ink" : "border-transparent text-muted-foreground"
                  }`}
                >
                  Ingredients
                </button>
                <button
                  onClick={() => setActiveTab("benefits")}
                  className={`flex-1 pb-4 text-xs tracking-widest uppercase font-bold transition-all border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent text-center cursor-pointer ${
                    activeTab === "benefits" ? "border-accent text-ink" : "border-transparent text-muted-foreground"
                  }`}
                >
                  Benefits
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`flex-1 pb-4 text-xs tracking-widest uppercase font-bold transition-all border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent text-center cursor-pointer ${
                    activeTab === "shipping" ? "border-accent text-ink" : "border-transparent text-muted-foreground"
                  }`}
                >
                  Shipping
                </button>
              </div>

              {/* Tab Display Panel */}
              <div className="py-4 min-h-36">
                {activeTab === "ingredients" && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-sm text-muted-foreground leading-relaxed font-serif italic text-left">
                      Crafted with pure, source-certified active botanical elements for optimal nourishment:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ingredientsList.length > 0 ? (
                        ingredientsList.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-[#F3EFE9] border border-border/40 text-xs text-ink/80 tracking-widest uppercase px-4 py-2 rounded-full font-medium font-sans"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">100% proprietary botanical recipe.</span>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "benefits" && (
                  <ul className="space-y-3 pl-0 list-none text-left">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed font-sans">
                        <span className="size-2 rounded-full bg-accent mt-2 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed font-serif italic text-left">
                    <p>📦 <strong>Fast Dispatch</strong>: Hand-crafted fresh daily. Orders are packaged in eco-friendly glass containers and shipped within 1 business day.</p>
                    <p>🚚 <strong>Delivery</strong>: Free Standard Shipping on all orders above $50. Standard delivery is 3-5 business days.</p>
                    <p>🔄 <strong>Our Promise</strong>: 30-day premium botanical satisfaction policy. Returns are simple and direct.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* You May Also Like cross-sell section */}
        {recommended.length > 0 && (
          <section className="mt-32 pt-20 border-t border-border/40">
            <h2 className="font-display text-4xl mb-12 text-left">Complete The Ritual</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommended.map((p) => (
                <Link
                  key={p.id}
                  to="/product/$productId"
                  params={{ productId: p.id }}
                  className="group space-y-6 text-left no-underline block text-ink hover:text-accent transition-colors font-sans"
                >
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-soft relative bg-[var(--gradient-warm)]">
                    <img
                      src={getProductImageSrc(p.image)}
                      alt={p.name}
                      className="size-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl text-ink group-hover:text-accent transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-sm font-serif italic text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-accent pt-2">
                      <span>View Ritual</span>
                      <span className="group-hover:translate-x-1.5 transition-transform font-sans">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
