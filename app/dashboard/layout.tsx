import SideNav from "@/app/ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background lg:flex-row">
      <div className="w-full fixed bottom-0 bg-background border-t-1 border-gray-200 dark:border-neutral-800 lg:h-dvh lg:w-64 lg:overflow-y-auto">
        <SideNav />
      </div>
      <div className="flex-grow p-6 pb-26 lg:overflow-y-auto lg:p-12 lg:ml-64">{children}</div>
    </div>
  );
}
