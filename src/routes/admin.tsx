import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import {
  getPlans,
  getCustomers,
  getOrders,
  upsertPlan,
  deletePlan,
  updateOrderStatus,
  deleteOrder,
  formatInr,
  type Plan,
  type Order,
} from "@/lib/store";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [
      { title: "Admin — Vision Studio" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Tab = "orders" | "customers" | "plans";

function Admin() {
  const [tab, setTab] = useState<Tab>("orders");
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  // hydration guard — localStorage only on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-7xl px-6 md:px-10 pt-32 pb-20">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-4 text-4xl md:text-6xl">Loading…</h1>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 md:px-10 pt-32 md:pt-40 pb-10">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-4 text-4xl md:text-6xl">Studio dashboard.</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Local-only backend. Plans, customers and orders are stored in this browser.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-20">
        <div className="flex gap-6 border-b border-border">
          {(["orders", "customers", "plans"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`eyebrow py-3 -mb-px border-b-2 ${
                tab === t ? "border-foreground text-foreground" : "border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8" key={tick}>
          {tab === "orders" && <OrdersPanel onChange={refresh} />}
          {tab === "customers" && <CustomersPanel />}
          {tab === "plans" && <PlansPanel onChange={refresh} />}
        </div>
      </section>
    </SiteLayout>
  );
}

function OrdersPanel({ onChange }: { onChange: () => void }) {
  const orders = getOrders();
  if (orders.length === 0) return <p className="text-muted-foreground">No orders yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left eyebrow border-b border-border">
            <th className="py-3 pr-4">Ref</th>
            <th className="py-3 pr-4">Customer</th>
            <th className="py-3 pr-4">Plan</th>
            <th className="py-3 pr-4">Date</th>
            <th className="py-3 pr-4">Amount</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border/60">
              <td className="py-3 pr-4 font-mono text-xs">{o.id}</td>
              <td className="py-3 pr-4">
                <div>{o.customerName}</div>
                <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
              </td>
              <td className="py-3 pr-4">{o.planName}</td>
              <td className="py-3 pr-4">{o.sessionDate}</td>
              <td className="py-3 pr-4">{formatInr(o.amountInr)}</td>
              <td className="py-3 pr-4">
                <select
                  value={o.status}
                  onChange={(e) => {
                    updateOrderStatus(o.id, e.target.value as Order["status"]);
                    onChange();
                  }}
                  className="bg-transparent border border-border px-2 py-1 text-xs"
                >
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
              <td className="py-3">
                <button
                  onClick={() => {
                    if (confirm("Delete this order?")) {
                      deleteOrder(o.id);
                      onChange();
                    }
                  }}
                  className="text-xs text-destructive"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomersPanel() {
  const customers = getCustomers();
  if (customers.length === 0) return <p className="text-muted-foreground">No customers yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left eyebrow border-b border-border">
            <th className="py-3 pr-4">Name</th>
            <th className="py-3 pr-4">Email</th>
            <th className="py-3 pr-4">Phone</th>
            <th className="py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-b border-border/60">
              <td className="py-3 pr-4">{c.name}</td>
              <td className="py-3 pr-4">{c.email}</td>
              <td className="py-3 pr-4">{c.phone}</td>
              <td className="py-3 text-xs text-muted-foreground">
                {new Date(c.createdAt).toLocaleDateString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlansPanel({ onChange }: { onChange: () => void }) {
  const plans = getPlans();
  const [editing, setEditing] = useState<Plan | null>(null);
  const blank: Plan = { id: "", name: "", description: "", priceInr: 0, duration: "", deliverables: "" };
  const [draft, setDraft] = useState<Plan>(blank);

  function startEdit(p: Plan) {
    setEditing(p);
    setDraft(p);
  }
  function startNew() {
    setEditing(blank);
    setDraft({ ...blank, id: "plan-" + Math.random().toString(36).slice(2, 7) });
  }
  function save() {
    if (!draft.id || !draft.name) return;
    upsertPlan({ ...draft, priceInr: Number(draft.priceInr) || 0 });
    setEditing(null);
    onChange();
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="eyebrow">Plans ({plans.length})</p>
          <button onClick={startNew} className="text-xs underline">+ New plan</button>
        </div>
        <div className="space-y-3">
          {plans.map((p) => (
            <div key={p.id} className="border border-border p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-xl">{p.name}</span>
                <span className="font-display">{formatInr(p.priceInr)}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-3 flex gap-3 text-xs">
                <button onClick={() => startEdit(p)} className="underline">Edit</button>
                <button
                  onClick={() => {
                    if (confirm(`Delete plan "${p.name}"?`)) {
                      deletePlan(p.id);
                      onChange();
                    }
                  }}
                  className="underline text-destructive"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        {editing ? (
          <div className="border border-border p-5 space-y-4 sticky top-24">
            <p className="eyebrow">{plans.find((p) => p.id === editing.id) ? "Edit plan" : "New plan"}</p>
            <input className="field" placeholder="Plan ID (slug)" value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} />
            <input className="field" placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <input className="field" type="number" placeholder="Price (INR)" value={draft.priceInr} onChange={(e) => setDraft({ ...draft, priceInr: Number(e.target.value) })} />
            <input className="field" placeholder="Duration" value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} />
            <input className="field" placeholder="Deliverables" value={draft.deliverables} onChange={(e) => setDraft({ ...draft, deliverables: e.target.value })} />
            <textarea className="field min-h-[80px]" placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            <div className="flex gap-3">
              <button onClick={save} className="btn-primary">Save</button>
              <button onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Select a plan to edit, or create a new one.</p>
        )}
      </div>
    </div>
  );
}