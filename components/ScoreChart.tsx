"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ChartAudit = {
  id: string;
  strategy: string;
  createdAt: string;
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
};

type ScoreChartProps = {
  audits: ChartAudit[];
};

export default function ScoreChart({ audits }: ScoreChartProps) {
  const [strategy, setStrategy] = useState("mobile");

  const data = audits
    .filter((audit) => audit.strategy === strategy)
    .map((audit) => ({
      ...audit,
      date: new Date(audit.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
    }));

  return (
    <div>
      <div className="flex gap-2">
        {["mobile", "desktop"].map((option) => (
          <button
            key={option}
            onClick={() => setStrategy(option)}
            className={`rounded-md border px-3 py-1 text-sm capitalize ${
              strategy === option
                ? "border-black bg-black text-white"
                : "border-zinc-300 text-zinc-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <p className="mt-6 text-zinc-500">No {strategy} analyses yet.</p>
      ) : (
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="performance" name="Performance" stroke="#16a34a" />
              <Line type="monotone" dataKey="accessibility" name="Accessibility" stroke="#2563eb" />
              <Line type="monotone" dataKey="seo" name="SEO" stroke="#9333ea" />
              <Line type="monotone" dataKey="bestPractices" name="Best practices" stroke="#ea580c" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
