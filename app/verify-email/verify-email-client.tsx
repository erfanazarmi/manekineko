"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!token) {
      router.push("/verify-result?status=invalid");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      router.push(`/verify-result?status=${data.status}`);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-dvh">
      <div className="max-w-[360px] w-full bg-background border rounded-lg p-10 m-5 space-y-5">
        <h1 className="text-[24px] mb-7">Email Verification</h1>
        {error ? (
          <div className="space-y-3">
            <p className="text-red-500">An unexpected error occurred.</p>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="cursor-pointer w-full px-4 py-2 bg-red text-white font-bold rounded-md"
            >
              {loading ? "Retrying..." : "Try Again"}
            </button>
          </div>
        ) : (
          <>
            <p>Click the button below to verify your email.</p>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="cursor-pointer w-full px-4 py-2 bg-red text-white font-bold rounded-md"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
