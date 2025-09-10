"use client";

import { useState } from "react";
import { Category } from "@/app/lib/definitions";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import CategoriesDialog, { dialogStateType } from "@/app/ui/dashboard/settings/categories-dialog";

export default function CategoriesSetting({ categories }: { categories: Category[] }) {
  const [dialogState, setDialogState] = useState<dialogStateType>({isOpen: false});

  const handleClick = (type: "add" | "edit" | "delete", category?: Category) => {
    setDialogState({
      isOpen: true,
      type: type,
      selectedCategory: category
    })
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleClick("add")}
        className="cursor-pointer block min-w-[160px] h-[80px] flex items-center justify-center rounded-md bg-gray-200 dark:bg-neutral-800"
      >
        <PlusIcon className="w-7" />
      </button>
      {categories.map((category) => (
        <div
          key={category.name}
          className="min-w-[160px] flex rounded-md bg-gray-200 dark:bg-neutral-800"
        >
          <div className="flex flex-col justify-center p-3 gap-3 border-r-2 border-white dark:border-black">
            <button
              onClick={() => handleClick("edit", category)}
              className="cursor-pointer"
            >
              <PencilIcon className="w-5" />
            </button>
            <button
              onClick={() => handleClick("delete", category)}
              className="cursor-pointer"
            >
              <TrashIcon className="w-5" />
            </button>
          </div>
          <div className="flex items-center justify-center grow">
            <p className="text-center">{category.name}</p>
          </div>
        </div>
      ))}
      <CategoriesDialog
        dialogState={dialogState}
        close={() => setDialogState({isOpen: false})}
      />
    </div>
  );
}
