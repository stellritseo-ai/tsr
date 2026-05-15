import { X, Minus, Plus } from "lucide-react";
import oil from "@/assets/product-growth-oil.jpg";
import butter from "@/assets/product-hair-butter.jpg";

const items = [
  { name: "Growth Oil", img: oil, price: 38, qty: 1 },
  { name: "Hair Butter", img: butter, price: 32, qty: 1 },
];

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
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
          <h3 className="font-display text-2xl">Your ritual</h3>
          <button onClick={onClose} aria-label="Close" className="size-9 rounded-full hover:bg-secondary flex items-center justify-center">
            <X className="size-4" />
          </button>
        </header>
        <div className="flex-1 overflow-auto p-6 space-y-5">
          {items.map((it) => (
            <div key={it.name} className="flex gap-4 rounded-2xl bg-secondary/50 p-3">
              <img src={it.img} alt={it.name} className="size-20 rounded-xl object-cover" />
              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-display text-lg">{it.name}</div>
                    <div className="text-xs text-muted-foreground">100ml · Glass</div>
                  </div>
                  <div className="text-sm">${it.price}</div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border border-border">
                    <button className="p-1.5"><Minus className="size-3" /></button>
                    <span className="text-xs w-5 text-center">{it.qty}</span>
                    <button className="p-1.5"><Plus className="size-3" /></button>
                  </div>
                  <button className="text-xs text-muted-foreground hover:text-foreground">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <footer className="border-t border-border p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${total}</span>
          </div>
          <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
          <button className="w-full rounded-full bg-primary text-primary-foreground py-4 text-sm tracking-wide hover:bg-ink transition">
            Checkout · ${total}
          </button>
        </footer>
      </aside>
    </>
  );
}
