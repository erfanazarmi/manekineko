"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-10">
      <div>
        <label htmlFor="emailInput" className="block">
          <AtSymbolIcon className="size-5 text-red-500 inline mr-2" />
          Email
        </label>
        <input
          type="email"
          id="emailInput"
          name="email"
          className="w-full border-b outline-none py-1 mt-1"
          required
        />
      </div>
      <div>
        <label htmlFor="passwordInput" className="block">
          <KeyIcon className="size-5 text-red-500 inline mr-2" />
          Password
        </label>
        <div className="flex w-full">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="passwordInput"
            name="password"
            className="w-full border-b outline-none py-1 mt-1"
            required
          />
          <button
            type="button"
            onClick={handlePasswordVisibility}
            className="cursor-pointer border-b"
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="size-5 text-gray-400 dark:text-foreground" />
            ) : (
              <EyeIcon className="size-5 text-gray-400 dark:text-foreground" />
            )}
          </button>
        </div>
      </div>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      {errorMessage && (
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      )}
      <button
        type="submit"
        className="cursor-pointer w-full bg-red-500 rounded-md px-4 py-2 text-white font-bold"
        aria-disabled={isPending}
        disabled={isPending}
      >
        Login
      </button>
    </form>
  );
}
