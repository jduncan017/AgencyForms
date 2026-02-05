"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState, Suspense } from "react";
import { type FieldValue, type SubmissionPayload } from "~/lib/types";
import { decodeConfig, resolveGroups } from "~/lib/config-codec";
import {
  getRegistrarById,
  PLATFORM_LOGIN_URLS,
} from "~/lib/providers";
import { IntroSlide } from "~/components/IntroSlide";
import { SlideProgress } from "~/components/SlideProgress";
import { SlideNavigation } from "~/components/SlideNavigation";
import { CredentialInput } from "~/components/CredentialInput";
import { FormWrapper } from "~/components/FormWrapper";

function FormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = searchParams.get("data");

  const config = useMemo(() => {
    if (!data) return null;
    try {
      return decodeConfig(data);
    } catch {
      return null;
    }
  }, [data]);

  const groups = useMemo(() => {
    if (!config) return [];
    return resolveGroups(config);
  }, [config]);

  const totalSlides = groups.length + 1; // intro + one per group
  const [currentSlide, setCurrentSlide] = useState(0);

  // State: one record per group, keyed by field key (field type or registrar_custom)
  const [values, setValues] = useState<Record<string, string>[]>(() =>
    groups.map(() => ({})),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!config) {
    return (
      <FormWrapper title="Invalid Link">
        <p className="text-center text-gray-400">
          This form link is invalid or has been corrupted. Please request a new
          link from your contact at DigitalNova Studio.
        </p>
      </FormWrapper>
    );
  }

  const handleFieldChange = (
    groupIndex: number,
    field: string,
    value: string,
  ) => {
    setValues((prev) =>
      prev.map((v, i) => (i === groupIndex ? { ...v, [field]: value } : v)),
    );
  };

  const goNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const payload: SubmissionPayload = {
      clientName: config.clientName,
      returnEmail: config.returnEmail,
      credentials: groups.map((group, i) => {
        const groupValues = values[i] ?? {};

        // Resolve registrar → display name + login URL
        let loginUrl: string | undefined;
        const resolvedFields: FieldValue[] = group.fields
          .filter((field) => field !== "registrar")
          .map((field) => ({
            label: field,
            value: groupValues[field] ?? "",
            type: field,
          }));

        if (group.fields.includes("registrar")) {
          const registrarKey = "registrar" as const;
          const customKey = "registrar_custom";
          const registrarId = groupValues[registrarKey] ?? "";
          const registrar = getRegistrarById(registrarId);

          if (registrar) {
            // Known registrar
            resolvedFields.unshift({
              label: registrarKey,
              value: registrar.name,
              type: registrarKey,
            });
            loginUrl = registrar.loginUrl;
          } else if (registrarId === "custom") {
            // Custom registrar
            resolvedFields.unshift({
              label: registrarKey,
              value: groupValues[customKey] ?? "",
              type: registrarKey,
            });
          } else {
            resolvedFields.unshift({
              label: registrarKey,
              value: registrarId,
              type: registrarKey,
            });
          }
        }

        // For preset platforms, attach their login URL
        if (!loginUrl && PLATFORM_LOGIN_URLS[group.platform]) {
          loginUrl = PLATFORM_LOGIN_URLS[group.platform];
        }

        return {
          platform: group.platform,
          fields: resolvedFields,
          loginUrl,
        };
      }),
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Submission failed");
      }

      router.push("/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLastSlideAction = () => {
    void handleSubmit();
  };

  return (
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-950 px-4">
        <div className="relative w-full max-w-2xl overflow-hidden py-8">
          {/* Slides container */}
          <div
            className="flex transition-transform duration-400 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {/* Slide 0: Intro */}
            <div className="w-full flex-shrink-0 px-1">
              <IntroSlide
                clientName={config.clientName}
                onStart={goNext}
              />
            </div>

            {/* Slides 1..N: Credential groups */}
            {groups.map((group, i) => {
              const isLast = i === groups.length - 1;

              return (
                <div key={`${group.platform}-${i}`} className="w-full flex-shrink-0 px-1">
                  <div className="space-y-2">
                    <SlideProgress current={i + 1} total={groups.length} />
                    <CredentialInput
                      group={group}
                      values={values[i] ?? {}}
                      onChange={(field, value) =>
                        handleFieldChange(i, field, value)
                      }
                    />
                    {error && isLast && (
                      <p className="text-base text-red-400">{error}</p>
                    )}
                    <SlideNavigation
                      onBack={goBack}
                      onNext={isLast ? handleLastSlideAction : goNext}
                      isFirst={false}
                      isLast={isLast}
                      isSubmitting={submitting}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
  );
}

export default function FormPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-950 px-4">
          <div className="w-full max-w-2xl space-y-6 py-8">
            {/* Skeleton card */}
            <div className="animate-pulse rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <div className="mb-6 flex flex-col items-center gap-3">
                <div className="h-8 w-48 rounded-lg bg-gray-800" />
                <div className="h-4 w-72 rounded bg-gray-800" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-24 rounded bg-gray-800" />
                <div className="h-10 w-full rounded-lg bg-gray-800" />
                <div className="h-4 w-20 rounded bg-gray-800" />
                <div className="h-10 w-full rounded-lg bg-gray-800" />
              </div>
            </div>
          </div>
        </main>
      }
    >
      <FormContent />
    </Suspense>
  );
}
