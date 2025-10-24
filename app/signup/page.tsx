import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SignupForm from "../ui/signup-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center pt-24">
      <div className="max-w-[360px] w-full bg-background border rounded-lg px-12 pt-16 pb-12 m-5 relative">
        <Link href="/" title="Home">
          <div className="bg-background border rounded-full p-4 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2/3">
            <Image
              src="/paw.svg"
              alt="Go to homepage"
              width={60}
              height={60}
              priority
              className="dark:invert"
            />
          </div>
        </Link>
        <Suspense>
          <SignupForm />
        </Suspense>
      </div>
      <div className="mt-6 mb-10">
        Have an account?{" "}
        <Link href="/login" className="underline">
          Login.
        </Link>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Sign Up",
};
