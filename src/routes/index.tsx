import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import hero from "@/assets/hero.jpg";
import g1 from "@/assets/g1.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <img src={hero} alt="Editorial portrait" width={1600} height={1920} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        <div className="relative z-10 h-full mx-auto max-w-7xl px-6 md:px-10 flex flex-col justify-end pb-24">
          <p className="eyebrow text-white/80">Est. 2014 — Brooklyn</p>
          <h1 className="mt-4 text-white text-5xl md:text-7xl lg:text-8xl leading-[1.05] max-w-4xl">
            Photographs that hold the quiet moments.
          </h1>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/booking" className="btn-primary">Book a session</Link>
            <Link to="/gallery" className="btn-outline text-white">View gallery</Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <p className="eyebrow">Our work</p>
        </div>
        <div className="md:col-span-8">
          <h2 className="text-3xl md:text-5xl leading-tight">
            A small studio devoted to honest, unhurried photography — for portraits, events, and the people you love.
          </h2>
          <Link to="/about" className="inline-block mt-8 eyebrow text-foreground border-b border-foreground pb-1">
            More about us →
          </Link>
        </div>
      </section>

      {/* Featured triptych */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-24 grid md:grid-cols-3 gap-4 md:gap-6">
        {[
          { src: g1, label: "Portraits" },
          { src: g3, label: "Bike Photoshoot" },
          { src: g4, label: "Car Photoshoot" },
        ].map((it) => (
          <Link key={it.label} to="/gallery" className="group block">
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <img src={it.src} alt={it.label} loading="lazy" width={1200} height={1500}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <p className="mt-4 eyebrow">{it.label}</p>
          </Link>
        ))}
      </section>

      {/* Quote */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-24 md:py-32 text-center">
          <p className="font-display text-3xl md:text-5xl leading-snug text-foreground">
            “She has a way of making you forget there’s a camera at all. The photographs feel like memory itself.”
          </p>
          <p className="eyebrow mt-8">— Maya & Jonas, married Sept ’24</p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32 text-center">
        <p className="eyebrow">Now booking</p>
        <h2 className="mt-4 text-4xl md:text-6xl">Spring & summer dates available.</h2>
        <Link to="/booking" className="btn-primary mt-10">Reserve your date</Link>
      </section>
    </SiteLayout>
  );
}
