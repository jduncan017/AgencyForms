"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { type CredentialGroup } from "~/lib/types";
import { encodeConfig } from "~/lib/config-codec";
import { PresetSelector } from "~/components/PresetSelector";
import { CustomFieldGroup } from "~/components/CustomFieldGroup";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";

export default function GeneratePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [returnEmail, setReturnEmail] = useState("");
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(
    new Set(),
  );
  const [customGroups, setCustomGroups] = useState<CredentialGroup[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detailsValid =
    clientName.trim() && clientEmail.trim() && returnEmail.trim();
  const hasFields = selectedPresets.size > 0 || customGroups.length > 0;
  const isValid = detailsValid && hasFields;

  const buildLink = () => {
    const encoded = encodeConfig({
      clientName: clientName.trim(),
      returnEmail: returnEmail.trim(),
      presets: Array.from(selectedPresets),
      custom: customGroups.filter(
        (g) => g.platform.trim() && g.fields.length > 0,
      ),
    });
    return `${window.location.origin}/form?data=${encoded}`;
  };

  const navigateToSent = (link: string, email?: string) => {
    sessionStorage.setItem("sentLink", link);
    const params = email
      ? `?email=${encodeURIComponent(email)}`
      : "";
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
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-950 px-4">
      <div className="relative w-full max-w-2xl overflow-hidden py-8">
        <div
          className="flex transition-transform duration-400 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {/* Slide 0: Client Details */}
          <div className="w-full flex-shrink-0 px-1">
            <div className="animate-fade-in-up space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-100">
                  Generate Credential Request
                </h1>
                <p className="mt-1 text-base text-gray-400">
                  Enter client details, then select which credentials to collect.
                </p>
              </div>
              <Card>
                <h2 className="mb-4 text-xl font-semibold text-gray-100">
                  Details
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Client Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Acme Corp"
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
                  <Input
                    label="Return Email (receives the PDF)"
                    type="email"
                    value={returnEmail}
                    onChange={(e) => setReturnEmail(e.target.value)}
                    placeholder="you@digitalnova.studio"
                    required
                  />
                </div>
              </Card>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setCurrentSlide(1)}
                  disabled={!detailsValid}
                >
                  Next &rarr;
                </Button>
              </div>
            </div>
          </div>

          {/* Slide 1: Credential Selection */}
          <div className="w-full flex-shrink-0 px-1">
            <div className="space-y-6">
              {/* Back button top-left */}
              <button
                type="button"
                onClick={() => setCurrentSlide(0)}
                className="flex cursor-pointer items-center gap-1.5 text-base text-gray-400 transition-colors hover:text-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-100">
                  Select Credentials
                </h1>
                <p className="mt-1 text-base text-gray-400">
                  Choose which credentials to request from{" "}
                  <span className="font-medium text-gray-200">{clientName || "the client"}</span>.
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

              {/* Actions */}
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
        </div>
      </div>
    </main>
  );
}
