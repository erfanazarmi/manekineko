import NavLinks from "@/app/ui/dashboard/nav-links";
import Image from "next/image";

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
      </div>
    </div>
  );
}
