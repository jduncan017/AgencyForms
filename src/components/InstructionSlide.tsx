"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { type InstructionStep } from "~/lib/types";
import { Card } from "./ui/Card";

interface InstructionSlideProps {
  step: InstructionStep;
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

export function InstructionSlide({ step }: InstructionSlideProps) {
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

        {step.highlight && (
          <p className="text-sm text-gray-500">{step.highlight}</p>
        )}
      </div>
    </Card>
  );
}
