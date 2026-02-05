interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-lg shadow-black/25 ${className}`}
    >
      {children}
    </div>
  );
}
