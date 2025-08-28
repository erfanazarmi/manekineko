"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function VerifyResultPage() {
  const params = useSearchParams();
  const status = params.get("status");
  const [email, setEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<string | null>(null);

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

  if (status === "expired" || status === "invalid") {
    return (
      <main className="flex justify-center items-center min-h-dvh">
        <div className="max-w-[360px] w-full bg-background border rounded-lg p-10 m-5 space-y-4">
          {status === "expired" ? (
            <>
              <h1 className="text-[24px] mb-7">Link expired</h1>
              <p>Your verification link has expired.</p>
            </>
          ) : (
            <>
              <h1 className="text-[24px] mb-7">Invalid link</h1>
              <p>This verification link is not valid.</p>
            </>
          )}
          <form className="space-y-5">
            <input
              type="email"
              id="emailInput"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b outline-none py-1"
            />
            <button
              type="button"
              className="cursor-pointer block text-red-500 font-md underline m-auto"
              onClick={() => {
                if (email) {
                  setResendStatus("Sending...");
                  handleResend(email);
                }
              }}
            >
              Resend verification email
            </button>
          </form>

          {resendStatus && (
            <div>
              <p className="text-center text-sm text-gray-700 dark:text-gray-400">
                {resendStatus}
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-dvh">
      <div className="max-w-[360px] w-full bg-background border rounded-lg p-10 m-5 space-y-5">
        <h1 className="text-[24px] mb-7">Email verified</h1>
        <p>Your email has been successfully verified.</p>

        <Link
          href="/login"
          className="cursor-pointer text-center block bg-red-500 rounded-md px-4 py-2 text-white font-bold"
        >
          Go to login
        </Link>
      </div>
    </main>
  );
}
