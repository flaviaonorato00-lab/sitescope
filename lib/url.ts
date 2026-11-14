export type NormalizedUrl = {
  url: string;
  hostname: string;
};

export type NormalizeResult =
  | { ok: true; value: NormalizedUrl }
  | { ok: false; error: string };

const TRACKING_PARAMS = ["fbclid", "gclid"];

function isPrivateHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.startsWith("[") ||
    /^127\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
    /^169\.254\./.test(hostname) ||
    /^0\./.test(hostname)
  );
}

export function normalizeUrl(input: string): NormalizeResult {
  let cleaned = input.trim();

  if (cleaned === "") {
    return { ok: false, error: "Enter a website address." };
  }

  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = "https://" + cleaned;
  }

  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    return { ok: false, error: "This is not a valid website address." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http and https addresses are allowed." };
  }

  const hostname = parsed.hostname.replace(/^www\./, "");

  if (!hostname.includes(".") || isPrivateHost(hostname)) {
    return { ok: false, error: "Enter a public website address." };
  }

  for (const key of [...parsed.searchParams.keys()]) {
    if (key.startsWith("utm_") || TRACKING_PARAMS.includes(key)) {
      parsed.searchParams.delete(key);
    }
  }

  const port = parsed.port ? `:${parsed.port}` : "";
  const path = parsed.pathname.replace(/\/+$/, "");
  const query = parsed.searchParams.toString();

  return {
    ok: true,
    value: {
      url: `https://${hostname}${port}${path}${query ? `?${query}` : ""}`,
      hostname,
    },
  };
}
