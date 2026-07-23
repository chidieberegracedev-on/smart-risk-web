// Minimal PostgREST client using the service-role key. Server-only.
// Deliberately dependency-free: plain fetch against the Supabase REST API.
// NEVER import this from a client component — envs are not NEXT_PUBLIC_.

const URL_ENV = "SUPABASE_URL";
const KEY_ENV = "SUPABASE_SERVICE_KEY";

export function supabaseConfigured(): boolean {
  return Boolean(process.env[URL_ENV] && process.env[KEY_ENV]);
}

function base(): { url: string; key: string } {
  const url = process.env[URL_ENV];
  const key = process.env[KEY_ENV];
  if (!url || !key) {
    throw new Error(
      `Supabase is not configured (${URL_ENV} / ${KEY_ENV} missing)`
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

function headers(key: string, extra?: Record<string, string>) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/** SELECT rows. `query` is a PostgREST filter string, e.g. "id=eq.123&select=*". */
export async function sbSelect<T>(table: string, query: string): Promise<T[]> {
  const { url, key } = base();
  const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: headers(key),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`supabase select ${table} failed: ${res.status}`);
  }
  return (await res.json()) as T[];
}

export class UniqueViolationError extends Error {}

/** INSERT a row. Throws UniqueViolationError on duplicate-key conflicts. */
export async function sbInsert(
  table: string,
  row: Record<string, unknown>
): Promise<void> {
  const { url, key } = base();
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: headers(key, { Prefer: "return=minimal" }),
    body: JSON.stringify(row),
  });
  if (res.status === 409) {
    throw new UniqueViolationError(`duplicate insert into ${table}`);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    // PostgREST reports unique violations as SQLSTATE 23505 in the body too.
    if (body.includes("23505")) throw new UniqueViolationError(body);
    throw new Error(`supabase insert ${table} failed: ${res.status} ${body}`);
  }
}

/** Call a Postgres function (RPC). Returns the parsed JSON result. */
export async function sbRpc<T>(
  fn: string,
  args: Record<string, unknown>
): Promise<T> {
  const { url, key } = base();
  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: headers(key),
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`supabase rpc ${fn} failed: ${res.status} ${body}`);
  }
  return (await res.json()) as T;
}

/** UPDATE rows matching a PostgREST filter string, e.g. "id=eq.123". */
export async function sbUpdate(
  table: string,
  match: string,
  patch: Record<string, unknown>
): Promise<void> {
  const { url, key } = base();
  const res = await fetch(`${url}/rest/v1/${table}?${match}`, {
    method: "PATCH",
    headers: headers(key, { Prefer: "return=minimal" }),
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    throw new Error(`supabase update ${table} failed: ${res.status}`);
  }
}
