"use client";

import TokenTheoryPage from "../components/TokenTheoryPage";
import ErrorBoundary from "../components/ErrorBoundary";
import PageHead from "../PageHead";

export default function Page() {
  return (
    <ErrorBoundary>
      <PageHead
        title="QSE | Token Theory"
        description="Learn about the theoretical foundation behind QSE tokens and our approach to quantum security."
      />
      <TokenTheoryPage />
    </ErrorBoundary>
  );
}
