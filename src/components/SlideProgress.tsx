interface SlideProgressProps {
  current: number;
  total: number;
}

export function SlideProgress({ current, total }: SlideProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <>
      {/* Desktop: below card */}
      <div className="mt-6 hidden space-y-2 lg:block">
        <p className="text-sm text-gray-500">
          Step {current} of {total}
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 transition-all duration-400 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Mobile: fixed bottom of viewport */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-800 bg-gray-950/90 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="mx-auto max-w-2xl space-y-1.5">
          <p className="text-sm text-gray-500">
            Step {current} of {total}
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 transition-all duration-400 ease-in-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
