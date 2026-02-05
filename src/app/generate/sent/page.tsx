"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Send, Link as LinkIcon } from "lucide-react";
import { Card } from "~/components/ui/Card";
import { CopyField } from "~/components/ui/CopyField";
import { Button } from "~/components/ui/Button";

function SentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("sentLink");
    if (stored) {
      setLink(stored);
      sessionStorage.removeItem("sentLink");
    }
  }, []);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-950 px-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in-up space-y-6">
        <Card className="text-center">
          <div className="space-y-4 py-4">
            <div className="mx-auto flex h-14 w-14 animate-scale-in items-center justify-center rounded-full bg-brand-900/30">
              {email ? (
                <Send className="h-6 w-6 text-brand-400" />
              ) : (
                <LinkIcon className="h-6 w-6 text-brand-400" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-100">
              {email ? "Link Sent" : "Link Generated"}
            </h1>
            {email && (
              <p className="text-base text-gray-400">
                The credential request form has been sent to{" "}
                <span className="font-medium text-gray-200">{email}</span>.
              </p>
            )}
          </div>
        </Card>

        {link && <CopyField label="Form Link" value={link} />}

        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/generate")}
          >
            &larr; Back to Start
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function SentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-950">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-brand-500" />
        </main>
      }
    >
      <SentContent />
    </Suspense>
  );
}
