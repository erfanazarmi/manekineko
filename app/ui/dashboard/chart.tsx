"use client";

import { useState, useEffect } from "react";
import { CategoryAggregate } from "@/app/lib/definitions";
import { getExpenseChartData } from "@/app/lib/actions/statistics";
import Chart from "chart.js/auto";

export default function ExpenseChart({ from, to }: { from: string; to: string; }) {
  const [data, setData] = useState<CategoryAggregate[] | null>(null);

  useEffect(() => {
    if (from && to) getExpenseChartData(from, to).then(setData);
  }, [from, to]);

  useEffect(() => {
    if (!data) return;

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const canvas = document.getElementById("expenseChart");
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            data: data.map((d) => d.total),
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: isDark ? "#e5e7eb" : "#101010",
              font: { size: 13 },
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed.toLocaleString()}`,
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [data]);

  if (!data || data.length === 0) return <></>;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl my-4">Expenses by category</h2>
      <canvas id="expenseChart" />
    </div>
  );
}
