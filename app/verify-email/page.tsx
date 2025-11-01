import { Suspense } from "react";
import VerifyEmailPage from "./verify-email-client";

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}
