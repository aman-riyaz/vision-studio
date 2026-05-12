import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import about from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Aperture Studio" },
      { name: "description", content: "Meet the photographer behind Aperture Studio." },
    ],
  }),
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 md:px-10 pt-32 md:pt-40 pb-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <img src={about} alt="Photographer portrait" className="w-full h-auto object-cover" />
        </div>
        <div className="md:col-span-7">
          <p className="eyebrow">About</p>
          <h1 className="mt-4 text-4xl md:text-6xl leading-tight">
            I make photographs that feel like memory.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Aperture is a small studio based in Brooklyn with clients across India and beyond.
            For twelve years I've documented weddings, families and intimate portraits — quietly,
            patiently, and always on film and digital both.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <div>
              <div className="font-display text-4xl">12</div>
              <p className="eyebrow mt-1">Years</p>
            </div>
            <div>
              <div className="font-display text-4xl">180+</div>
              <p className="eyebrow mt-1">Weddings</p>
            </div>
            <div>
              <div className="font-display text-4xl">9</div>
              <p className="eyebrow mt-1">Countries</p>
            </div>
          </div>

          <div className="mt-10">
            <Link to="/booking" className="btn-primary">Book a session</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}