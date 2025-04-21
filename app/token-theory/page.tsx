"use client";

import TokenTheoryPage from "../components/TokenTheoryPage";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <TokenTheoryPage />
    </ErrorBoundary>
  );
}
