"use client";

import { useState } from "react";
import { setCalendarType } from "@/app/lib/actions/calendar-type";
import { CheckIcon } from "@heroicons/react/24/outline";
import AlertBox from "@/app/ui/dashboard/alert-box";

export default function CalendarSetting({calendarType}: {calendarType: "gregorian" | "jalali"}) {
  const [showAlert, setShowAlert] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-200 rounded"
        onClick={async () => {
          try {
            await setCalendarType("gregorian");
          } catch (err) {
            setShowAlert("Error: " + (err as Error).message);
          }
        }}
      >
        {calendarType === "gregorian" && (<CheckIcon className="w-6"/>)}
        Gregorian
      </button>

      <button
        className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-200 rounded"
        onClick={async () => {
          try {
            await setCalendarType("jalali");
          } catch (err) {
            setShowAlert("Error: " + (err as Error).message);
          }
        }}
      >
        {calendarType === "jalali" && (<CheckIcon className="w-6"/>)}
        Persian
      </button>

      {showAlert && (
        <AlertBox message={showAlert} close={() => setShowAlert(null)} />
      )}
    </div>
  );
}
