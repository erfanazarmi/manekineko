"use client";

import { HomeIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

const links = [
  {name: "Home", href: "/dashboard", icon: HomeIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-900 lg:flex-none lg:justify-start lg:p-2 lg:px-3",
              {
                "bg-gray-200 dark:bg-neutral-900": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden lg:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
