"use client";

import { useState, useEffect } from "react";
import TotalStatsCards from "./total-stats-cards";
import ExpenseChart from "./chart";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian from "react-date-object/calendars/persian";
import persian_en from "react-date-object/locales/persian_en";

export default function TotalStats({ calendarType }: { calendarType: "gregorian" | "jalali" }) {
  const [values, setValues] = useState<DateObject[]>([]);

  useEffect(() => {
    if (calendarType === "gregorian") {
      const now = new DateObject({ calendar: gregorian, locale: gregorian_en });
      const firstDay = new DateObject({
        calendar: gregorian,
        locale: gregorian_en,
      }).set({
        year: now.year,
        month: now.month.number,
        day: 1,
      });
      setValues([firstDay, now]);
    } else {
      const now = new DateObject({ calendar: persian, locale: persian_en });
      const firstDay = new DateObject({
        calendar: persian,
        locale: persian_en,
      }).set({
        year: now.year,
        month: now.month.number,
        day: 1,
      });
      setValues([firstDay, now]);
    }
  }, [calendarType]);

  const fromGregorian = values?.[0]?.convert(gregorian, gregorian_en)?.format("YYYY-MM-DD") || "";
  const toGregorian = values?.[1]?.convert(gregorian, gregorian_en)?.format("YYYY-MM-DD") || "";

  return (
    <div className="space-y-8">
      <DatePicker
        value={values}
        onChange={setValues}
        range
        calendar={calendarType === "gregorian" ? gregorian : persian}
        locale={calendarType === "gregorian" ? gregorian_en : persian_en}
        inputClass="text-center border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
      <TotalStatsCards from={fromGregorian} to={toGregorian} />
      <div className="w-full flex items-center justify-center md:mt-12">
        <div className="w-full max-w-[460px]">
          <ExpenseChart from={fromGregorian} to={toGregorian} />
        </div>
      </div>
    </div>
  );
}
