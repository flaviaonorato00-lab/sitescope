import prisma from "@/lib/prisma";
import { runPageSpeed, type Strategy } from "@/lib/pagespeed";
import { normalizeUrl } from "@/lib/url";

export const maxDuration = 60;

const CACHE_MINUTES = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.url !== "string") {
    return Response.json(
      { error: 'Send a JSON body like { "url": "example.com" }.' },
      { status: 400 },
    );
  }

  const strategy: Strategy = body.strategy === "desktop" ? "desktop" : "mobile";

  const result = normalizeUrl(body.url);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  const { url, hostname } = result.value;

  const since = new Date(Date.now() - CACHE_MINUTES * 60 * 1000);

  const recentAudit = await prisma.audit.findFirst({
    where: { strategy, createdAt: { gte: since }, site: { url } },
    orderBy: { createdAt: "desc" },
  });

  if (recentAudit) {
    return Response.json({
      siteId: recentAudit.siteId,
      auditId: recentAudit.id,
      url,
      strategy,
      cached: true,
      scores: {
        performance: recentAudit.performance,
        accessibility: recentAudit.accessibility,
        seo: recentAudit.seo,
        bestPractices: recentAudit.bestPractices,
      },
    });
  }

  const pagespeed = await runPageSpeed(url, strategy);

  if (!pagespeed.ok) {
    return Response.json({ error: pagespeed.error }, { status: 502 });
  }

  const site = await prisma.site.upsert({
    where: { url },
    update: {},
    create: { url, hostname },
  });

  const audit = await prisma.audit.create({
    data: { siteId: site.id, strategy, ...pagespeed.scores },
  });

  return Response.json({
    siteId: site.id,
    auditId: audit.id,
    url: site.url,
    strategy,
    cached: false,
    scores: pagespeed.scores,
  });
}
