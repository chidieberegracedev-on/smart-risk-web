import { createPublicKey, verify as cryptoVerify, X509Certificate } from "crypto";

// Server-side Firebase ID token verification — dependency-free.
// RS256 signature against Google's securetoken certs + the standard claim
// checks (aud = project id, iss = securetoken.google.com/<project>, exp/iat,
// non-empty sub). Privileged routes MUST call this and use only the returned
// uid — never a uid from the request body.
//
// FIREBASE_CERTS_URL is overridable so tests can point at a local key server;
// production uses Google's endpoint by default.

const DEFAULT_CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

const CLOCK_SKEW_S = 300;

let certCache: { certs: Record<string, string>; expires: number } | null = null;

async function getCerts(): Promise<Record<string, string>> {
  const now = Date.now();
  if (certCache && certCache.expires > now) return certCache.certs;

  const url = process.env.FIREBASE_CERTS_URL ?? DEFAULT_CERTS_URL;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`cert fetch failed: ${res.status}`);
  const certs = (await res.json()) as Record<string, string>;

  // Respect cache-control max-age, defaulting to 1 hour.
  const cc = res.headers.get("cache-control") ?? "";
  const maxAge = /max-age=(\d+)/.exec(cc)?.[1];
  certCache = {
    certs,
    expires: now + (maxAge ? Number(maxAge) : 3600) * 1000,
  };
  return certs;
}

function b64urlToBuf(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

export interface VerifiedToken {
  uid: string;
  email: string | null;
}

/** Returns the verified uid/email, or null for any invalid token. */
export async function verifyFirebaseToken(
  token: string | null | undefined
): Promise<VerifiedToken | null> {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId || !token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;

    const header = JSON.parse(b64urlToBuf(h).toString("utf8")) as {
      alg?: string;
      kid?: string;
    };
    if (header.alg !== "RS256" || !header.kid) return null;

    const certs = await getCerts();
    const pem = certs[header.kid];
    if (!pem) return null;
    const key = pem.includes("BEGIN CERTIFICATE")
      ? new X509Certificate(pem).publicKey
      : createPublicKey(pem);

    const ok = cryptoVerify(
      "RSA-SHA256",
      Buffer.from(`${h}.${p}`),
      key,
      b64urlToBuf(s)
    );
    if (!ok) return null;

    const claims = JSON.parse(b64urlToBuf(p).toString("utf8")) as {
      aud?: string;
      iss?: string;
      sub?: string;
      exp?: number;
      iat?: number;
      email?: string;
    };
    const now = Math.floor(Date.now() / 1000);
    if (claims.aud !== projectId) return null;
    if (claims.iss !== `https://securetoken.google.com/${projectId}`) return null;
    if (!claims.sub) return null;
    if (typeof claims.exp !== "number" || claims.exp <= now - CLOCK_SKEW_S) return null;
    if (typeof claims.iat === "number" && claims.iat > now + CLOCK_SKEW_S) return null;

    return { uid: claims.sub, email: claims.email ?? null };
  } catch {
    return null;
  }
}
