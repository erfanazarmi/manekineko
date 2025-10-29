import { Metadata } from "next";
import TransactionsTable from "@/app/ui/dashboard/transactions/transactions-table";
import Pagination from "@/app/ui/dashboard/transactions/pagination";
import { fetchTransactionsPages } from '@/app/lib/data';
import { Suspense } from "react";

export default async function Page(props: {searchParams?: Promise<{page?: string}>}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchTransactionsPages();

  return (
    <main>
      <h1 className="text-2xl mb-12">Transactions</h1>
      <Suspense>
        <TransactionsTable currentPage={currentPage} />
      </Suspense>
      {totalPages > 1 && (
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </main>
  );
}

export const metadata: Metadata = {
  title: "Transactions",
};
