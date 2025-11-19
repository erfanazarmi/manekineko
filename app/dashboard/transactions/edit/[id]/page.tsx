import { Metadata } from "next";
import { fetchTransactionById, getCategories, getUserSettings } from "@/app/lib/data";
import EditForm from "@/app/ui/dashboard/transactions/edit-form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function Page({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const transaction = await fetchTransactionById(id);
  const categories = await getCategories();
  const settings = await getUserSettings();

  return (
    <>
      <Link className="absolute" href="/dashboard/transactions" title="Back">
        <ArrowLeftIcon className="w-7"/>
      </Link>
      <EditForm transaction={transaction} categories={categories} calendarType={settings.calendar_type} />
    </>
  );
}

export const metadata: Metadata = {
  title: "Edit Transaction",
};
