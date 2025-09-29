"use client";

import { useState } from "react";
import TotalStatsCards from "./total-stats-cards";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

export default function TotalStats() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [from, setFrom] = useState(firstDayOfMonth.toLocaleDateString("en-CA"));
  const [to, setTo] = useState(now.toLocaleDateString("en-CA"));

  return (
    <>
      <div className="flex gap-2 mb-8 lg:gap-5">
        <div className="flex gap-2">
          <label htmlFor="from" className="hidden lg:block">From</label>
          <input
            type="date"
            id="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="
              dark:[&::-webkit-calendar-picker-indicator]:invert
              [&::-webkit-calendar-picker-indicator]:cursor-pointer
              [&::-webkit-calendar-picker-indicator]:opacity-70
              [&::-webkit-calendar-picker-indicator]:hover:opacity-100
            "
          />
        </div>
        <ArrowLongRightIcon className="w-6"/>
        <div className="flex gap-2">
          <label htmlFor="to" className="hidden lg:block">To</label>
          <input
            type="date"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="
              dark:[&::-webkit-calendar-picker-indicator]:invert
              [&::-webkit-calendar-picker-indicator]:cursor-pointer
              [&::-webkit-calendar-picker-indicator]:opacity-70
              [&::-webkit-calendar-picker-indicator]:hover:opacity-100
            "
          />
        </div>
      </div>
      <TotalStatsCards from={from} to={to} />
    </>
  );
}
