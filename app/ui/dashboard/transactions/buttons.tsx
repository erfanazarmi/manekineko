"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export function EditTransaction() {
  return (
    <button className="cursor-pointer">
      <PencilIcon className="w-5" />
    </button>
  );
}

export function DeleteTransaction() {
  return (
    <button className="cursor-pointer">
      <TrashIcon className="w-5" />
    </button>
  );
}
