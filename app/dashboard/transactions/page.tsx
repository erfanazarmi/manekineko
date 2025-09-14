import TransactionsTable from "@/app/ui/dashboard/transactions/transactions-table";
import { Suspense } from "react";
export default function Page() {
  
  return (
    <main>
      <h1 className="text-2xl mb-12">Transactions</h1>
      <Suspense>
        <TransactionsTable />
      </Suspense>
    </main>
  );
}
