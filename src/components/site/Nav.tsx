import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

const links = [
  { label: "Home", to: "/" },
  { label: "Story", to: "/story" },
  { label: "Product", to: "/products" },
  { label: "Contact Us", to: "/contact" },
];

export function Nav({ onCartOpen }: { onCartOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 py-1.5 ${scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border/50" : ""
        }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img src={logo} alt="TSR Logo" className="h-20 w-auto object-contain" />
        </a>
        
        <div className="flex items-center gap-12">
          <nav className="hidden md:flex items-center gap-9 text-base tracking-wide text-foreground/80">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="relative hover:text-foreground transition-colors story-link [&.active]:text-accent">
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            aria-label="Menu"
            className="md:hidden p-2.5 rounded-full hover:bg-secondary text-foreground/80 hover:text-foreground"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden mt-3 mx-6 rounded-2xl glass p-6 flex flex-col gap-4 animate-fade-in">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-base [&.active]:text-accent">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
