import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cartStore";
import { Link } from "@tanstack/react-router";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, updateQuantity, removeItem } = useCart();
  const total = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-card shadow-luxe flex flex-col transition-transform duration-500 ease-[var(--ease-luxe)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h3 className="font-display text-2xl flex items-center gap-2">
            Your ritual <span className="text-sm font-sans text-muted-foreground">({state.items.length})</span>
          </h3>
          <button onClick={onClose} aria-label="Close" className="size-9 rounded-full hover:bg-secondary flex items-center justify-center">
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-6 space-y-5">
          {state.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="size-16 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Your ritual is empty. <br />Begin your journey today.</p>
              <button 
                onClick={onClose}
                className="text-xs tracking-widest uppercase font-bold text-accent hover:text-ink transition"
              >
                Shop Collection
              </button>
            </div>
          ) : (
            state.items.map((it) => (
              <div key={it.id} className="flex gap-4 rounded-2xl bg-secondary/30 p-4 border border-transparent hover:border-border transition-all">
                <img src={it.image} alt={it.name} className="size-20 rounded-xl object-cover shadow-sm" />
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display text-lg leading-tight">{it.name}</div>
                      <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">{it.category}</div>
                    </div>
                    <div className="text-sm font-medium">${(it.price * it.quantity).toFixed(2)}</div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3 rounded-full border border-border bg-white px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(it.id, it.quantity - 1)}
                        className="p-1 hover:text-accent transition"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="text-xs min-w-[1.5rem] text-center font-medium">{it.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(it.id, it.quantity + 1)}
                        className="p-1 hover:text-accent transition"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(it.id)}
                      className="text-xs text-muted-foreground hover:text-destructive transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {state.items.length > 0 && (
          <footer className="border-t border-border p-6 space-y-4 bg-white">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <p className="text-[10px] tracking-wider uppercase text-muted-foreground text-center">
              Shipping & taxes calculated at checkout.
            </p>
            <Link
              to="/checkout"
              onClick={onClose}
              className="w-full flex items-center justify-center rounded-full bg-primary text-primary-foreground py-4 text-sm tracking-widest uppercase font-bold hover:bg-ink transition shadow-luxe"
            >
              Checkout · ${total.toFixed(2)}
            </Link>
          </footer>
        )}
      </aside>
    </>
  );
}
