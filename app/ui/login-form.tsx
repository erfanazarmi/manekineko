"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";

export default function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <form className="space-y-10">
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
      <button
        type="submit"
        className="cursor-pointer w-full bg-red-500 rounded-md px-4 py-2 text-white font-bold"
      >
        Login
      </button>
    </form>
  );
}
