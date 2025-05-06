"use client";

import TokenomicsPage from "../components/TokenomicsPage";
import ErrorBoundary from "../components/ErrorBoundary";
import PageHead from "../PageHead";

export default function Page() {
  return (
    <ErrorBoundary>
      <PageHead
        title="QSE | Tokenomics"
        description="Explore the economic model behind QSE tokens, including distribution, supply, and utility."
      />
      <TokenomicsPage />
    </ErrorBoundary>
  );
}
