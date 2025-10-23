import AddForm from "@/app/ui/dashboard/add/add-form";
import { getCategories, getUserSettings } from "@/app/lib/data";

export default async function Page() {
  const categories = await getCategories();
  const settings = await getUserSettings();

  return (
    <AddForm categories={categories} calendarType={settings.calendar_type} />
  )
}
