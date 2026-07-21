import { cn } from "@/lib/cn";

// Code-built wordmark + monogram. The mark is a stylised "shield / arc"
// suggesting protection around a rising path — protective layer, not a promise.
export function Logo({
  className,
  showWord = true,
}: {
  className?: string;
  showWord?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M13 1.5 3 5.2v7.1c0 6.2 4.2 9.9 10 12.2 5.8-2.3 10-6 10-12.2V5.2L13 1.5Z"
          stroke="#5B8CFF"
          strokeWidth="1.4"
          fill="rgba(91,140,255,0.08)"
          strokeLinejoin="round"
        />
        <path
          d="M8 14.5l3.2-3.4 2.4 2.2L18 8"
          stroke="#3FB97F"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWord && (
        <span className="font-display text-[15px] font-semibold tracking-tight text-text">
          Smart Risk
        </span>
      )}
    </span>
  );
}
