type ScoreCircleProps = {
  label: string;
  value: number;
};

function getColor(value: number): string {
  if (value >= 90) return "border-green-500 text-green-600";
  if (value >= 50) return "border-orange-400 text-orange-500";
  return "border-red-500 text-red-600";
}

export default function ScoreCircle({ label, value }: ScoreCircleProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-24 w-24 items-center justify-center rounded-full border-8 text-2xl font-bold ${getColor(value)}`}
      >
        {value}
      </div>
      <p className="text-sm text-zinc-600">{label}</p>
    </div>
  );
}
