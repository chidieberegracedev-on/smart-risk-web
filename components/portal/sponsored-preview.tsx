import { Logo } from "@/components/ui/logo";

// A real sponsored-post card preview — the same shape the ad takes in the app
// feed. Used in Create → Review and on the campaign detail page.
export function SponsoredPreview({
  headline,
  body,
  destinationUrl,
  ctaLabel,
  mediaUrl,
  advertiser = "Your business",
}: {
  headline?: string | null;
  body?: string | null;
  destinationUrl?: string | null;
  ctaLabel?: string | null;
  mediaUrl?: string | null;
  advertiser?: string;
}) {
  let host = "";
  try {
    if (destinationUrl) host = new URL(destinationUrl).host.replace(/^www\./, "");
  } catch {
    host = "";
  }

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-portal-line bg-portal-surface shadow-portal-soft">
      {/* header */}
      <div className="flex items-center gap-3 p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-portal-elevated">
          <Logo showWord={false} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-portal-text">{advertiser}</p>
          <p className="text-xs text-portal-faint">Sponsored</p>
        </div>
      </div>

      {/* body copy */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed text-portal-text">
          {body || "Your ad copy will appear here."}
        </p>
      </div>

      {/* media */}
      <div className="relative aspect-[4/3] bg-portal-elevated">
        {mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-portal-faint">Your image</span>
          </div>
        )}
      </div>

      {/* CTA bar */}
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          {host && <p className="truncate text-xs text-portal-faint">{host}</p>}
          <p className="truncate text-sm font-medium text-portal-text">
            {headline || "Your headline"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-portal-accent px-3.5 py-1.5 text-xs font-medium text-white">
          {ctaLabel || "Learn more"}
        </span>
      </div>
    </div>
  );
}
