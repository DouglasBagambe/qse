"use client";

import { useEffect } from "react";

interface PageHeadProps {
  title: string;
  description?: string;
}

/**
 * A component for setting page-specific metadata without conflicting with "use client"
 * This component updates the document title and meta description via browser DOM APIs
 */
export default function PageHead({ title, description }: PageHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description if provided
    if (description) {
      // Check if meta description exists
      let metaDescription = document.querySelector('meta[name="description"]');

      if (metaDescription) {
        // Update existing meta description
        metaDescription.setAttribute("content", description);
      } else {
        // Create and append new meta description
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        metaDescription.setAttribute("content", description);
        document.head.appendChild(metaDescription);
      }
    }

    // Clean up function not strictly needed for this use case
    // But good practice for other useEffect scenarios
    return () => {
      // Nothing to clean up in this case
    };
  }, [title, description]);

  // This component doesn't render anything visible
  return null;
}
