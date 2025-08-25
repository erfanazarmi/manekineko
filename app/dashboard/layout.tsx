import SideNav from "@/app/ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh flex flex-col bg-background lg:flex-row lg:overflow-hidden">
      <div className="w-full flex-none fixed bottom-0 lg:relative lg:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 lg:overflow-y-auto lg:p-12">{children}</div>
    </div>
  );
}
