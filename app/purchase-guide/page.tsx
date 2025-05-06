"use client";

import PurchaseGuidePage from "../components/PurchaseGuidePage";
import ErrorBoundary from "../components/ErrorBoundary";
import PageHead from "../PageHead";

export default function Page() {
  return (
    <ErrorBoundary>
      <PageHead
        title="QSE | Purchase Guide"
        description="Step-by-step instructions for purchasing QSE tokens and joining our quantum-resistant ecosystem."
      />
      <PurchaseGuidePage />
    </ErrorBoundary>
  );
}
