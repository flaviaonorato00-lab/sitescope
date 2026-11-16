"use client";

import Link from "next/link";
import { useState } from "react";
import ScoreCircle from "@/components/ScoreCircle";

type Scores = {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
};

type AnalyzeResult = {
  siteId: string;
  url: string;
  cached: boolean;
  scores: Scores;
};

export default function AnalyzeForm() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, strategy }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
      } else {
        setResult(data);
        setUrl("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="example.com"
            className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        <div className="mt-3 inline-flex rounded-lg bg-zinc-100 p-1 text-sm">
          {["mobile", "desktop"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStrategy(option)}
              className={`rounded-md px-4 py-1 capitalize transition ${
                strategy === option
                  ? "bg-white font-medium text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </form>

      {loading && (
        <div className="mt-8 flex items-center justify-center gap-3 text-zinc-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600" />
          <p>Analyzing the website. This can take up to 30 seconds...</p>
        </div>
      )}

      {error && (
        <p className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </p>
      )}

      {result && (
        <section className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold">{result.url}</h2>
            <Link
              href={`/report/${result.siteId}`}
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              View history →
            </Link>
          </div>
          {result.cached && (
            <p className="mt-1 text-sm text-zinc-500">
              Recent result, analyzed less than an hour ago.
            </p>
          )}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ScoreCircle label="Performance" value={result.scores.performance} />
            <ScoreCircle label="Accessibility" value={result.scores.accessibility} />
            <ScoreCircle label="SEO" value={result.scores.seo} />
            <ScoreCircle label="Best practices" value={result.scores.bestPractices} />
          </div>
          <p className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-zinc-500">
            <span><span className="text-green-600">●</span> 90-100 good</span>
            <span><span className="text-orange-500">●</span> 50-89 needs improvement</span>
            <span><span className="text-red-600">●</span> 0-49 poor</span>
          </p>
        </section>
      )}
    </div>
  );
}
