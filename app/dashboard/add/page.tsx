import AddForm from "@/app/ui/dashboard/add/add-form";
import { getCategories } from "@/app/lib/data";

export default async function Page() {
  const categories = await getCategories();
  return (
    <AddForm categories={categories} />
  )
}
