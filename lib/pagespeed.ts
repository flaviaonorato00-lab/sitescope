export type Strategy = "mobile" | "desktop";

export type Scores = {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
};

export type PageSpeedResult =
  | { ok: true; scores: Scores }
  | { ok: false; error: string };

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

function toPercent(score: number | undefined): number {
  return Math.round((score ?? 0) * 100);
}

export async function runPageSpeed(
  url: string,
  strategy: Strategy,
): Promise<PageSpeedResult> {
  const params = new URLSearchParams({
    url,
    strategy,
    key: process.env.PAGESPEED_API_KEY ?? "",
  });
  for (const category of ["performance", "accessibility", "seo", "best-practices"]) {
    params.append("category", category);
  }

  let response: Response;
  try {
    response = await fetch(`${ENDPOINT}?${params}`, {
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    return { ok: false, error: "Google took too long to answer. Try again." };
  }

  if (!response.ok) {
    return { ok: false, error: "Could not analyze this website." };
  }

  const data = await response.json();
  const categories = data.lighthouseResult?.categories;

  if (!categories) {
    return { ok: false, error: "Google returned no results for this website." };
  }

  return {
    ok: true,
    scores: {
      performance: toPercent(categories.performance?.score),
      accessibility: toPercent(categories.accessibility?.score),
      seo: toPercent(categories.seo?.score),
      bestPractices: toPercent(categories["best-practices"]?.score),
    },
  };
}
