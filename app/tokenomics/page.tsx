"use client";

import TokenomicsPage from "../components/TokenomicsPage";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <TokenomicsPage />
    </ErrorBoundary>
  );
}
