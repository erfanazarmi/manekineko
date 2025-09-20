"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { TransactionsTable } from "@/app/lib/definitions";
import { deleteTransaction } from "@/app/lib/actions/transactions";
import { useState } from "react";

export function EditTransaction() {
  return (
    <button className="cursor-pointer">
      <PencilIcon className="w-5" />
    </button>
  );
}

export function DeleteTransaction({transaction}: {transaction: TransactionsTable}) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <button className="cursor-pointer" onClick={() => setShowDialog(true)}>
        <TrashIcon className="w-5" />
      </button>
      {showDialog && (
        <DeleteDialog
          close={() => setShowDialog(false)}
          transaction={transaction}
        />
      )}
    </>
  );
}

function DeleteDialog({close, transaction}: {close: () => void; transaction: TransactionsTable}) {
  return (
    <div className="fixed top-0 left-0 h-dvh w-dvw bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      <div className="bg-background max-w-[460px] w-full p-8 m-4 rounded-md">
        <p className="text-center text-wrap">
          Are you sure you want to delete this transaction?
        </p>
        <div className="flex justify-center py-5">
          <table>
            <tbody>
              <tr>
                <td className="text-right text-sm px-2">Title</td>
                <td className="font-bold px-2">{transaction.title}</td>
              </tr>
              <tr>
                <td className="text-right text-sm px-2">Amount</td>
                <td className="font-bold px-2">{Math.abs(transaction.amount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-2 gap-4">
          <button
            type="button"
            onClick={() => deleteTransaction(transaction.id)}
            className="cursor-pointer font-bold text-white bg-red-500 rounded-md py-2 w-[90px]"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={close}
            className="cursor-pointer font-bold text-red-500 bg-background border-1 border-red-500 rounded-md py-2 w-[90px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
