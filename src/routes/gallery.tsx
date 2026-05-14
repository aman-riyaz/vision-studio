import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({ meta: [{ title: "Gallery — Aperture Studio" }, { name: "description", content: "A selection of weddings, portraits, and family work from Aperture Studio." }] }),
});

const items = [
  { src: g1, cat: "Portraits", title: "Portraits" },
  { src: g2, cat: "Events", title: "Events" },
  { src: g3, cat: "Bike", title: "Bike Photoshoot" },
  { src: g4, cat: "Car", title: "Car Photoshoot" },
  { src: g5, cat: "Camera", title: "Camera for Rent" },
  { src: g6, cat: "Drone", title: "Drone for Rent" },
];

const cats = ["All", "Weddings", "Portraits", "Family", "Newborn", "Couples"];

function Gallery() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const filtered = active === "All" ? items : items.filter((i) => i.cat === active);
  return (
    <SiteLayout>
      <section className="pt-36 md:pt-44 pb-16 mx-auto max-w-7xl px-6 md:px-10">
        <p className="eyebrow">Portfolio</p>
        <h1 className="mt-4 text-5xl md:text-7xl">Gallery</h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          A small, rotating selection. Full collections are shared during your consultation.
        </p>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-border pb-4">
          {cats.map((c) => (
            <button key={c} onClick={() => setActive(c)}
              className={`eyebrow transition-colors ${active === c ? "text-foreground" : "hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filtered.map((it, i) => (
          <button key={i} onClick={() => setLightbox(it.src)} className="group text-left">
            <div className={`overflow-hidden bg-muted ${i % 5 === 0 ? "aspect-[4/5]" : "aspect-[4/5]"}`}>
              <img src={it.src} alt={it.title} loading="lazy" width={1200} height={1500}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-3 flex justify-between items-baseline">
              <p className="font-display text-lg">{it.title}</p>
              <p className="eyebrow">{it.cat}</p>
            </div>
          </button>
        ))}
      </section>
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-h-full max-w-full object-contain" />
          <button className="absolute top-6 right-6 text-white eyebrow">Close</button>
        </div>
      )}
    </SiteLayout>
  );
}