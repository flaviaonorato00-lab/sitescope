import { getScoreStyles } from "@/lib/score-styles";

type ScoreCircleProps = {
  label: string;
  value: number;
};

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreCircle({ label, value }: ScoreCircleProps) {
  const styles = getScoreStyles(value);
  const offset = CIRCUMFERENCE * (1 - value / 100);

  return (
    <div className="flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            className="stroke-zinc-100"
          />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className={styles.stroke}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${styles.text}`}
        >
          {value}
        </span>
      </div>
      <p className="mt-3 text-sm font-medium text-zinc-700">{label}</p>
    </div>
  );
}
