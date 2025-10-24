import { Metadata } from "next";
import TotalStats from "@/app/ui/dashboard/total-stats";
import { getUserSettings } from "@/app/lib/data";

export default async function Page() {
  const settings = await getUserSettings();

  return (
    <>
      <h1 className="text-2xl mb-12">Statistics</h1>
      <TotalStats calendarType={settings.calendar_type} />
    </>
  );
}

export const metadata: Metadata = {
  title: "Home",
};
