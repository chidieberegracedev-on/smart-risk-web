import { paystack } from "./paystack";
import { flutterwave } from "./flutterwave";
import { stripe } from "./stripe";
import type { PaymentAdapter, ProviderId, ProviderRow } from "./types";
import { sbSelect } from "@/lib/supabase-admin";

// Adding a provider later = one new adapter file + a row in payment_providers.
const adapters: Record<ProviderId, PaymentAdapter> = {
  paystack,
  flutterwave,
  stripe,
};

export function getAdapter(id: string): PaymentAdapter | null {
  return (adapters as Record<string, PaymentAdapter>)[id] ?? null;
}

/** The active provider row (service-role read; secrets stay server-side). */
export async function getActiveProvider(): Promise<ProviderRow | null> {
  const rows = await sbSelect<ProviderRow>(
    "payment_providers",
    "is_active=eq.true&select=*&limit=1"
  );
  return rows[0] ?? null;
}

export async function getProvider(id: string): Promise<ProviderRow | null> {
  const rows = await sbSelect<ProviderRow>(
    "payment_providers",
    `id=eq.${encodeURIComponent(id)}&select=*&limit=1`
  );
  return rows[0] ?? null;
}
