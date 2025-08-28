import { Suspense } from "react";
import VerifyResultClient from "./verify-result-client";

export default function VerifyResultPage() {
  return (
    <Suspense>
      <VerifyResultClient />
    </Suspense>
  );
}
