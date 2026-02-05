"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check } from "lucide-react";
import { type CredentialGroup } from "~/lib/types";
import { encodeConfig } from "~/lib/config-codec";
import { PRESETS } from "~/lib/presets";
import { PLATFORM_LOGOS } from "~/lib/providers";
import { PresetSelector } from "~/components/PresetSelector";
import { CustomFieldGroup } from "~/components/CustomFieldGroup";
import { Input } from "~/components/ui/Input";
import { Checkbox } from "~/components/ui/Checkbox";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";

export default function GeneratePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const DEFAULT_RETURN_EMAIL = "josh@digitalnovastudio.com";
  const [returnEmailOption, setReturnEmailOption] = useState<
    "default" | "custom"
  >("default");
  const [returnEmail, setReturnEmail] = useState(DEFAULT_RETURN_EMAIL);
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(
    new Set(),
  );
  const [customGroups, setCustomGroups] = useState<CredentialGroup[]>([]);
  const [requestUploads, setRequestUploads] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detailsValid =
    businessName.trim() &&
    clientName.trim() &&
    clientEmail.trim() &&
    returnEmail.trim();
  const hasFields = selectedPresets.size > 0 || customGroups.length > 0;
  const isValid = detailsValid && hasFields;

  const buildLink = () => {
    const encoded = encodeConfig({
      clientName: clientName.trim(),
      businessName: businessName.trim(),
      returnEmail: returnEmail.trim(),
      presets: Array.from(selectedPresets),
      custom: customGroups.filter(
        (g) => g.platform.trim() && g.fields.length > 0,
      ),
      expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
      requestUploads,
    });
    return `${window.location.origin}/form?data=${encoded}`;
  };

  const navigateToSent = (link: string, email?: string) => {
    sessionStorage.setItem("sentLink", link);
    const params = email ? `?email=${encodeURIComponent(email)}` : "";
    router.push(`/generate/sent${params}`);
  };

  const handleGenerate = () => {
    if (!isValid) return;
    navigateToSent(buildLink());
  };

  const handleSend = async () => {
    if (!isValid) return;
    setSending(true);
    setError(null);

    const link = buildLink();

    try {
      const res = await fetch("/api/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          businessName: businessName.trim(),
          clientEmail: clientEmail.trim(),
          link,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to send");
      }

      navigateToSent(link, clientEmail.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const addCustomGroup = () => {
    setCustomGroups((prev) => [
      ...prev,
      { platform: "", fields: ["username", "password"] },
    ]);
  };

  const updateCustomGroup = (index: number, group: CredentialGroup) => {
    setCustomGroups((prev) => prev.map((g, i) => (i === index ? group : g)));
  };

  const removeCustomGroup = (index: number) => {
    setCustomGroups((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full py-8">
        {currentSlide === 0 ? (
          /* ── Slide 0: Credential Selection ── */
          <div className="animate-fade-in-up mx-auto max-w-2xl space-y-6">
            <div className="flex justify-center">
              <Image
                src="/agencyforms-v.png"
                alt="AgencyForms"
                width={280}
                height={120}
                className="h-auto w-64"
                priority
              />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-100">
                Select Credentials
              </h1>
              <p className="mt-1 text-base text-gray-400">
                Choose which credentials to request from the client.
              </p>
            </div>

            <PresetSelector
              selected={selectedPresets}
              onChange={setSelectedPresets}
            />

            <CustomFieldGroup
              groups={customGroups}
              onChange={updateCustomGroup}
              onRemove={removeCustomGroup}
              onAdd={addCustomGroup}
            />

            <Card>
              <Checkbox
                label="Request image uploads (logos, brand assets, etc.)"
                checked={requestUploads}
                onChange={(e) => setRequestUploads(e.target.checked)}
              />
            </Card>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setCurrentSlide(1)}
                disabled={!hasFields}
              >
                Next &rarr;
              </Button>
            </div>
          </div>
        ) : (
          /* ── Slide 1: Client Details + Summary Sidebar ── */
          <div className="relative mx-auto max-w-2xl">
            {/* Summary sidebar — positioned to the left on large screens */}
            <div className="mb-6 lg:absolute lg:right-full lg:top-0 lg:mb-0 lg:mr-6 lg:w-56">
              <div className="lg:sticky lg:top-20">
                <Card className="opacity-60">
                  <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                    Selected
                  </h3>
                  <div className="space-y-2.5">
                    {Array.from(selectedPresets).map((code) => {
                      const preset = PRESETS.find((p) => p.code === code);
                      if (!preset) return null;
                      const logo = PLATFORM_LOGOS[preset.group.platform];
                      return (
                        <div key={code} className="flex items-center gap-2">
                          <Check className="h-4 w-4 shrink-0 text-green-400" />
                          {logo ? (
                            <Image
                              src={logo}
                              alt=""
                              width={16}
                              height={16}
                              className="shrink-0 rounded"
                            />
                          ) : (
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-gray-600 text-[8px] font-bold text-gray-300">
                              {preset.group.platform.charAt(0)}
                            </span>
                          )}
                          <span className="text-sm text-gray-300">
                            {preset.group.platform}
                          </span>
                        </div>
                      );
                    })}
                    {customGroups
                      .filter((g) => g.platform.trim())
                      .map((group, i) => (
                        <div
                          key={`custom-${i}`}
                          className="flex items-center gap-2"
                        >
                          <Check className="h-4 w-4 shrink-0 text-green-400" />
                          <span className="text-sm text-gray-300">
                            {group.platform}
                          </span>
                        </div>
                      ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentSlide(0)}
                    className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-gray-400 transition-colors hover:border-gray-600 hover:text-gray-200"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Edit Selections
                  </button>
                </Card>
              </div>
            </div>

            {/* Details form — centered */}
            <div className="animate-fade-in-up space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-100">
                  Where to send it?
                </h1>
                <p className="mt-1 text-base text-gray-400">
                  Enter client details to generate or send the form link.
                </p>
              </div>

              <Card>
                <h2 className="mb-4 text-xl font-semibold text-gray-100">
                  Client Details
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Acme Corp"
                    required
                  />
                  <Input
                    label="Client Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="John Smith"
                    required
                  />
                  <Input
                    label="Client Email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@example.com"
                    required
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="return-email"
                      className="block text-base font-medium text-gray-300"
                    >
                      Return Email (receives credentials)
                    </label>
                    <select
                      id="return-email"
                      value={returnEmailOption}
                      onChange={(e) => {
                        const val = e.target.value as "default" | "custom";
                        setReturnEmailOption(val);
                        setReturnEmail(
                          val === "default" ? DEFAULT_RETURN_EMAIL : "",
                        );
                      }}
                      className="focus:border-brand-500 w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-base text-gray-100 transition-colors focus:shadow-[0_0_0_3px_rgba(0,167,211,0.15)] focus:outline-none"
                    >
                      <option value="default">{DEFAULT_RETURN_EMAIL}</option>
                      <option value="custom">Custom email</option>
                    </select>
                    {returnEmailOption === "custom" && (
                      <input
                        type="email"
                        value={returnEmail}
                        onChange={(e) => setReturnEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="focus:border-brand-500 mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-base text-gray-100 placeholder-gray-500 transition-colors focus:shadow-[0_0_0_3px_rgba(0,167,211,0.15)] focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              </Card>

              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={handleGenerate}
                  disabled={!isValid}
                >
                  Generate Link
                </Button>
                <Button
                  onClick={() => void handleSend()}
                  disabled={!isValid}
                  isLoading={sending}
                >
                  Send to Client
                </Button>
              </div>

              {error && <p className="text-base text-red-400">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
