import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Newsletter } from "@/components/site/Newsletter";
import {
   Phone,
   MapPin,
   Clock,
   Send,
   Instagram,
   Facebook,
   Twitter,
   Youtube,
   ChevronDown,
   Sparkles,
   ShieldCheck,
   Zap,
   UserCheck,
   ArrowRight,
   AlertCircle,
   Loader2
} from "lucide-react";

import { sendContactMessage } from "@/lib/serverFunctions";

// Images
import contactHero from "@/assets/Hair-Butter1.jpg";
import productImg from "@/assets/3-Step-Hair-Growth.jpg";

export const Route = createFileRoute("/contact")({
   component: ContactPage,
   head: () => ({
      meta: [{ title: "Contact | TSR Skin & Hair Care — Let's Connect" }],
      links: [
         {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap",
         },
      ],
   }),
});

function ContactPage() {
   const [cartOpen, setCartOpen] = useState(false);
   const [activeFaq, setActiveFaq] = useState<number | null>(null);

   // Form states
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
   });
   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState(false);
   const [error, setError] = useState("");

   const faqs = [
      {
         q: "How long does shipping take?",
         a: "Shipping times vary depending on location and processing times. Typically, domestic orders arrive within 3-7 business days."
      },
      {
         q: "Are TSR™ products suitable for all hair types?",
         a: "Our botanical formulas are designed to support a wide range of hair textures and routines, focusing on natural nourishment and hydration."
      },
      {
         q: "How often should I use the products?",
         a: "Consistent use as part of your regular self-care routine is recommended for best results. Each product has specific guidance on its ritual."
      },
      {
         q: "Do you offer bundles?",
         a: "Yes, TSR™ offers premium product bundles designed for complete care rituals, providing a comprehensive botanical experience."
      }
   ];

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.email || !formData.message) {
         setError("Please fill in Name, Email, and Message.");
         return;
      }
      setLoading(true);
      setError("");
      try {
         const res = await sendContactMessage(formData);
         if (res && res.success) {
            setSuccess(true);
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
         } else {
            setError("Failed to transmit correspondence. Please try again.");
         }
      } catch (err) {
         setError("A server connection issue occurred. Please try again later.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-[#FDFCF9] text-foreground selection:bg-accent/20 selection:text-white">
         <Nav onCartOpen={() => setCartOpen(true)} />

         <main>
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-ink">
               <div className="absolute inset-0 z-0">
                  <img
                     src={contactHero}
                     alt="Luxury Contact Hero"
                     className="size-full object-cover opacity-60 scale-105 animate-slow-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink" />
                  {/* Floating Product Accent */}
                  <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[400px] h-[500px] hidden lg:block animate-float-slow opacity-40">
                     <img src={productImg} alt="Floating Product" className="size-full object-contain drop-shadow-2xl" />
                  </div>
               </div>

               <div className="relative z-10 max-w-5xl mx-auto text-center px-6 animate-fade-up">
                  <span className="inline-block text-[10px] tracking-[0.5em] uppercase text-gold mb-6 font-medium">
                     TSR™ CONTACT
                  </span>
                  <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[1.1] mb-8 text-white">
                     Let’s <em className="italic font-normal">Connect</em>
                  </h1>
                  <div className="flex flex-col items-center gap-8">
                     <div className="h-[1px] w-24 bg-gold/40" />
                     <div className="space-y-4 max-w-2xl">
                        <h2 className="text-gold text-sm tracking-[0.3em] uppercase font-medium">
                           Luxury Botanical Hair & Skin Care Crafted With Purpose
                        </h2>
                        <p className="font-serif text-lg md:text-xl text-white/70 leading-relaxed italic">
                           We’d love to hear from you. Whether you have questions about our collections, collaborations, product information, or general inquiries, the TSR™ team is here to assist you.
                        </p>
                      </div>
                      <div className="mt-8 flex flex-wrap justify-center gap-6">
                         <a href="#message" className="bg-gold text-ink px-12 py-5 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-white transition-all duration-500 shadow-luxe">
                            Send A Message
                         </a>
                         <a href="/products" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-white hover:text-ink transition-all duration-500">
                            Explore Collection
                         </a>
                      </div>
                   </div>
                </div>
             </section>

             {/* CONTACT INFORMATION SECTION */}
             <section className="py-32 px-6 bg-white relative">
                <div className="max-w-7xl mx-auto">
                   <div className="text-center mb-20">
                      <span className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4 block">Information</span>
                      <h2 className="font-display text-5xl md:text-6xl mb-6">Get In Touch</h2>
                      <p className="font-serif text-lg text-muted-foreground italic max-w-2xl mx-auto">
                         Our team is committed to providing a premium customer experience with thoughtful support and personalized assistance.
                      </p>
                   </div>

                   <div className="grid md:grid-cols-3 gap-8">
                      {[
                         { icon: <Phone className="size-6" />, label: "Phone", value: "407-694-8624", desc: "Speak with a specialist" },
                         { icon: <MapPin className="size-6" />, label: "Location", value: "Orlando, FL 32835", desc: "Our headquarters" },
                         { icon: <Clock className="size-6" />, label: "Business Hours", value: "Mon — Fri | 9:00 AM — 6:00 PM", desc: "Available for support" }
                      ].map((card, i) => (
                         <div key={i} className={`group p-12 rounded-[2rem] bg-[#FDFCF9] border border-border/50 hover:border-gold/30 hover:shadow-luxe transition-all duration-700 animate-fade-up [animation-delay:${i * 200}ms]`}>
                            <div className="text-gold mb-8 p-4 bg-white rounded-2xl w-fit shadow-soft group-hover:scale-110 transition-transform duration-500">
                               {card.icon}
                            </div>
                            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 block">{card.label}</span>
                            <h3 className="font-display text-2xl mb-4 text-ink">{card.value}</h3>
                            <p className="text-sm text-muted-foreground font-serif italic">{card.desc}</p>
                         </div>
                      ))}
                   </div>
                </div>
             </section>

             {/* CONTACT FORM SECTION */}
             <section id="message" className="py-32 px-6 bg-ink relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

                <div className="max-w-4xl mx-auto relative z-10">
                   <div className="text-center mb-20 text-white">
                      <span className="text-[10px] tracking-[0.4em] uppercase text-gold mb-4 block">Correspondence</span>
                      <h2 className="font-display text-5xl md:text-7xl mb-8">Send Us A Message</h2>
                   </div>

                   {success ? (
                      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-16 text-center space-y-6 animate-fade-up max-w-2xl mx-auto shadow-2xl relative">
                         <div className="size-20 bg-gold text-ink rounded-full flex items-center justify-center mx-auto shadow-luxe animate-bounce">
                            <ShieldCheck className="size-10" />
                         </div>
                         <div className="space-y-3">
                            <h3 className="font-display text-4xl text-white">Message Transmitted</h3>
                            <p className="font-serif text-lg text-white/60 italic">
                               Thank you. Your message has been securely logged in the TSR™ archives and forwarded to our support team. We will contact you soon.
                            </p>
                         </div>
                         <button 
                            onClick={() => setSuccess(false)}
                            className="text-[10px] tracking-[0.4em] uppercase text-gold hover:text-white font-bold transition pt-6 cursor-pointer"
                         >
                            Send Another Message →
                         </button>
                      </div>
                   ) : (
                      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-up">
                         {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-6 py-4 rounded-2xl text-xs font-sans flex items-center gap-3">
                               <AlertCircle className="size-4 shrink-0" />
                               {error}
                            </div>
                         )}
                         
                         <div className="grid md:grid-cols-2 gap-8">
                            <div className="group relative">
                               <input 
                                  type="text" 
                                  placeholder="Enter your full name" 
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  className="w-full bg-ink border-b border-white/20 py-5 px-0 text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors font-serif italic" 
                                  required
                               />
                               <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-gold group-focus-within:w-full transition-all duration-700" />
                            </div>
                            <div className="group relative">
                               <input 
                                  type="email" 
                                  placeholder="Your email address" 
                                  value={formData.email}
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                                  className="w-full bg-ink border-b border-white/20 py-5 px-0 text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors font-serif italic" 
                                  required
                               />
                               <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-gold group-focus-within:w-full transition-all duration-700" />
                            </div>
                         </div>

                         <div className="grid md:grid-cols-2 gap-8">
                            <div className="group relative">
                               <input 
                                  type="tel" 
                                  placeholder="Your phone number" 
                                  value={formData.phone}
                                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                  className="w-full bg-ink border-b border-white/20 py-5 px-0 text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors font-serif italic" 
                               />
                               <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-gold group-focus-within:w-full transition-all duration-700" />
                            </div>
                            <div className="group relative">
                               <input 
                                  type="text" 
                                  placeholder="How can we help? (Subject)" 
                                  value={formData.subject}
                                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                  className="w-full bg-ink border-b border-white/20 py-5 px-0 text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors font-serif italic" 
                               />
                               <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-gold group-focus-within:w-full transition-all duration-700" />
                            </div>
                         </div>

                         <div className="group relative">
                            <textarea 
                               rows={5} 
                               placeholder="Write your message here…" 
                               value={formData.message}
                               onChange={(e) => setFormData({...formData, message: e.target.value})}
                               className="w-full bg-ink border-b border-white/20 py-5 px-0 text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors font-serif italic resize-none" 
                               required
                            />
                            <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-gold group-focus-within:w-full transition-all duration-700" />
                         </div>

                         <div className="pt-10 flex justify-center">
                            <button 
                               type="submit"
                               disabled={loading}
                               className="group relative bg-gold text-ink px-16 py-6 rounded-full text-[10px] tracking-[0.5em] uppercase font-bold overflow-hidden shadow-luxe hover:bg-white hover:text-ink transition-all duration-500 flex items-center justify-center cursor-pointer"
                            >
                               <span className="relative z-10 flex items-center gap-3">
                                  {loading ? "Transmitting..." : "Send Message"}
                                  {loading ? (
                                     <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                     <Send className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                  )}
                               </span>
                            </button>
                         </div>
                      </form>
                   )}
                </div>
             </section>

             {/* CUSTOMER EXPERIENCE SECTION */}
             <section className="py-32 px-6 bg-[#FDFCF9]">
                <div className="max-w-7xl mx-auto">
                   <div className="grid lg:grid-cols-2 gap-20 items-center">
                      <div className="space-y-10 animate-fade-up">
                         <div className="space-y-6">
                            <span className="text-[10px] tracking-[0.4em] uppercase text-accent font-medium">Care Philosophy</span>
                            <h2 className="font-display text-5xl md:text-7xl">Luxury Support Experience</h2>
                            <p className="font-serif text-xl text-muted-foreground leading-relaxed italic">
                               At TSR™, we believe customer care should feel just as luxurious as our products. Every inquiry is handled with attention, professionalism, and care to ensure a premium brand experience from start to finish.
                            </p>
                         </div>

                         <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8 pt-8 border-t border-border/40">
                            {[
                               { icon: <UserCheck className="size-5" />, label: "Personalized Support" },
                               { icon: <Zap className="size-5" />, label: "Fast Response Time" },
                               { icon: <Sparkles className="size-5" />, label: "Premium Experience" },
                               { icon: <ShieldCheck className="size-5" />, label: "Professional Assistance" }
                            ].map((item, i) => (
                               <div key={i} className="flex items-center gap-4 group">
                                  <div className="text-gold group-hover:scale-110 transition-transform">{item.icon}</div>
                                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-ink">{item.label}</span>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl animate-fade-up [animation-delay:300ms]">
                         <img src={contactHero} alt="Luxury Experience" className="size-full object-cover" />
                         <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[3rem]" />
                         <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                      </div>
                   </div>
                </div>
             </section>

             {/* SOCIAL CONNECTION SECTION */}
             <section className="py-32 px-6 bg-white border-y border-border/20">
                <div className="max-w-7xl mx-auto">
                   <div className="text-center mb-20">
                      <span className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4 block">Follow Our Journey</span>
                      <h2 className="font-display text-5xl md:text-6xl mb-6">Stay Connected</h2>
                      <p className="font-serif text-lg text-muted-foreground italic max-w-2xl mx-auto">
                         Follow TSR™ Skin & Hair Care for luxury beauty inspiration, product launches, self-care rituals, and botanical hair care content.
                      </p>
                   </div>

                   <div className="flex flex-wrap justify-center gap-12 sm:gap-24">
                      {[
                         { icon: <Instagram className="size-8" />, label: "Instagram" },
                         { icon: <Facebook className="size-8" />, label: "Facebook" },
                         { icon: <Twitter className="size-8" />, label: "TikTok" },
                         { icon: <Youtube className="size-8" />, label: "Pinterest" }
                      ].map((social, i) => (
                         <a key={i} href="#" className="flex flex-col items-center gap-4 group animate-fade-up [animation-delay:${i * 150}ms]">
                            <div className="size-20 rounded-full border border-border/40 flex items-center justify-center text-ink group-hover:text-gold group-hover:border-gold group-hover:shadow-glow transition-all duration-500 relative">
                               <div className="absolute inset-0 rounded-full border-t border-gold opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700" />
                               {social.icon}
                            </div>
                            <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-ink group-hover:text-gold transition-colors">{social.label}</span>
                         </a>
                      ))}
                   </div>
                </div>
             </section>

             {/* FAQ SECTION */}
             <section className="py-32 px-6 bg-[#FDFCF9]">
                <div className="max-w-4xl mx-auto">
                   <div className="text-center mb-20">
                      <h2 className="font-display text-5xl md:text-6xl">Frequently Asked Questions</h2>
                   </div>

                   <div className="space-y-4">
                      {faqs.map((faq, i) => (
                         <div key={i} className="group border border-border/40 rounded-3xl overflow-hidden bg-white hover:border-gold/30 transition-all duration-500">
                            <button
                               onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                               className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
                            >
                               <h4 className="font-display text-xl md:text-2xl text-ink">{faq.q}</h4>
                               <div className={`text-gold transition-transform duration-500 ${activeFaq === i ? 'rotate-180' : ''}`}>
                                  <ChevronDown className="size-6" />
                               </div>
                            </button>
                            <div className={`overflow-hidden transition-all duration-700 ease-luxe ${activeFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                               <div className="p-8 pt-0 font-serif text-lg text-muted-foreground italic leading-relaxed border-t border-border/20 mx-8">
                                  {faq.a}
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </section>

             {/* FINAL CTA SECTION */}
             <section className="py-40 px-6 bg-ink text-white relative overflow-hidden text-center">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <div className="max-w-4xl mx-auto space-y-12 animate-fade-up">
                   <h2 className="font-display text-5xl md:text-8xl">Begin Your Luxury <br />Care Ritual</h2>
                   <p className="font-serif text-xl text-white/60 italic max-w-2xl mx-auto leading-relaxed">
                      Discover premium botanical skincare and haircare designed to nourish, hydrate, restore, and elevate everyday self-care.
                   </p>
                   <div className="flex flex-wrap justify-center gap-6 pt-6">
                      <a href="/products" className="bg-gold text-ink px-16 py-6 rounded-full text-[10px] tracking-[0.5em] uppercase font-bold hover:bg-white transition-all duration-500 shadow-luxe">
                         Explore Collection
                      </a>
                      <a href="/story" className="border border-white/20 px-16 py-6 rounded-full text-[10px] tracking-[0.5em] uppercase font-bold hover:bg-white hover:text-ink transition-all duration-500">
                         Discover Our Story
                      </a>
                   </div>
                </div>
             </section>

             <Newsletter />
          </main>

          <Footer />
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

          <style>{`
         @keyframes slow-zoom {
           0% { transform: scale(1); }
           100% { transform: scale(1.1); }
         }
         .animate-slow-zoom {
           animation: slow-zoom 20s ease-out infinite alternate;
         }
         .shadow-glow {
           box-shadow: 0 0 40px oklch(0.75 0.13 75 / 0.3);
         }
       `}</style>
       </div>
    );
}
