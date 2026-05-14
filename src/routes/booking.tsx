import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { getPlans, createOrder, formatInr } from "@/lib/store";

export const Route = createFileRoute("/booking")({
  component: Booking,
  head: () => ({
    meta: [
      { title: "Booking — Vision Studio" },
      { name: "description", content: "Book a photography session. portraits, personal and events — pricing in INR." },
    ],
  }),
});

function Booking() {
  const plans = useMemo(() => getPlans(), []);
  const [planId, setPlanId] = useState(plans[0]?.id ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState<null | { id: string }>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = plans.find((p) => p.id === planId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim() || !date || !planId) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      const order = createOrder({
        customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
        planId,
        sessionDate: date,
        notes: notes.trim(),
      });
      setSubmitted({ id: order.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (submitted) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-6 md:px-10 pt-40 pb-32 text-center">
          <p className="eyebrow">Booking received</p>
          <h1 className="mt-4 text-4xl md:text-6xl">Thank you, {name.split(" ")[0]}.</h1>
          <p className="mt-6 text-muted-foreground">
            Your booking reference is <span className="font-mono text-foreground">{submitted.id}</span>.
            We'll be in touch within 24 hours to confirm.
          </p>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 md:px-10 pt-32 md:pt-40 pb-10">
        <p className="eyebrow">Booking</p>
        <h1 className="mt-4 text-4xl md:text-6xl max-w-3xl">Reserve your session.</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          All prices listed in Indian Rupees (INR). A 25% retainer secures your date.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-20 grid md:grid-cols-12 gap-10">
        {/* Plans */}
        <div className="md:col-span-5">
          <p className="eyebrow mb-4">Choose a plan</p>
          <div className="space-y-3">
            {plans.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlanId(p.id)}
                className={`w-full text-left border p-5 transition-colors ${
                  planId === p.id ? "border-foreground bg-secondary" : "border-border hover:border-foreground/40"
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-2xl">{p.name}</span>
                  <span className="font-display text-xl">{formatInr(p.priceInr)}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {p.duration} · {p.deliverables}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-7 space-y-6">
          <p className="eyebrow">Your details</p>
          <div className="grid md:grid-cols-2 gap-6">
            <input className="field" placeholder="Full name *" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="field" type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="field" type="tel" placeholder="Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <input className="field" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <textarea
            className="field min-h-[120px]"
            placeholder="Tell us about your session…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {selected && (
            <div className="border-t border-border pt-6 flex items-baseline justify-between">
              <span className="eyebrow">Total</span>
              <span className="font-display text-3xl">{formatInr(selected.priceInr)}</span>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" className="btn-primary">Confirm booking</button>
        </form>
      </section>
    </SiteLayout>
  );
}