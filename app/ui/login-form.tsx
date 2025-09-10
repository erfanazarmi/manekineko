"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions/authenticate";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  const handleResend = async (email: string) => {
    try {
      const res = await fetch("/api/verification/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setResendStatus("Verification email sent. Please check your inbox.");
      } else if (res.status === 404) {
        setResendStatus("User not found with this email.");
      } else {
        setResendStatus("Failed to resend email.");
      }
    } catch (err) {
      setResendStatus("Error occurred while resending.");
    }
  };

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <button
        type="submit"
        className="cursor-pointer w-full bg-red-500 rounded-md px-4 py-2 text-white font-bold"
        aria-disabled={isPending}
        disabled={isPending}
      >
        Login
      </button>
      {errorMessage && (
        <div
          className="flex flex-col min-h-8 items-center space-y-2"
          aria-live="polite"
          aria-atomic="true"
        >
        <div><p className="text-sm text-red-500">{errorMessage}</p></div>
          {errorMessage === "Your email is not verified." && (
            <button
              type="button"
              className="cursor-pointer block font-md text-red-500 underline"
              onClick={() => {
                if (email) {
                  setResendStatus("Sending...");
                  handleResend(email);
                }
              }}
            >
              Resend verification email
            </button>
          )}
          {resendStatus && <div><p className="text-center text-sm text-gray-700 dark:text-gray-400">{resendStatus}</p></div>}
        </div>
      )}
    </form>
  );
}
