// app/page.tsx
"use client";

import Home from "./components/pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  );
}
