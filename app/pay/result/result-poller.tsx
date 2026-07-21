"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Polls /api/pay/status until the webhook's effect is visible. Success is
// shown ONLY when the backend reports the campaign active — never because the
// browser came back from the provider.

const POLL_MS = 3000;
const MAX_POLLS = 40; // ≈ 2 minutes

type Phase = "confirming" | "success" | "failed" | "timeout" | "invalid";

export function ResultPoller({ sessionId }: { sessionId: string | null }) {
  const [phase, setPhase] = useState<Phase>(sessionId ? "confirming" : "invalid");
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const polls = useRef(0);

  useEffect(() => {
    if (!sessionId) return;
    let stopped = false;

    const tick = async () => {
      if (stopped) return;
      polls.current += 1;
      try {
        const res = await fetch(
          `/api/pay/status?session=${encodeURIComponent(sessionId)}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const json = (await res.json()) as {
            sessionStatus?: string;
            campaignStatus?: string | null;
            campaignId?: string | null;
          };
          if (json.campaignId) setCampaignId(json.campaignId);
          if (json.campaignStatus === "active") {
            setPhase("success");
            return;
          }
          if (json.sessionStatus === "failed") {
            setPhase("failed");
            return;
          }
        } else if (res.status === 404 || res.status === 400) {
          setPhase("invalid");
          return;
        }
      } catch {
        // transient network error — keep polling
      }
      if (polls.current >= MAX_POLLS) {
        setPhase("timeout");
        return;
      }
      setTimeout(tick, POLL_MS);
    };

    tick();
    return () => {
      stopped = true;
    };
  }, [sessionId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="panel-ring w-full max-w-md rounded-3xl border border-line-strong bg-panel-2/90 p-8 text-center"
    >
      {phase === "confirming" && (
        <>
          <Spinner />
          <h1 className="mt-5 text-xl font-semibold text-text">
            Confirming your payment…
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            We're waiting for your payment provider to confirm the transaction.
            This usually takes a few seconds — you can keep this page open.
          </p>
        </>
      )}

      {phase === "success" && (
        <>
          <StatusDot tone="#3FB97F" />
          <h1 className="mt-5 text-xl font-semibold text-text">
            Payment confirmed — your campaign is live
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Your campaign has been verified and activated. You can manage it and
            track performance from your advertiser account. A receipt is on its
            way to your email.
          </p>
          <Link href="/advertise" className="mt-6 inline-flex text-sm text-accent hover:underline">
            Back to Advertise
          </Link>
        </>
      )}

      {phase === "failed" && (
        <>
          <StatusDot tone="#E5484D" />
          <h1 className="mt-5 text-xl font-semibold text-text">
            Payment couldn't be verified
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The payment didn't complete or didn't match what was due, so the
            campaign wasn't activated. No charge stands without verification —
            you can safely try again.
          </p>
          <p className="mt-6">
            <Link
              href={campaignId ? `/pay/${campaignId}` : "/advertise"}
              className="text-sm text-accent hover:underline"
            >
              Try again
            </Link>
          </p>
        </>
      )}

      {phase === "timeout" && (
        <>
          <StatusDot tone="#E0A63C" />
          <h1 className="mt-5 text-xl font-semibold text-text">
            Payment is taking longer to confirm
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Your campaign will activate automatically once the payment is
            verified — check the app shortly. If it doesn't activate within a
            few hours, contact us with your payment reference.
          </p>
        </>
      )}

      {phase === "invalid" && (
        <>
          <StatusDot tone="#E0A63C" />
          <h1 className="mt-5 text-xl font-semibold text-text">
            We couldn't find that payment session
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The link may be incomplete. If you just paid, your campaign will
            still activate automatically once the payment is verified.
          </p>
        </>
      )}
    </motion.div>
  );
}

function Spinner() {
  return (
    <span className="mx-auto flex h-12 w-12 items-center justify-center">
      <motion.span
        className="h-10 w-10 rounded-full border-2 border-line-strong border-t-accent"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      />
    </span>
  );
}

function StatusDot({ tone }: { tone: string }) {
  return (
    <span
      className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
      style={{ backgroundColor: `${tone}1a`, boxShadow: `inset 0 0 0 1px ${tone}55` }}
    >
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tone }} />
    </span>
  );
}

