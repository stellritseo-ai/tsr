import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/store/cartStore";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, ShoppingBag, ChevronRight } from "lucide-react";
import { Order } from "@/types/order";
import { createCheckoutSession } from "@/lib/serverFunctions";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [{ title: "Checkout | Begin Your Ritual — TSR Skin & Hair Care" }],
  }),
});

function CheckoutPage() {
  const { state } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const total = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalOriginal = state.items.reduce((s, i) => s + (i.originalPrice || i.price) * i.quantity, 0);
  const savings = totalOriginal - total;
  const grandTotal = total; // Free shipping always

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newOrder: Order = {
        id: `#TSR-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        phone: formData.phone,
        items: state.items.map(it => ({
          productId: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          image: it.image,
          link: `${window.location.origin}/products`
        })),
        subtotal: total,
        shipping: 0,
        total: grandTotal,
        status: 'pending',
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'Stripe',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };

      // Save pending order to be processed
      localStorage.setItem('tsr_pending_order', JSON.stringify(newOrder));

      if (paymentMethod === 'cod') {
        // Direct route to success page for Cash On Delivery orders
        window.location.href = "/success";
      } else {
        // Initiate Stripe Checkout
        const session = await createCheckoutSession(state.items);

        if (session.error) {
          throw new Error(session.error);
        }

        // Redirect to Stripe (Cart cleared on success page)
        window.location.href = session.url;
      }
    } catch (err: any) {
      console.error("Checkout failed:", err);
      alert(`Checkout failed: ${err.message || "Something went wrong. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="size-24 rounded-full bg-secondary flex items-center justify-center mb-4">
          <ShoppingBag className="size-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-4xl">Your ritual is empty</h1>
        <p className="text-muted-foreground max-w-md italic font-serif text-lg">
          It looks like you haven't added any botanical treasures to your collection yet.
        </p>
        <Link 
          to="/products"
          className="bg-ink text-white px-10 py-4 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-accent transition-all shadow-luxe"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] selection:bg-accent/20">
      <Nav onCartOpen={() => {}} />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* LEFT SIDE: FORM */}
          <div className="lg:col-span-7 space-y-12 animate-fade-up">
            <header className="space-y-4">
              <Link to="/products" className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-muted-foreground hover:text-accent transition">
                <ArrowLeft className="size-3" /> Back to collection
              </Link>
              <h1 className="font-display text-5xl">Checkout</h1>
              <div className="flex items-center gap-4 text-xs tracking-widest uppercase font-medium">
                <span className={step === 1 ? "text-ink" : "text-muted-foreground"}>01 Details</span>
                <ChevronRight className="size-3 text-border" />
                <span className={step === 2 ? "text-ink" : "text-muted-foreground"}>02 Shipping</span>
                <ChevronRight className="size-3 text-border" />
                <span className={step === 3 ? "text-ink" : "text-muted-foreground"}>03 Ritual Payment</span>
              </div>
            </header>

            <form onSubmit={handleCheckout} className="space-y-10">
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                  <div className="size-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Truck className="size-4 text-accent" />
                  </div>
                  <h2 className="font-display text-2xl">Shipping Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground px-1">First Name</label>
                    <input 
                      required name="firstName" value={formData.firstName} onChange={handleInputChange}
                      className="w-full bg-white border border-border/60 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-accent/40 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground px-1">Last Name</label>
                    <input 
                      required name="lastName" value={formData.lastName} onChange={handleInputChange}
                      className="w-full bg-white border border-border/60 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-accent/40 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground px-1">Email Address</label>
                    <input 
                      required type="email" name="email" value={formData.email} onChange={handleInputChange}
                      className="w-full bg-white border border-border/60 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-accent/40 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground px-1">Phone Number</label>
                    <input 
                      required type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full bg-white border border-border/60 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-accent/40 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground px-1">Shipping Address</label>
                  <input 
                    required name="address" value={formData.address} onChange={handleInputChange}
                    className="w-full bg-white border border-border/60 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-accent/40 transition-all shadow-sm"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground px-1">City</label>
                    <input 
                      required name="city" value={formData.city} onChange={handleInputChange}
                      className="w-full bg-white border border-border/60 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-accent/40 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground px-1">Zip Code</label>
                    <input 
                      required name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                      className="w-full bg-white border border-border/60 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-accent/40 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                  <div className="size-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <CreditCard className="size-4 text-accent" />
                  </div>
                  <h2 className="font-display text-2xl">Payment Method</h2>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 text-left">
                  {/* Card Option */}
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`p-6 rounded-2xl bg-white border-2 cursor-pointer transition-all duration-300 ${
                      paymentMethod === "card"
                        ? "border-accent shadow-sm ring-1 ring-accent"
                        : "border-border/60 hover:border-accent/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-display text-lg">Secure Card Payment</span>
                      <div className={`size-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === "card" ? "border-accent bg-accent" : "border-border"
                      }`}>
                        {paymentMethod === "card" && <div className="size-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div className="text-[10px] tracking-widest uppercase text-muted-foreground leading-relaxed">
                      Credit Card · Debit Card · Apple Pay · Google Pay
                    </div>
                  </div>

                  {/* COD Option */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-6 rounded-2xl bg-white border-2 cursor-pointer transition-all duration-300 ${
                      paymentMethod === "cod"
                        ? "border-accent shadow-sm ring-1 ring-accent"
                        : "border-border/60 hover:border-accent/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-display text-lg">Cash On Delivery</span>
                      <div className={`size-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === "cod" ? "border-accent bg-accent" : "border-border"
                      }`}>
                        {paymentMethod === "cod" && <div className="size-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div className="text-[10px] tracking-widest uppercase text-muted-foreground leading-relaxed">
                      Pay cash at your doorstep · No extra processing fees
                    </div>
                  </div>
                </div>
              </section>

              <button 
                type="submit"
                className="w-full bg-ink text-white py-5 rounded-full text-[11px] tracking-[0.5em] uppercase font-bold hover:bg-accent transition-all shadow-luxe animate-fade-in"
              >
                Complete Your Ritual · ${grandTotal.toFixed(2)}
              </button>
            </form>

            <div className="flex items-center justify-center gap-8 py-8 text-muted-foreground/40 border-t border-border/20">
              <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase">
                <ShieldCheck className="size-4" /> Secure Payment
              </div>
              <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase">
                <Truck className="size-4" /> Ethical Shipping
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SUMMARY */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 glass p-8 rounded-[2rem] space-y-8 animate-fade-up [animation-delay:200ms]">
              <h2 className="font-display text-2xl border-b border-border/40 pb-6">Ritual Summary</h2>
              
              <div className="space-y-6 max-h-[40vh] overflow-auto pr-2 custom-scrollbar">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative size-16 shrink-0 rounded-xl overflow-hidden border border-border/40 shadow-sm">
                      <img src={item.image} alt={item.name} className="size-full object-cover" />
                      <div className="absolute -top-1 -right-1 size-5 bg-ink text-white text-[10px] flex items-center justify-center rounded-full border border-white shadow-sm">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-display">{item.name}</div>
                      <div className="text-[10px] tracking-widest uppercase text-muted-foreground">{item.category}</div>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                      {item.originalPrice ? (
                        <>
                          <div className="text-xs line-through text-muted-foreground/60">${(item.originalPrice * item.quantity).toFixed(2)}</div>
                          <div className="text-sm font-bold text-gold">${(item.price * item.quantity).toFixed(2)}</div>
                          <div className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider inline-block">50% Off</div>
                        </>
                      ) : (
                        <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-border/40">
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Original Subtotal</span>
                    <span className="line-through text-muted-foreground/60">${totalOriginal.toFixed(2)}</span>
                  </div>
                )}
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 font-bold bg-emerald-50/50 px-3 py-2 rounded-xl">
                    <span>Discount Savings (50% Off)</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-accent font-medium">Free Delivery ✨</span>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="font-display text-2xl">Total</span>
                  <span className="font-display text-3xl text-accent">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-2xl p-4 flex gap-4 items-start">
                <div className="size-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <ShoppingBag className="size-4 text-accent" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic font-serif">
                  "Your selection of botanical treasures is ready to begin its journey to you. Every ritual is handcrafted with love."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
