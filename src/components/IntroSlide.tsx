"use client";

import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import Image from "next/image";

interface IntroSlideProps {
  clientName: string;
  onStart: () => void;
}

export function IntroSlide({ clientName, onStart }: IntroSlideProps) {
  return (
    <Card className="animate-fade-in-up flex min-h-[400px] w-full flex-col items-center md:p-16 lg:p-20">
      <Image
        src="/agencyforms.png"
        alt="AgencyForms"
        width={280}
        height={120}
        className="mb-8 h-auto w-64"
      />
      <div className="flex flex-col items-center text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-100">
          Client Onboarding
        </h1>
        <p className="mb-10 max-w-md text-lg text-gray-400">
          Welcome,{" "}
          <span className="font-medium text-gray-200">{clientName}</span>. We
          need a few credentials to get your project set up.
        </p>
        <Button
          onClick={onStart}
          className="rounded-full! px-12 py-4 text-lg font-bold"
          variant="outline"
        >
          Get Started &rarr;
        </Button>
      </div>
    </Card>
  );
}
