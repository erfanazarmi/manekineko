"use client";

import { Category, Transaction } from "@/app/lib/definitions";
import { editTransaction, TransactionFormState } from "@/app/lib/actions/transactions";
import { useState, useActionState } from "react";

export default function EditForm({transaction, categories}: {transaction: Transaction; categories: Category[]}) {
  const initialState: TransactionFormState = { message: null, errors: { errors: [], properties: {} } };
  const editTransactionWithId = editTransaction.bind(null, transaction.id);
  const [state, formAction, isPending] = useActionState(editTransactionWithId, initialState);

  const initialFormData = {
    type: transaction.amount > 0 ? "income" : "expense",
    category: transaction.category_id || "empty",
    title: transaction.title,
    amount: Math.abs(transaction.amount),
    description: transaction.description || "",
    date: transaction.date,
  }
  const [formData, setFormData] = useState(initialFormData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  return (
    <div className="w-full flex justify-center">
      <main className="w-full flex flex-col max-w-[600px] pt-10">
        <h1 className="text-2xl mb-12">Edit Transaction</h1>
        <form action={formAction} className="w-full flex flex-col space-y-5">
          <div className="w-full flex gap-4">
            <div className="w-full flex flex-col">
              <label htmlFor="type" className="block pb-2">
                Type
              </label>
              <select
                name="type"
                id="type"
                value={formData.type}
                onChange={e => handleChange(e)}
                className="w-full p-2 border-1 border-gray-400 rounded-md outline-none"
                required
              >
                <option className="dark:bg-black" value="expense">
                  Expense
                </option>
                <option className="dark:bg-black" value="income">
                  Income
                </option>
              </select>
            </div>

            <div className="w-full flex flex-col">
              <label htmlFor="category" className="block pb-2">
                Category
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={e => handleChange(e)}
                className="w-full p-2 border-1 border-gray-400 rounded-md outline-none"
                required
              >
                <option
                  value="empty"
                  className="dark:bg-black"
                >
                  — None —
                </option>
                {categories.map((category) => (
                  <option
                    key={category.name}
                    value={category.id}
                    className="dark:bg-black"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block pb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={e => handleChange(e)}
              className="w-full p-2 border-1 border-gray-400 rounded-md focus:outline-1 focus:outline-black dark:focus:outline-white"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block pb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={e => handleChange(e)}
              className="w-full p-2 border-1 border-gray-400 rounded-md focus:outline-1 focus:outline-black dark:focus:outline-white
                  [appearance:textfield]
                  [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none 
                "
              aria-describedby="amount-error"
              required
            />
            <p className="text-red" id="amount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.properties?.amount?.errors}
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block pb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={e => handleChange(e)}
              className="w-full p-2 border-1 border-gray-400 rounded-md focus:outline-1 focus:outline-black dark:focus:outline-white"
              aria-describedby="description-error"
            />
            <p className="text-red" id="description-error" aria-live="polite" aria-atomic="true">
              {state.errors?.properties?.description?.errors}
            </p>
          </div>

          <div>
            <label htmlFor="date" className="pr-3">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={e => handleChange(e)}
              className="border-1 p-1 border-gray-400 rounded-md focus:outline-1 focus:outline-black dark:focus:outline-white
                  dark:[&::-webkit-calendar-picker-indicator]:invert
                  [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  [&::-webkit-calendar-picker-indicator]:opacity-70
                  [&::-webkit-calendar-picker-indicator]:hover:opacity-100
                "
              required
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer block p-2 bg-red text-white font-bold rounded-md mt-10"
            aria-disabled={isPending}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Edit"}
          </button>
          {state.message !== "Transaction created successfully" && (
            <p className="text-center text-red" aria-live="polite" aria-atomic="true">
              {state.message}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
