import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { XCircle, ArrowLeft, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/cancel")({
  component: CancelPage,
  head: () => ({
    meta: [{ title: "Checkout Cancelled | TSR Beauty" }],
  }),
});

function CancelPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF9] selection:bg-accent/20">
      <Nav onCartOpen={() => {}} />
      
      <main className="max-w-2xl mx-auto px-6 pt-40 pb-24 text-center">
        <div className="space-y-10 animate-fade-up">
          <div className="size-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
            <XCircle className="size-12 text-muted-foreground/60" />
          </div>

          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground font-medium">Checkout Cancelled</span>
            <h1 className="font-display text-5xl">Your ritual was paused.</h1>
            <p className="font-serif text-lg text-muted-foreground italic leading-relaxed">
              It looks like the checkout process was interrupted. No botanical treasures have been charged, and your selection is still waiting in your ritual cart.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
            <Link 
              to="/checkout"
              className="bg-ink text-white px-10 py-4 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-accent transition-all shadow-luxe flex items-center justify-center gap-3"
            >
              Resume Checkout <ArrowLeft className="size-4 rotate-180" />
            </Link>
            <Link 
              to="/products"
              className="border border-border/60 px-10 py-4 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-white transition-all flex items-center justify-center"
            >
              View Collection
            </Link>
          </div>

          <div className="pt-12 flex flex-col items-center gap-4 text-muted-foreground/60">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase">
              <MessageCircle className="size-4" /> Need assistance?
            </div>
            <p className="text-xs italic">
              If you experienced an error or have questions about our botanical rituals, <br />
              please reach out to us at <span className="text-ink underline">hello@tsrbeauty.co</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
