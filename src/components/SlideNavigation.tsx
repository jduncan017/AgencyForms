"use client";

import { Button } from "./ui/Button";

interface SlideNavigationProps {
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  isSubmitting?: boolean;
  nextDisabled?: boolean;
}

export function SlideNavigation({
  onBack,
  onNext,
  isFirst,
  isLast,
  isSubmitting = false,
  nextDisabled = false,
}: SlideNavigationProps) {
  return (
    <div className="mt-6 flex items-center gap-3 lg:hidden">
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
          disabled={isSubmitting || nextDisabled}
          onClick={onNext}
        >
          Submit Credentials
        </Button>
      ) : (
        <Button type="button" onClick={onNext} disabled={nextDisabled}>
          Next &rarr;
        </Button>
      )}
    </div>
  );
}
