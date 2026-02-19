"use client";

import Image from "next/image";
import { ChevronRight, ExternalLink } from "lucide-react";
import { type InstructionStep } from "~/lib/types";
import { Card } from "./ui/Card";

interface InstructionSlideProps {
  step: InstructionStep;
  onNext?: () => void;
}

/** Render **bold** markers as <strong> elements */
function renderBody(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-gray-200">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export function InstructionSlide({ step, onNext }: InstructionSlideProps) {
  return (
    <Card className="min-h-[360px] md:p-16 lg:p-20">
      <div className="space-y-5">
        <h3 className="text-xl font-semibold text-gray-100">{step.title}</h3>

        <div className="whitespace-pre-line text-base leading-loose text-gray-400">
          {renderBody(step.body)}
        </div>

        {step.image && (
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <Image
              src={step.image}
              alt=""
              width={600}
              height={100}
              className="w-full"
            />
          </div>
        )}

        {step.highlight && (
          <p className="text-sm text-gray-500">{step.highlight}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          {step.linkUrl && (
            <a
              href={step.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-brand-400"
            >
              {step.linkLabel ?? "Open Link"}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="hidden cursor-pointer items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-5 py-2.5 text-base font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-700 hover:text-gray-100 lg:inline-flex"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
