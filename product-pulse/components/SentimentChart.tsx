"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProductPulseAnalysis } from "@/lib/mockAnalysis";

type SentimentChartProps = {
  sentiment: ProductPulseAnalysis["sentiment"];
};

export function SentimentChart({ sentiment }: SentimentChartProps) {
  const data = [
    { name: "Positive", value: sentiment.positive, fill: "#234f3c" },
    { name: "Neutral", value: sentiment.neutral, fill: "#8f612a" },
    { name: "Negative", value: sentiment.negative, fill: "#a85f4c" },
  ];

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid stroke="#ebe5dc" strokeDasharray="4 8" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#3a403d", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#3a403d", fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            cursor={{ fill: "rgba(49, 89, 70, 0.055)" }}
            contentStyle={{
              border: "1px solid rgba(31,37,35,0.12)",
              borderRadius: 14,
              background: "rgba(251,250,247,0.96)",
              boxShadow: "0 18px 44px rgba(31, 37, 35, 0.12)",
            }}
            formatter={(value) => [`${value}%`, "Share"]}
          />
          <Bar dataKey="value" radius={[8, 8, 3, 3]} maxBarSize={58}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
