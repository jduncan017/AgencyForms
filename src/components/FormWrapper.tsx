interface FormWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function FormWrapper({ children, title, subtitle }: FormWrapperProps) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in-up space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-100">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-base text-gray-400">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </main>
  );
}
