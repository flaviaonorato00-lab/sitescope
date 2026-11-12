export type NormalizedUrl = {
  url: string;
  hostname: string;
};

export type NormalizeResult =
  | { ok: true; value: NormalizedUrl }
  | { ok: false; error: string };

// Parametri che servono solo al tracciamento e non cambiano la pagina.
const TRACKING_PARAMS = ["fbclid", "gclid"];

// Dice se un hostname punta al computer locale o a una rete privata.
function isPrivateHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.startsWith("[") || // indirizzi IPv6, es. [::1]
    /^127\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
    /^169\.254\./.test(hostname) ||
    /^0\./.test(hostname)
  );
}

export function normalizeUrl(input: string): NormalizeResult {
  // 1. Togli gli spazi all'inizio e alla fine
  let cleaned = input.trim();

  if (cleaned === "") {
    return { ok: false, error: "Enter a website address." };
  }

  // 2. Se manca il protocollo, aggiungi https://
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = "https://" + cleaned;
  }

  // 3. Prova a leggere l'indirizzo; se non è valido, new URL lancia un errore
  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    return { ok: false, error: "This is not a valid website address." };
  }

  // 4. Accetta solo http e https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http and https addresses are allowed." };
  }

  // 5. Rifiuta indirizzi locali o privati, e testi senza un punto (es. "ciao")
  const hostname = parsed.hostname.replace(/^www\./, "");

  if (!hostname.includes(".") || isPrivateHost(hostname)) {
    return { ok: false, error: "Enter a public website address." };
  }

  // 6. Costruisci l'URL normalizzato
  for (const key of [...parsed.searchParams.keys()]) {
    if (key.startsWith("utm_") || TRACKING_PARAMS.includes(key)) {
      parsed.searchParams.delete(key);
    }
  }

  const port = parsed.port ? `:${parsed.port}` : "";
  const path = parsed.pathname.replace(/\/+$/, ""); // toglie le "/" finali
  const query = parsed.searchParams.toString();

  return {
    ok: true,
    value: {
      url: `https://${hostname}${port}${path}${query ? `?${query}` : ""}`,
      hostname,
    },
  };
}
