import NavLinks from "@/app/ui/dashboard/nav-links";
import Image from "next/image";
import { PowerIcon } from "@heroicons/react/24/outline";

export default function SideNav() {
  return (
    <div className="h-full flex flex-col px-3 py-4 lg:px-2">
      <div className="hidden p-4 mb-2 h-20 items-center justify-center rounded-md bg-gray-100 dark:bg-neutral-800 lg:flex">
        <h1 className="text-[24px] pr-2 uppercase">Maneki Neko</h1>
        <Image src="/paw.svg" alt="" width={30} height={30} priority className="dark:invert" />
      </div>
      <div className="flex grow flex-row justify-between space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-100 dark:bg-neutral-800 lg:block"></div>
        <form action="/api/auth/signout" method="GET">
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-900 lg:flex-none lg:justify-start lg:p-2 lg:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden lg:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
