"use server";

import { fetchTransactionsTotalStats, fetchExpenseChartData } from "@/app/lib/data";

export async function getTotalStats(from: string, to: string) {
  return await fetchTransactionsTotalStats(from, to);
}

export async function getExpenseChartData(from: string, to: string) {
  return await fetchExpenseChartData(from, to);
}
