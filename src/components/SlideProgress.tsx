interface SlideProgressProps {
  current: number;
  total: number;
}

export function SlideProgress({ current, total }: SlideProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-6 space-y-2">
      <p className="text-base text-gray-400">
        Step {current} of {total}
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 transition-all duration-400 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
