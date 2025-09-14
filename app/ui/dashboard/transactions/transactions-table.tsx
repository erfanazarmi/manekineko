import { fetchTransactions } from "@/app/lib/data";
import { EditTransaction, DeleteTransaction } from "./buttons";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

export default async function TransactionsTable() {
  const transactions = await fetchTransactions(1);

  return (
    <div className="min-w-full overflow-y-auto rounded-md bg-red-500">
      <table className="min-w-full">
        <thead className="text-left">
          <tr className="text-white">
            <th className="px-5 py-2 font-bold">Title</th>
            <th className="px-5 py-2 font-bold">Amount</th>
            <th className="px-5 py-2 font-bold">Category</th>
            <th className="px-5 py-2 font-bold">Date</th>
            <th className="px-5 py-2 font-bold">Description</th>
          </tr>
        </thead>
        <tbody className="bg-[#fafafa] dark:bg-[#101010]">
          {transactions.map((transaction) => (
            <tr
              className="w-full border-b-2 border-neutral-200 dark:border-neutral-800"
              key={transaction.id}
            >
              <td className="p-5 whitespace-nowrap">
                {transaction.title}
              </td>
              <td className="p-5 whitespace-nowrap">
                <div className="flex gap-2">
                  {transaction.amount < 0 ? (
                    <MinusIcon className="w-4 text-red-500"/>
                  ) : (
                    <PlusIcon className="w-4 text-green-500"/>
                  )}
                  <div>{Math.abs(transaction.amount)}</div>
                </div>
              </td>
              <td className="p-5 whitespace-nowrap">
                {transaction.category_name}
              </td>
              <td className="p-5 whitespace-nowrap">
                {new Date(transaction.date).toDateString()}
              </td>
              <td className="p-5 whitespace-nowrap max-w-xs">
                <span className="truncate block max-w-[400px]" title={transaction.description!}>
                  {transaction.description}
                </span>
              </td>
              <td className="p-5 whitespace-nowrap">
                <div className="flex justify-end gap-3">
                  <EditTransaction />
                  <DeleteTransaction />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
