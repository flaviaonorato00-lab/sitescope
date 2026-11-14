import prisma from "@/lib/prisma";
import { runPageSpeed, type Strategy } from "@/lib/pagespeed";
import { normalizeUrl } from "@/lib/url";

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
    scores: pagespeed.scores,
  });
}
