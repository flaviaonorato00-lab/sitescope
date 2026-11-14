import { normalizeUrl } from "@/lib/url";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.url !== "string") {
    return Response.json(
      { error: 'Send a JSON body like { "url": "example.com" }.' },
      { status: 400 },
    );
  }

  const result = normalizeUrl(body.url);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json(result.value);
}
