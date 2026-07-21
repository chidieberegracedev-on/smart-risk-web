import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { sbSelect, supabaseConfigured } from "@/lib/supabase-admin";
import { getActiveProvider } from "@/lib/payments";
import type { Campaign } from "@/lib/payments/types";
import { PayButton } from "./pay-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

const PAYABLE = ["approved_payment_required", "payment_processing"];

const PROVIDER_NAMES: Record<string, string> = {
  paystack: "Paystack",
  flutterwave: "Flutterwave",
  stripe: "Stripe",
};

// Checkout review. Everything shown comes from the DB server-side — never
// from query params. Minimal chrome: logo, summary card, one button.
export default async function PayPage({
  params,
}: {
  params: { campaignId: string };
}) {
  let campaign: Campaign | null = null;
  let providerName: string | null = null;
  let configured = supabaseConfigured();

  if (configured) {
    try {
      const rows = await sbSelect<Campaign>(
        "ad_campaigns",
        `id=eq.${encodeURIComponent(params.campaignId)}&select=*&limit=1`
      );
      campaign = rows[0] ?? null;
      const provider = await getActiveProvider();
      providerName = provider ? (PROVIDER_NAMES[provider.id] ?? provider.id) : null;
    } catch {
      configured = false;
    }
  }

  const amount = campaign?.price_amount ?? campaign?.quoted_price ?? null;
  const currency = campaign?.price_currency ?? campaign?.quoted_currency ?? null;
  const payable =
    campaign != null &&
    PAYABLE.includes(campaign.status) &&
    amount != null &&
    amount > 0 &&
    currency != null;

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center px-6 pb-16 pt-28">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Smart Risk Assistant home">
            <Logo />
          </Link>
        </div>

        {!configured ? (
          <HonestState
            title="Payments aren't available yet"
            body="Checkout isn't configured on this environment. Please try again later or contact us."
          />
        ) : !campaign ? (
          <HonestState
            title="Campaign not found"
            body="We couldn't find this campaign. Check the link from your approval email, or contact us."
          />
        ) : !payable ? (
          <HonestState
            title="This campaign isn't awaiting payment"
            body={
              campaign.status === "active"
                ? "This campaign is already live — no payment is due."
                : "This campaign isn't approved for payment yet. You'll get a payment link once it's reviewed and approved."
            }
          />
        ) : (
          <div className="panel-ring rounded-3xl border border-line-strong bg-panel-2/90 p-7">
            <p className="eyebrow">Campaign checkout</p>
            <h1 className="mt-3 text-xl font-semibold text-text">
              {campaign.name ?? "Advertising campaign"}
            </h1>

            {/* Summary — only fields that exist */}
            <dl className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5">
              {campaign.audience && (
                <SummaryRow label="Audience" value={String(campaign.audience)} />
              )}
              {campaign.duration_days != null && (
                <SummaryRow
                  label="Duration"
                  value={`${campaign.duration_days} days`}
                />
              )}
              {campaign.max_impressions != null && (
                <SummaryRow
                  label="Max impressions"
                  value={Number(campaign.max_impressions).toLocaleString("en-US")}
                />
              )}
            </dl>

            {/* The amount — large, clear, from the DB */}
            <div className="mt-5 rounded-2xl border border-accent/25 bg-[linear-gradient(180deg,rgba(91,140,255,0.10),transparent)] p-5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-accent">
                Amount due
              </p>
              <p className="data mt-1 text-4xl font-semibold text-text">
                {Number(amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="text-base font-medium text-muted">
                  {currency}
                </span>
              </p>
            </div>

            <div className="mt-6">
              <PayButton campaignId={campaign.id} />
            </div>

            <p className="mt-5 text-center text-xs leading-relaxed text-faint">
              {providerName
                ? `Payments are processed securely by ${providerName}. `
                : "Payments are processed securely by our payment partner. "}
              We never see or store your card details.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="data text-sm text-text">{value}</dd>
    </div>
  );
}

function HonestState({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel-ring rounded-3xl border border-line-strong bg-panel-2/90 p-7 text-center">
      <h1 className="text-xl font-semibold text-text">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
      <Link
        href="/advertise"
        className="mt-6 inline-flex text-sm text-accent hover:underline"
      >
        Back to Advertise
      </Link>
    </div>
  );
}
