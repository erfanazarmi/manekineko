"use client";

import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Filter({
  selectedType,
  selectedCategories,
  allCategories,
}: {
  selectedType: string;
  selectedCategories: string;
  allCategories: string[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [type, setType] = useState<string[]>(
    selectedType !== "all" ? selectedType.split("|") : ["income", "expense"]
  );
  const [categories, setCategories] = useState<string[]>(
    selectedCategories !== "all" ? selectedCategories.split("|") : ["all"]
  );

  function toggleType(value: string) {
    setType((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function toggleCategory(value: string) {
    setCategories((prev) => {
      let next: string[];

      if (value === "all") {
        if (prev.includes("all")) next = ["null"];
        else next = ["all"];
      } else {
        if (prev.includes("all")) next = allCategories.filter((v) => v !== value);
        else if (prev.includes("null")) next = [value];
        else if (prev.includes(value)) next = prev.filter((v) => v !== value);
        else next = [...prev, value];
      }

      if (next.length === 0) next = ["null"];

      if (
        next.length === allCategories.length &&
        !next.includes("all") &&
        !next.includes("null")
      ) {
        next = ["all"];
      }

      return next;
    });
  }

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams);
    if (type) {
      if (type.includes("income") && type.includes("expense"))
        params.delete("type");
      else
        params.set("type", type.join("|"));
    }
    if (categories.includes("all")) {
      params.delete("categories");
    } else if (categories.length > 0) {
      params.set("categories", categories.join("|"));
    } else {
      params.delete("categories");
    }
    replace(`${pathname}?${params.toString()}`);
    setIsFilterOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <p>Filter</p>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="cursor-pointer"
        >
          <AdjustmentsHorizontalIcon className="w-5" />
        </button>
      </div>

      {isFilterOpen && (
        <div className="fixed top-0 left-0 h-dvh w-dvw bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
          <div className="bg-background pt-14 pb-8 p-10 m-4 rounded-md relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="cursor-pointer block absolute right-5 top-5"
            >
              <XMarkIcon className="w-5" />
            </button>

            <div className="space-y-10">
              <div className="space-y-5">
                <p className="font-bold">Type</p>
                <div className="grid grid-cols-2 gap-x-20 gap-y-2">
                  <div className="space-x-2">
                    <input
                      type="checkbox"
                      id="expense"
                      value="expense"
                      checked={type.includes("expense")}
                      onChange={() => toggleType("expense")}
                    />
                    <label htmlFor="expense">Expense</label>
                  </div>
                  <div className="space-x-2">
                    <input
                      type="checkbox"
                      id="income"
                      value="income"
                      checked={type.includes("income")}
                      onChange={() => toggleType("income")}
                    />
                    <label htmlFor="income">Income</label>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <p className="font-bold">Category</p>
                <div className="grid grid-cols-2 gap-x-20 gap-y-2">
                  <div key="all" className="space-x-2">
                    <input
                      type="checkbox"
                      id="all"
                      value="all"
                      checked={categories.includes("all")}
                      onChange={() => toggleCategory("all")}
                    />
                    <label htmlFor="all">All</label>
                  </div>
                  {allCategories.map((category) => (
                    <div key={category} className="space-x-2">
                      <input
                        type="checkbox"
                        id={category}
                        value={category}
                        checked={categories.includes(category) || categories.includes("all")}
                        onChange={() => toggleCategory(category)}
                      />
                      <label htmlFor={category}>{category}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="cursor-pointer text-white font-bold block bg-red rounded-md px-6 py-2 mx-auto mt-10"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}
