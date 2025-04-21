// app/TokenTheory.tsx
"use client";

import TokenTheoryPage from "../TokenTheoryPage";
import ErrorBoundary from "../ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <TokenTheoryPage />
    </ErrorBoundary>
  );
}
