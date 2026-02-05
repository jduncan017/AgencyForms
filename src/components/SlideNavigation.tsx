"use client";

import { Button } from "./ui/Button";

interface SlideNavigationProps {
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  isSubmitting?: boolean;
}

export function SlideNavigation({
  onBack,
  onNext,
  isFirst,
  isLast,
  isSubmitting = false,
}: SlideNavigationProps) {
  return (
    <div className="mt-6 flex items-center gap-3">
      {!isFirst && (
        <Button type="button" variant="secondary" onClick={onBack}>
          &larr; Back
        </Button>
      )}
      <div className="flex-1" />
      {isLast ? (
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          onClick={onNext}
        >
          Submit Credentials
        </Button>
      ) : (
        <Button type="button" onClick={onNext}>
          Next &rarr;
        </Button>
      )}
    </div>
  );
}
