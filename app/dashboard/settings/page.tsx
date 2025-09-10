import { getCategories } from "@/app/lib/data";
import CategoriesSetting from "@/app/ui/dashboard/settings/categories-setting";

export default async function Page() {
  const categories = await getCategories();

  return (
    <main>
      <h1 className="text-2xl mb-12">Settings</h1>
      <h2 className="text-xl mb-8">Categories</h2>
      <CategoriesSetting categories={categories} />
      <hr className="h-px my-8 border-0 bg-gray-300 dark:bg-neutral-800" />
    </main>
  );
}
