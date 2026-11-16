import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { getScoreStyles } from "@/lib/score-styles";

type ReportPageProps = {
  params: Promise<{ siteId: string }>;
};

async function Report({ params }: ReportPageProps) {
  const { siteId } = await params;

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    include: { audits: { orderBy: { createdAt: "desc" } } },
  });

  if (!site) {
    notFound();
  }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{site.hostname}</h1>
      <p className="mt-2 text-zinc-600">
        {site.audits.length} {site.audits.length === 1 ? "analysis" : "analyses"} so far
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Device</th>
              <th className="px-4 py-3 font-medium">Performance</th>
              <th className="px-4 py-3 font-medium">Accessibility</th>
              <th className="px-4 py-3 font-medium">SEO</th>
              <th className="px-4 py-3 font-medium">Best practices</th>
            </tr>
          </thead>
          <tbody>
            {site.audits.map((audit) => (
              <tr key={audit.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3">
                  {audit.createdAt.toLocaleString("en-GB", { timeZone: "UTC" })}
                </td>
                <td className="px-4 py-3 capitalize">{audit.strategy}</td>
                {[audit.performance, audit.accessibility, audit.seo, audit.bestPractices].map(
                  (value, index) => (
                    <td key={index} className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-medium ${getScoreStyles(value).badge}`}
                      >
                        {value}
                      </span>
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function ReportPage({ params }: ReportPageProps) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Analyze another site
      </Link>
      <div className="mt-6">
        <Suspense fallback={<p className="text-zinc-600">Loading...</p>}>
          <Report params={params} />
        </Suspense>
      </div>
    </main>
  );
}
