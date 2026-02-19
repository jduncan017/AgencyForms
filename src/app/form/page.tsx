"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState, Suspense } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Send, ShieldCheck } from "lucide-react";
import {
  type FieldValue,
  type SubmissionPayload,
  type InstructionStep,
  type CredentialGroup,
  type UploadedFile,
} from "~/lib/types";
import { decodeConfig, resolveGroups } from "~/lib/config-codec";
import { getPresetByPlatform } from "~/lib/presets";
import {
  getRegistrarById,
  PLATFORM_LOGIN_URLS,
  PLATFORM_LOGOS,
} from "~/lib/providers";
import { IntroSlide } from "~/components/IntroSlide";
import { InstructionSlide } from "~/components/InstructionSlide";
import { SlideProgress } from "~/components/SlideProgress";
import { SlideNavigation } from "~/components/SlideNavigation";
import { CredentialInput } from "~/components/CredentialInput";
import { UploadSlide } from "~/components/UploadSlide";
import { ClientCopySlide } from "~/components/ClientCopySlide";
import { FormWrapper } from "~/components/FormWrapper";

type SlideDesc =
  | { type: "intro" }
  | { type: "instruction"; step: InstructionStep; platform: string }
  | { type: "credential"; groupIndex: number; group: CredentialGroup }
  | { type: "upload" }
  | { type: "clientCopy" };

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

  // Build flat slide list: intro → (instruction slides + credential) per group
  const slides = useMemo<SlideDesc[]>(() => {
    const result: SlideDesc[] = [{ type: "intro" }];
    groups.forEach((group, groupIndex) => {
      const preset = getPresetByPlatform(group.platform);
      if (preset?.instructions) {
        for (const step of preset.instructions) {
          result.push({ type: "instruction", step, platform: group.platform });
        }
      } else if (group.signupUrl) {
        result.push({
          type: "instruction",
          step: {
            title: `Sign Up for ${group.platform}`,
            body: `Use the link below to create your ${group.platform} account.`,
            linkUrl: group.signupUrl,
            linkLabel: `Sign Up for ${group.platform}`,
          },
          platform: group.platform,
        });
      }
      result.push({ type: "credential", groupIndex, group });
    });
    if (config?.requestUploads) {
      result.push({ type: "upload" });
    }
    result.push({ type: "clientCopy" });
    return result;
  }, [groups, config?.requestUploads]);

  const [currentSlide, setCurrentSlide] = useState(0);

  // State: one record per group, keyed by field key (field type or registrar_custom)
  const [values, setValues] = useState<Record<string, string>[]>(() =>
    groups.map(() => ({})),
  );
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [clientCopyEnabled, setClientCopyEnabled] = useState(false);
  const [clientCopyEmail, setClientCopyEmail] = useState("");
  const [clientCopyPassword, setClientCopyPassword] = useState("");
  const [clientCopyConfirmPassword, setClientCopyConfirmPassword] =
    useState("");
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

  // Check expiry
  if (config.expiresAt && Date.now() > config.expiresAt) {
    return (
      <FormWrapper title="Link Expired">
        <p className="text-center text-gray-400">
          This form link has expired. Please request a new link from your
          contact at DigitalNova Studio.
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

  // Validation: check if all required fields in a credential slide are filled
  const isCredentialSlideValid = (
    groupIndex: number,
    group: CredentialGroup,
  ): boolean => {
    const groupValues = values[groupIndex] ?? {};
    return group.fields.every((field) => {
      if (field === "notes") return true;
      if (field === "registrar") {
        const registrarVal = groupValues.registrar ?? "";
        if (!registrarVal) return false;
        if (registrarVal === "custom") {
          const customVal = groupValues.registrar_custom ?? "";
          return customVal.trim().length > 0;
        }
        return true;
      }
      return (groupValues[field] ?? "").trim().length > 0;
    });
  };

  const isCurrentSlideValid = (() => {
    const slide = slides[currentSlide];
    if (!slide) return false;
    if (slide.type === "credential")
      return isCredentialSlideValid(slide.groupIndex, slide.group);
    if (slide.type === "clientCopy") {
      if (!clientCopyEnabled) return true;
      return (
        clientCopyEmail.trim().length > 0 &&
        clientCopyPassword.length > 0 &&
        clientCopyPassword === clientCopyConfirmPassword
      );
    }
    return true; // intro, instruction, upload are always valid
  })();

  const goNext = () => {
    if (!isCurrentSlideValid) return;
    if (currentSlide < slides.length - 1) {
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
      businessName: config.businessName,
      returnEmail: config.returnEmail,
      uploads: uploads.length > 0 ? uploads : undefined,
      clientCopy: clientCopyEnabled
        ? { email: clientCopyEmail, password: clientCopyPassword }
        : undefined,
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
    if (!isCurrentSlideValid) return;
    void handleSubmit();
  };

  const currentSlideDesc = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;
  const isIntro = currentSlideDesc?.type === "intro";
  const isInstruction = currentSlideDesc?.type === "instruction";
  const totalSteps = slides.length - 1; // exclude intro

  // Get header info for the current slide
  const platformInfo = (() => {
    const slide = slides[currentSlide];
    if (!slide || slide.type === "intro") return null;
    if (slide.type === "upload")
      return { platform: "File Uploads", logo: undefined };
    if (slide.type === "clientCopy")
      return { platform: "Your Copy", logo: undefined };
    const platform =
      slide.type === "instruction" ? slide.platform : slide.group.platform;
    const logo = PLATFORM_LOGOS[platform];
    return { platform, logo };
  })();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 pb-20">
      <div className="w-full max-w-4xl py-8">
        {/* Platform header — above card, only on non-intro slides */}
        {!isIntro && platformInfo && (
          <div
            key={`header-${platformInfo.platform}`}
            className="animate-fade-in-up mx-auto mb-6 flex max-w-2xl items-center gap-4"
          >
            {platformInfo.logo ? (
              <Image
                src={platformInfo.logo}
                alt={`${platformInfo.platform} logo`}
                width={48}
                height={48}
                className="rounded-xl"
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-700 text-xl font-bold text-gray-300">
                {platformInfo.platform.charAt(0)}
              </span>
            )}
            <h2 className="text-3xl font-bold text-gray-100">
              {platformInfo.platform}
            </h2>
          </div>
        )}

        {/* Content area with desktop side navigation */}
        <div className="relative mx-auto max-w-2xl">
          {/* Desktop back button — left side of card */}
          {!isIntro && currentSlide > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="absolute top-1/2 right-[calc(100%+1.25rem)] z-10 hidden h-11 -translate-y-1/2 cursor-pointer items-center gap-1 rounded-full border border-gray-700 bg-gray-800/80 pl-3 pr-4 text-gray-400 transition-colors hover:border-gray-600 hover:bg-gray-700 hover:text-gray-200 lg:flex"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}

          {/* Slides */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-400 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {slides.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex w-full flex-shrink-0 flex-col justify-center px-1"
                >
                  {slide.type === "intro" && (
                    <IntroSlide
                      clientName={config.clientName}
                      onStart={goNext}
                    />
                  )}

                  {slide.type === "instruction" && (
                    <InstructionSlide step={slide.step} onNext={goNext} />
                  )}

                  {slide.type === "credential" && (
                    <CredentialInput
                      group={slide.group}
                      values={values[slide.groupIndex] ?? {}}
                      onChange={(field, value) =>
                        handleFieldChange(slide.groupIndex, field, value)
                      }
                    />
                  )}

                  {slide.type === "upload" && (
                    <UploadSlide uploads={uploads} onChange={setUploads} />
                  )}

                  {slide.type === "clientCopy" && (
                    <ClientCopySlide
                      enabled={clientCopyEnabled}
                      onEnabledChange={setClientCopyEnabled}
                      email={clientCopyEmail}
                      onEmailChange={setClientCopyEmail}
                      password={clientCopyPassword}
                      onPasswordChange={setClientCopyPassword}
                      confirmPassword={clientCopyConfirmPassword}
                      onConfirmPasswordChange={setClientCopyConfirmPassword}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop next button — right side of card (hidden on instruction slides) */}
          {!isIntro && !isLastSlide && !isInstruction && (
            <button
              type="button"
              onClick={goNext}
              disabled={!isCurrentSlideValid}
              className={`absolute top-1/2 left-[calc(100%+1.25rem)] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-colors lg:flex ${
                isCurrentSlideValid
                  ? "bg-brand-500 hover:bg-brand-400 cursor-pointer text-white"
                  : "cursor-not-allowed border border-gray-700 bg-gray-800/80 text-gray-600"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Desktop submit button — right side of card (last slide only) */}
          {!isIntro && isLastSlide && (
            <button
              type="button"
              onClick={handleLastSlideAction}
              disabled={submitting || !isCurrentSlideValid}
              className={`group absolute top-1/2 left-[calc(100%+1.25rem)] z-10 hidden h-11 -translate-y-1/2 items-center rounded-full transition-all duration-300 disabled:opacity-50 lg:flex ${
                isCurrentSlideValid
                  ? "bg-brand-500 hover:bg-brand-400 cursor-pointer text-white"
                  : "cursor-not-allowed border border-gray-700 bg-gray-800/80 text-gray-600"
              }`}
            >
              {submitting ? (
                <div className="flex h-11 w-11 items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </div>
              ) : (
                <>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                    <Send className="h-4 w-4" />
                  </div>
                  <span className="max-w-0 overflow-hidden pr-0 text-sm font-semibold whitespace-nowrap transition-all duration-300 group-hover:max-w-24 group-hover:pr-4">
                    Send!
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Security disclaimer — below card on intro */}
        {isIntro && (
          <div className="mx-auto mt-4 flex max-w-2xl flex-col items-center justify-center text-center">
            <p className="max-w-sm text-base text-gray-500">
              All data is encrypted and transmitted securely. Your credentials
              will be kept in a password-protected file, and never stored
              online.
            </p>

            {/* Security info tooltip */}
            <div className="group text-brand-500/90 hover:text-brand-400 relative mt-4 inline-flex cursor-default items-center gap-1.5 tracking-wide transition-colors">
              <ShieldCheck className="h-4 w-4" />
              <span>How is my data handled?</span>

              <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2.5 w-72 -translate-x-1/2 rounded-xl border border-gray-700 bg-gray-900 p-4 text-left opacity-0 shadow-xl shadow-black/30 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                <p className="mb-2 text-lg font-semibold text-gray-200">
                  Your data is safe
                </p>
                <ul className="space-y-1.5 leading-relaxed text-gray-400">
                  <li>
                    All data is transmitted over an encrypted HTTPS connection.
                  </li>
                  <li>
                    Your credentials are used to generate a password-protected
                    PDF that is sent directly to our team.
                  </li>
                  <li>
                    No credentials are ever stored on our servers — once the PDF
                    is generated, the data is gone.
                  </li>
                  <li>
                    This form link expires automatically after a set period.
                  </li>
                </ul>
                {/* Tooltip arrow */}
                <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-gray-700 bg-gray-900" />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && isLastSlide && (
          <p className="mx-auto mt-3 max-w-2xl text-base text-red-400">
            {error}
          </p>
        )}

        {/* Progress bar */}
        {!isIntro && (
          <SlideProgress current={currentSlide} total={totalSteps} />
        )}

        {/* Mobile navigation — below card */}
        {!isIntro && (
          <div className="mx-auto max-w-2xl">
            <SlideNavigation
              onBack={goBack}
              onNext={isLastSlide ? handleLastSlideAction : goNext}
              isFirst={currentSlide <= 0}
              isLast={isLastSlide}
              isSubmitting={submitting}
              nextDisabled={!isCurrentSlideValid}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function FormPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
          <div className="w-full max-w-2xl space-y-6 py-8">
            {/* Skeleton card */}
            <div className="animate-pulse rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-lg shadow-black/25">
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
