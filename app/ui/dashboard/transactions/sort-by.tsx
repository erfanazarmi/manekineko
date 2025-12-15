"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SortBy() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSelect = (item: string) => {
    const params = new URLSearchParams(searchParams);
    if (item) {
      params.set("sort_by", item);
    } else {
      params.delete("sort_by");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-baseline">
      <label>Sort by</label>
      <select
        name="sort_by"
        id="sort_by"
        defaultValue={searchParams.get("sort_by")?.toString() || "date_newest"}
        onChange={(e) => handleSelect(e.target.value)}
        className="ml-3 mb-5 p-2 border-1 border-gray-400 rounded-md outline-none"
        required
      >
        <option className="dark:bg-black" value="date_newest">
          Date - Newest
        </option>
        <option className="dark:bg-black" value="date_oldest">
          Date - Oldest
        </option>
        <option className="dark:bg-black" value="created_at_newest">
          Created at - Newest
        </option>
        <option className="dark:bg-black" value="created_at_oldest">
          Created at - Oldest
        </option>
        <option className="dark:bg-black" value="amount_highest">
          Amount - Highest
        </option>
        <option className="dark:bg-black" value="amount_lowest">
          Amount - Lowest
        </option>
      </select>
    </div>
  );
}
