import { CategoryFormState, addCategory, editCategory, deleteCategory } from "@/app/lib/actions/categories";
import { Category } from "@/app/lib/definitions";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useActionState } from "react";

export type dialogStateType = {
  isOpen: boolean,
  type?: "add" | "edit" | "delete",
  selectedCategory?: Category
};

export default function CategoriesDialog({dialogState, close}: {dialogState: dialogStateType; close: () => void}) {  
  const initialStateAdd: CategoryFormState = { message: null, errors: { errors: [], properties: {} } };
  const [stateAdd, formActionAdd, isPendingAdd] = useActionState(addCategory, initialStateAdd);

  const editCategoryWithId = editCategory.bind(null, dialogState.selectedCategory?.id!);
  const initialStateEdit: CategoryFormState = { message: null, errors: { errors: [], properties: {} } };
  const [stateEdit, formActionEdit, isPedingEdit] = useActionState(editCategoryWithId, initialStateEdit);

  const deleteCategoryWithId = deleteCategory.bind(null, dialogState.selectedCategory?.id!);
  const initialStateDelete: CategoryFormState = { message: null, errors: { errors: [], properties: {} } };
  const [stateDelete, formActionDelete, isPendingDelete] = useActionState(deleteCategoryWithId, initialStateDelete);

  useEffect(() => {
    if (!isPendingAdd && !isPedingEdit && !isPendingDelete)
      if (stateAdd.message === "Successful" || stateEdit.message === "Successful" || stateDelete.message === "Successful")
        close();
  }, [isPendingAdd, isPedingEdit, isPendingDelete]);
  
  if (!dialogState.isOpen) return null;

  return (
    <div className="fixed top-0 left-0 h-dvh w-dvw bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      <div className="bg-background max-w-[400px] w-full p-8 m-4 rounded-md relative">
        <button
          type="button"
          onClick={close}
          className="cursor-pointer block absolute right-3 top-3"
        >
          <XMarkIcon className="w-5" />
        </button>
        <h2 className="mb-5 text-xl">
          {dialogState.type === "add" ? "New" : dialogState.type === "edit" ? "Edit" : "Delete"} Category
        </h2>
        {dialogState.type === "delete" && (
          <p>Are you sure you want to delete the "{dialogState.selectedCategory?.name}" category?</p>
        )}
        <form action={dialogState.type === "add" ? formActionAdd : dialogState.type === "edit" ? formActionEdit : formActionDelete}>
          {(dialogState.type === "add" || dialogState.type === "edit") && (
            <input
              type="text"
              name="name"
              className="border-1 rounded-md p-2 w-full border-gray-400 focus:outline-1 focus:outline-black dark:focus:outline-white"
              defaultValue={dialogState.type === "edit" ? dialogState.selectedCategory?.name : ""}
              required
            />
          )}
          <button
            type="submit"
            className="cursor-pointer text-white font-bold block bg-red-500 rounded-md px-8 py-2 mx-auto mt-5"
          >
            {dialogState.type === "add" ? "Add" : dialogState.type === "edit" ? "Save" : "Delete"}
          </button>
          {(dialogState.type === "add" && stateAdd.message && stateAdd.message !== "Successful") && (
            <p className="text-center text-red-500 pt-6">{stateAdd.message}</p>
          )}
          {(dialogState.type === "edit" && stateEdit.message && stateEdit.message !== "Successful") && (
            <p className="text-center text-red-500 pt-6">{stateEdit.message}</p>
          )}
          {(dialogState.type === "delete" && stateDelete.message && stateDelete.message !== "Successful") && (
            <p className="text-center text-red-500 pt-6">{stateDelete.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
