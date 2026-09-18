export const CHART = {
  accent: "var(--color-accent)",
  dark: "var(--color-foreground)",
  mid: "var(--color-muted-foreground)",
  light: "var(--color-border)",
  success: "var(--color-success)",
};

export const PIE_COLORS = [
  "var(--color-accent)",
  "var(--color-foreground)",
  "var(--color-muted-foreground)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-success)",
];

export const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

export const tooltipStyle = {
  contentStyle: {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "var(--color-foreground)",
  },
  labelStyle: { color: "var(--color-foreground)", fontWeight: 600 },
  cursor: { fill: "var(--color-secondary)" },
} as const;
