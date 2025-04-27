"use client";

import PurchaseGuidePage from "../components/PurchaseGuidePage";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <PurchaseGuidePage />
    </ErrorBoundary>
  );
}
