// Lightweight client-side "backend" backed by localStorage.
// Persists plans, customers and orders so the zip runs without any server.

export type Plan = {
  id: string;
  name: string;
  description: string;
  priceInr: number; // in rupees
  duration: string;
  deliverables: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planId: string;
  planName: string;
  amountInr: number;
  sessionDate: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
};

const KEYS = {
  plans: "vision.plans",
  customers: "vision.customers",
  orders: "vision.orders",
} as const;

const DEFAULT_PLANS: Plan[] = [
  {
    id: "Portraits",
    name: "Portraits",
    description: "Potrait photography as you need.",
    priceInr: 2000,
    duration: "For 12 Hours",
    deliverables: "100+ photos",
  },
  {
    id: "Events",
    name: "Events Session",
    description: "Events on your location.",
    priceInr: 5000,
    duration: "For 1 Day",
    deliverables: "200+ photos",
  },
  {
    id: "Photoshoots",
    name: "Personal Photoshoots",
    description: "Bike, Car or any other photoshoots.",
    priceInr: 2000,
    duration: "For 12 hours",
    deliverables: "60+ edited photos ",
  },
  {
    id: "Drone",
    name: "Drone for Rent",
    description: "Drone for rent at best price.",
    priceInr: 1500,
    duration: "For 1 day",
    deliverables: "35+ edited photos",
  },
  {
    id: "Camera",
    name: "Camera for rent",
    description: "Camera for rent at best price.",
    priceInr: 1000,
    duration: "For 1 day",
    deliverables: "50+ edited photos",
  },
];

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Plans -----------------------------------------------------------
export function getPlans(): Plan[] {
  const existing = read<Plan[]>(KEYS.plans, []);
  if (existing.length === 0) {
    write(KEYS.plans, DEFAULT_PLANS);
    return DEFAULT_PLANS;
  }
  return existing;
}

export function savePlans(plans: Plan[]) {
  write(KEYS.plans, plans);
}

export function upsertPlan(plan: Plan) {
  const plans = getPlans();
  const idx = plans.findIndex((p) => p.id === plan.id);
  if (idx >= 0) plans[idx] = plan;
  else plans.push(plan);
  savePlans(plans);
  return plan;
}

export function deletePlan(id: string) {
  savePlans(getPlans().filter((p) => p.id !== id));
}

// Customers -------------------------------------------------------
export function getCustomers(): Customer[] {
  return read<Customer[]>(KEYS.customers, []);
}

export function findOrCreateCustomer(input: { name: string; email: string; phone: string }): Customer {
  const customers = getCustomers();
  const existing = customers.find((c) => c.email.toLowerCase() === input.email.toLowerCase());
  if (existing) {
    existing.name = input.name;
    existing.phone = input.phone;
    write(KEYS.customers, customers);
    return existing;
  }
  const customer: Customer = {
    id: uid(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    createdAt: new Date().toISOString(),
  };
  customers.push(customer);
  write(KEYS.customers, customers);
  return customer;
}

// Orders ----------------------------------------------------------
export function getOrders(): Order[] {
  return read<Order[]>(KEYS.orders, []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createOrder(input: {
  customer: { name: string; email: string; phone: string };
  planId: string;
  sessionDate: string;
  notes: string;
}): Order {
  const plan = getPlans().find((p) => p.id === input.planId);
  if (!plan) throw new Error("Plan not found");
  const customer = findOrCreateCustomer(input.customer);
  const order: Order = {
    id: uid(),
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    planId: plan.id,
    planName: plan.name,
    amountInr: plan.priceInr,
    sessionDate: input.sessionDate,
    notes: input.notes,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const orders = read<Order[]>(KEYS.orders, []);
  orders.push(order);
  write(KEYS.orders, orders);
  return order;
}

export function updateOrderStatus(id: string, status: Order["status"]) {
  const orders = read<Order[]>(KEYS.orders, []);
  const o = orders.find((x) => x.id === id);
  if (o) {
    o.status = status;
    write(KEYS.orders, orders);
  }
}

export function deleteOrder(id: string) {
  write(KEYS.orders, read<Order[]>(KEYS.orders, []).filter((o) => o.id !== id));
}