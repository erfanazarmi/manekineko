"use client";

import { useState, useEffect } from "react";
import { getTotalStats } from "@/app/lib/actions/statistics";
import { BanknotesIcon, PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";

export default function TotalStatsCards({ from, to }: { from: string; to: string }) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if(from && to)
      getTotalStats(from, to).then(setStats);
  }, [from, to]);

  if (!stats) return <></>;

  return (
    <div className="flex flex-col gap-3 md:flex-row lg:gap-5">
      <div className="flex-1 rounded-lg p-2 bg-neutral-200 dark:bg-neutral-900 lg:p-3">
        <div className="flex gap-2 font-medium text-sm p-1 pb-3 lg:p-2 lg:pb-3">
          <PlusCircleIcon className="w-5 text-green-500" />
          Income
        </div>
        <div className="bg-background p-5 flex justify-center items-center text-2xl rounded-md lg:p-6">
          {stats.total_income}
        </div>
      </div>
      <div className="flex-1 rounded-lg p-2 bg-neutral-200 dark:bg-neutral-900 lg:p-3">
        <div className="flex gap-2 font-medium text-sm p-1 pb-3 lg:p-2 lg:pb-3">
          <MinusCircleIcon className="w-5 text-red-500" />
          Expense
        </div>
        <div className="bg-background p-5 flex justify-center items-center text-2xl rounded-md lg:p-6">
          {stats.total_expense}
        </div>
      </div>
      <div className="flex-1 rounded-lg p-2 bg-neutral-200 dark:bg-neutral-900 lg:p-3">
        <div className="flex gap-2 font-medium text-sm p-1 pb-3 lg:p-2 lg:pb-3">
          <BanknotesIcon className="w-5 text-neutral-500" />
          Remaining Balance
        </div>
        <div className="bg-background p-5 flex justify-center items-center text-2xl rounded-md lg:p-6">
          {stats.total_amount}
        </div>
      </div>
    </div>
  );
}
