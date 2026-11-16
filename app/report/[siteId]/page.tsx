import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ScoreChart from "@/components/ScoreChart";
import prisma from "@/lib/prisma";

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
      <h1 className="text-3xl font-bold">{site.hostname}</h1>
      <p className="mt-2 text-zinc-600">
        {site.audits.length} {site.audits.length === 1 ? "analysis" : "analyses"} so far
      </p>

      <div className="mt-8">
        <ScoreChart
          audits={[...site.audits].reverse().map((audit) => ({
            id: audit.id,
            strategy: audit.strategy,
            createdAt: audit.createdAt.toISOString(),
            performance: audit.performance,
            accessibility: audit.accessibility,
            seo: audit.seo,
            bestPractices: audit.bestPractices,
          }))}
        />
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500">
            <th className="py-2">Date</th>
            <th className="py-2">Device</th>
            <th className="py-2">Performance</th>
            <th className="py-2">Accessibility</th>
            <th className="py-2">SEO</th>
            <th className="py-2">Best practices</th>
          </tr>
        </thead>
        <tbody>
          {site.audits.map((audit) => (
            <tr key={audit.id} className="border-b border-zinc-100">
              <td className="py-2">
                {audit.createdAt.toLocaleString("en-GB", { timeZone: "UTC" })}
              </td>
              <td className="py-2 capitalize">{audit.strategy}</td>
              <td className="py-2">{audit.performance}</td>
              <td className="py-2">{audit.accessibility}</td>
              <td className="py-2">{audit.seo}</td>
              <td className="py-2">{audit.bestPractices}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function ReportPage({ params }: ReportPageProps) {
  return (
    <main className="mx-auto w-full max-w-5xl p-8">
      <Link href="/" className="text-sm text-zinc-600 hover:text-black">
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
