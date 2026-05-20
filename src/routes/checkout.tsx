import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/store/cartStore";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, ShoppingBag, ChevronRight } from "lucide-react";
import { Order } from "@/types/order";
import { createOrder, createCheckoutSession } from "@/lib/serverFunctions";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [{ title: "Checkout | Begin Your Ritual — TSR Beauty" }],
  }),
});

function CheckoutPage() {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const total = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = total > 50 ? 0 : 5.99;
  const grandTotal = total + shipping;

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
          image: it.image
        })),
        subtotal: total,
        shipping: shipping,
        total: grandTotal,
        status: 'pending',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };

      // 1. Create order in database
      await createOrder(newOrder);

      // 2. Initiate Stripe Checkout
      const { url } = await createCheckoutSession(state.items);

      // 3. Finalize
      clearCart();
      window.location.href = url;
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong with your ritual. Please try again.");
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

                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground px-1">Email Address</label>
                  <input 
                    required type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full bg-white border border-border/60 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-accent/40 transition-all shadow-sm"
                  />
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

              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                  <div className="size-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <CreditCard className="size-4 text-accent" />
                  </div>
                  <h2 className="font-display text-2xl">Payment Selection</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="relative group cursor-pointer">
                    <input type="radio" name="payment" id="stripe" defaultChecked className="peer hidden" />
                    <label htmlFor="stripe" className="block p-6 rounded-2xl bg-white border border-border/60 peer-checked:border-accent peer-checked:ring-1 peer-checked:ring-accent transition-all shadow-sm hover:shadow-md">
                      <div className="font-display text-lg">Stripe</div>
                      <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">Credit Card / Apple Pay</div>
                    </label>
                    <div className="absolute top-4 right-4 size-4 rounded-full border border-border/60 group-peer-checked:bg-accent group-peer-checked:border-accent flex items-center justify-center transition-all">
                      <div className="size-1.5 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="relative group cursor-pointer">
                    <input type="radio" name="payment" id="cod" className="peer hidden" />
                    <label htmlFor="cod" className="block p-6 rounded-2xl bg-white border border-border/60 peer-checked:border-accent peer-checked:ring-1 peer-checked:ring-accent transition-all shadow-sm hover:shadow-md">
                      <div className="font-display text-lg">COD</div>
                      <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">Cash on Delivery</div>
                    </label>
                    <div className="absolute top-4 right-4 size-4 rounded-full border border-border/60 group-peer-checked:bg-accent group-peer-checked:border-accent flex items-center justify-center transition-all">
                      <div className="size-1.5 rounded-full bg-white" />
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
                    <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-border/40">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free Ritual Delivery" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-accent italic">Add ${(50 - total).toFixed(2)} more to unlock complimentary delivery.</p>
                )}
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
