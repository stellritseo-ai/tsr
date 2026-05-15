import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const cols = [
  { title: "Shop", links: ["Hair", "Skin", "Bundles", "New In", "Bestsellers"] },
  { title: "About", links: ["Our Story", "Ingredients", "Sustainability", "Press"] },
  { title: "Help", links: ["Contact", "Shipping", "Returns", "FAQ", "Track order"] },
];

export function Footer() {
  return (
    <footer className="relative bg-ink text-[oklch(0.88_0.04_75)] pt-24 pb-10 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5">
            <div className="font-display text-4xl">TSR<span className="text-accent">.</span></div>
            <p className="mt-5 max-w-md text-sm leading-relaxed opacity-80">
              Botanical skin and hair rituals, slowly handcrafted in small batches.
              Made for those who treat self‑care as art.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex max-w-md rounded-full border border-white/15 overflow-hidden"
            >
              <input
                type="email"
                placeholder="Email for the journal"
                className="flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-current/50"
              />
              <button className="px-5 text-sm tracking-widest uppercase bg-[oklch(0.88_0.04_75)] text-ink hover:bg-white transition">
                Join
              </button>
            </form>
          </div>

          {cols.map((c) => (
            <div key={c.title} className="lg:col-span-2">
              <div className="text-xs tracking-[0.3em] uppercase opacity-60">{c.title}</div>
              <ul className="mt-5 space-y-3 text-sm">
                {c.links.map((l) => (
                  <li key={l}><a href="#" className="opacity-80 hover:opacity-100 transition">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1">
            <div className="text-xs tracking-[0.3em] uppercase opacity-60">Studio</div>
            <p className="mt-5 text-sm opacity-80 leading-relaxed">
              Brooklyn, NY<br />hello@tsrbeauty.co
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs opacity-70">
          <div>© {new Date().getFullYear()} TSR Beauty Co. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="Instagram"><Instagram className="size-4 hover:opacity-100 opacity-70 transition" /></a>
            <a href="#" aria-label="Twitter"><Twitter className="size-4 hover:opacity-100 opacity-70 transition" /></a>
            <a href="#" aria-label="Facebook"><Facebook className="size-4 hover:opacity-100 opacity-70 transition" /></a>
            <a href="#" aria-label="YouTube"><Youtube className="size-4 hover:opacity-100 opacity-70 transition" /></a>
          </div>
          <div className="flex gap-5">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
