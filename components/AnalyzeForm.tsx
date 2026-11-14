"use client";

import { useState } from "react";
import ScoreCircle from "@/components/ScoreCircle";

type Scores = {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
};

type AnalyzeResult = {
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
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="example.com"
          className="flex-1 rounded-md border border-zinc-300 px-4 py-2"
        />
        <select
          value={strategy}
          onChange={(event) => setStrategy(event.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2"
        >
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-6 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {loading && (
        <p className="mt-6 text-zinc-600">
          This can take up to 15 seconds...
        </p>
      )}

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {result && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">{result.url}</h2>
          {result.cached && (
            <p className="text-sm text-zinc-500">
              Recent result, analyzed less than an hour ago.
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-8">
            <ScoreCircle label="Performance" value={result.scores.performance} />
            <ScoreCircle label="Accessibility" value={result.scores.accessibility} />
            <ScoreCircle label="SEO" value={result.scores.seo} />
            <ScoreCircle label="Best practices" value={result.scores.bestPractices} />
          </div>
        </section>
      )}
    </div>
  );
}
