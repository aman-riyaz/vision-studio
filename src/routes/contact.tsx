import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Vision Studio" },
      { name: "description", content: "Get in touch with Vision Studio." },
    ],
  }),
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 md:px-10 pt-32 md:pt-40 pb-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 text-4xl md:text-6xl">Hey There.</h1>
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p>hello@Vision.studio</p>
            <p>+91 8792042301</p>
            <p>karnataka <br />Kumta 581343</p>
            <p>Mon–Sat · 9:00–18:00 IST</p>
          </div>
        </div>
        <div className="md:col-span-7">
          {sent ? (
            <div className="pt-10">
              <p className="eyebrow">Message sent</p>
              <h2 className="mt-3 text-3xl">Thanks — we'll reply soon.</h2>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-6"
            >
              <input className="field" placeholder="Your name" required />
              <input className="field" type="email" placeholder="Email" required />
              <input className="field" placeholder="Subject" required />
              <textarea className="field min-h-[160px]" placeholder="Message" required />
              <button type="submit" className="btn-primary">Send message</button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}