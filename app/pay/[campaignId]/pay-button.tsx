"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// The single checkout action. POSTs to our API (which owns the amount and the
// provider call) and redirects the browser to the returned provider URL.
export function PayButton({ campaignId }: { campaignId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  const start = async () => {
    setState("loading");
    try {
      const res = await fetch("/api/pay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId }),
      });
      const json = (await res.json()) as { url?: string };
      if (!res.ok || !json.url) throw new Error("checkout failed");
      window.location.href = json.url;
    } catch {
      setState("error");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <motion.button
        type="button"
        onClick={start}
        disabled={state === "loading"}
        whileTap={{ scale: 0.98 }}
        className="inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-full bg-accent px-7 text-base font-medium text-white shadow-[0_0_0_1px_rgba(91,140,255,0.35),0_8px_30px_-8px_rgba(91,140,255,0.5)] transition-colors duration-200 hover:bg-[#6E9BFF] disabled:opacity-60"
      >
        {state === "loading" ? "Preparing secure checkout…" : "Continue to secure payment"}
      </motion.button>
      {state === "error" && (
        <p className="text-center text-sm text-danger">
          Something went wrong starting the payment. Please try again.
        </p>
      )}
    </div>
  );
}
