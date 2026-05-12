import { Link } from "@tanstack/react-router";
import { useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/booking", label: "Booking" },
  { to: "/contact", label: "Contact" },
  { to: "/admin", label: "Admin" },
] as const;

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-6 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl tracking-tight">
            Aperture<span className="text-accent">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="eyebrow hover:text-foreground transition-colors"
                activeProps={{ className: "eyebrow text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden eyebrow"
            aria-label="Toggle menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        {open && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="flex flex-col px-6 py-4 gap-4">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="eyebrow">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border mt-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="font-display text-2xl">Aperture<span className="text-accent">.</span></div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Quiet, considered photography for the moments worth keeping.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">Studio</p>
            <p className="text-sm text-muted-foreground">12 Linden Lane<br />Brooklyn, NY 11201</p>
          </div>
          <div>
            <p className="eyebrow mb-3">Contact</p>
            <p className="text-sm text-muted-foreground">hello@aperture.studio<br />+1 (212) 555 0134</p>
          </div>
        </div>
        <div className="border-t border-border">
          <p className="mx-auto max-w-7xl px-6 md:px-10 py-5 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pixel Photography Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}