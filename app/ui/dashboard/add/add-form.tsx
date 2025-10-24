"use client";

import { Category } from "@/app/lib/definitions";
import { addTransaction, TransactionFormState } from "@/app/lib/actions/transactions";
import { useState, useEffect, useActionState } from "react";
import AlertBox from "../alert-box";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian from "react-date-object/calendars/persian";
import persian_en from "react-date-object/locales/persian_en";

export default function AddForm({ categories, calendarType }: { categories: Category[]; calendarType: "gregorian" | "jalali" }) {
  const today = new DateObject().format("YYYY-MM-DD");
  const [date, setDate] = useState<DateObject>();

  const initialState: TransactionFormState = { message: null, errors: { errors: [], properties: {} } };
  const [state, formAction, isPending] = useActionState(addTransaction, initialState);

  const initialFormData = {
    type: "expense",
    category: "empty",
    title: "",
    amount: "",
    description: "",
    date: today,
  }
  const [formData, setFormData] = useState(initialFormData);

  const [isAlertBoxOpen, setIsAlertBoxOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  useEffect(() => {
    if(!isPending && state.message === "Transaction created successfully") {
      setFormData(initialFormData);
      setIsAlertBoxOpen(true);
    }
  }, [isPending, state.message]);

  useEffect(() => {
    if (calendarType === "gregorian") {
      const now = new DateObject({ calendar: gregorian, locale: gregorian_en });
      setDate(now);
    } else {
      const now = new DateObject({ calendar: persian, locale: persian_en });
      setDate(now);
    }
  }, [calendarType]);

  return (
    <div className="w-full flex justify-center">
      <main className="w-full flex flex-col max-w-[600px] pt-10">
        <h1 className="text-2xl mb-12">New Transaction</h1>
        <form action={formAction} className="w-full flex flex-col space-y-5">
          <div className="w-full flex gap-4">
            <div className="w-full flex flex-col">
              <label htmlFor="type" className="block pb-2">
                Type
              </label>
              <select
                name="type"
                id="type"
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
            <DatePicker
              value={date}
              onChange={(d) => {
                const formatted = d?.convert(gregorian, gregorian_en)?.format("YYYY-MM-DD") || today;
                setFormData({...formData, date: formatted});
                setDate(d || undefined);
              }}
              calendar={calendarType === "gregorian" ? gregorian : persian}
              locale={calendarType === "gregorian" ? gregorian_en : persian_en}
              inputClass="text-center border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
            <input type="hidden" name="date" value={formData.date} required />
          </div>

          <button
            type="submit"
            className="cursor-pointer block p-2 bg-red text-white font-bold rounded-md mt-10"
            aria-disabled={isPending}
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Add"}
          </button>

          {state.message !== "Transaction created successfully" && (
            <p className="text-center text-red" aria-live="polite" aria-atomic="true">
              {state.message}
            </p>
          )}

          {!isPending && state.message === "Transaction created successfully" && isAlertBoxOpen && (
            <AlertBox message={state.message} close={() => setIsAlertBoxOpen(false)} />
          )}
        </form>
      </main>
    </div>
  );
}
