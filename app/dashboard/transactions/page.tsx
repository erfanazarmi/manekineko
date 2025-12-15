import { Metadata } from "next";
import SortBy from "@/app/ui/dashboard/transactions/sort-by";
import Filter from "@/app/ui/dashboard/transactions/filter";
import TransactionsTable from "@/app/ui/dashboard/transactions/transactions-table";
import Pagination from "@/app/ui/dashboard/transactions/pagination";
import { fetchTransactionsPages, getCategories } from "@/app/lib/data";
import { Suspense } from "react";

export default async function Page(props: {
  searchParams?: Promise<{
    page?: string;
    sort_by?: string;
    categories?: string;
    type?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const sortBy = searchParams?.sort_by || "date_newest";
  const type = searchParams?.type || "all";
  const categories = searchParams?.categories || "all";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchTransactionsPages(type, categories);
  const allCategories = await getCategories();

  return (
    <main>
      <h1 className="text-2xl mb-12">Transactions</h1>
      <div className="flex items-baseline gap-6">
        <SortBy />
        <Filter
          selectedType={type}
          selectedCategories={categories}
          allCategories={allCategories.map((category) => category.name)}
        />
      </div>
      <Suspense>
        <TransactionsTable
          currentPage={currentPage}
          sortBy={sortBy}
          type={type}
          categories={categories}
        />
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
