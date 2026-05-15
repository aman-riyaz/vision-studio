import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import about from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Vision Studio" },
      { name: "description", content: "Meet the photographers behind Vision Studio." },
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
           We capture moments with creativity and passion.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Vision Studio is a small photography studio where we capture portraits, personal photoshoots, rent out gadgets and many more cool stuff with creative ideas and natural photography style. We always try to make every moment special and memorable for our customers -   
            Team Vision Studio (Aman, Shrinivas, Shravan, Manoj) 
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <div>
              <div className="font-display text-4xl">5</div>
              <p className="eyebrow mt-1">Years</p>
            </div>
            <div>
              <div className="font-display text-4xl">100+</div>
              <p className="eyebrow mt-1">Events</p>
            </div>
            <div>
              <div className="font-display text-4xl">3</div>
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