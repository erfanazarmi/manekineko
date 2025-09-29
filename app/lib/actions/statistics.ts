"use server";

import { fetchTransactionsTotalStats } from "@/app/lib/data";

export async function getTotalStats(from: string, to: string) {
  return await fetchTransactionsTotalStats(from, to);
}
