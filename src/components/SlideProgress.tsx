interface SlideProgressProps {
  current: number;
  total: number;
}

export function SlideProgress({ current, total }: SlideProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-800 bg-gray-950/90 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl space-y-3">
        <p className="text-sm text-gray-400">
          Step {current} of {total}
        </p>
        <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-gray-300/20">
          <div
            className="from-brand-500 h-full rounded-full bg-linear-to-r to-cyan-400 transition-all duration-400 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
