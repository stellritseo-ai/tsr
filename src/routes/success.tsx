import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CheckCircle2, ArrowRight, Instagram, Mail } from "lucide-react";

export const Route = createFileRoute("/success")({
  component: SuccessPage,
  head: () => ({
    meta: [{ title: "Ritual Confirmed | TSR Beauty" }],
  }),
});

function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF9] selection:bg-accent/20">
      <Nav onCartOpen={() => {}} />
      
      <main className="max-w-4xl mx-auto px-6 pt-40 pb-24 text-center">
        <div className="space-y-12 animate-fade-up">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative size-32 rounded-full bg-white flex items-center justify-center shadow-luxe mx-auto">
              <CheckCircle2 className="size-16 text-accent" />
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.5em] uppercase text-accent font-medium">Order Confirmed</span>
            <h1 className="font-display text-6xl">Your ritual has begun.</h1>
            <p className="font-serif text-xl text-muted-foreground italic max-w-2xl mx-auto leading-relaxed">
              Thank you for choosing Botanical Radiance. We are preparing your botanical treasures with care and will notify you as soon as they begin their journey to you.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-6 pt-8">
            <Link 
              to="/products"
              className="bg-ink text-white px-12 py-5 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-accent transition-all shadow-luxe flex items-center gap-3"
            >
              Back to Collection <ArrowRight className="size-4" />
            </Link>
            <Link 
              to="/"
              className="border border-border/60 px-12 py-5 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-white transition-all"
            >
              Return Home
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-border/40">
            <div className="glass p-8 rounded-3xl space-y-4 text-left">
              <div className="size-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Mail className="size-5 text-accent" />
              </div>
              <h3 className="font-display text-xl">Order Updates</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A confirmation email has been sent to your inbox. We'll send you tracking details once your package is shipped.
              </p>
            </div>
            <div className="glass p-8 rounded-3xl space-y-4 text-left">
              <div className="size-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Instagram className="size-5 text-accent" />
              </div>
              <h3 className="font-display text-xl">Share Your Ritual</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join our community on Instagram and tag us in your self-care moments using <span className="font-medium text-ink">#TSRBeauty</span>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
