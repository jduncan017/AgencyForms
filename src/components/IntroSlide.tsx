"use client";

import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface IntroSlideProps {
  clientName: string;
  onStart: () => void;
}

export function IntroSlide({ clientName, onStart }: IntroSlideProps) {
  return (
    <Card className="min-h-[360px] w-full animate-fade-in-up md:p-16 lg:p-20">
      <div className="flex flex-col items-center text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-100">
          Client Onboarding
        </h1>
        <p className="mb-6 max-w-md text-lg text-gray-400">
          Welcome, <span className="font-medium text-gray-200">{clientName}</span>
          . We need a few credentials to get your project set up.
        </p>
        <p className="mb-8 max-w-sm text-base text-gray-500">
          All data is encrypted and transmitted securely. Your credentials will
          never be stored in plain text.
        </p>
        <Button onClick={onStart} className="px-8 py-3">
          Get Started &rarr;
        </Button>
      </div>
    </Card>
  );
}
