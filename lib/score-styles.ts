export type ScoreStyles = {
  stroke: string;
  text: string;
  badge: string;
};

export function getScoreStyles(value: number): ScoreStyles {
  if (value >= 90) {
    return {
      stroke: "stroke-green-500",
      text: "text-green-600",
      badge: "bg-green-50 text-green-700",
    };
  }
  if (value >= 50) {
    return {
      stroke: "stroke-orange-400",
      text: "text-orange-500",
      badge: "bg-orange-50 text-orange-700",
    };
  }
  return {
    stroke: "stroke-red-500",
    text: "text-red-600",
    badge: "bg-red-50 text-red-700",
  };
}
