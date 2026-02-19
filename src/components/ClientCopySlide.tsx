"use client";

import { Card } from "~/components/ui/Card";
import { Checkbox } from "~/components/ui/Checkbox";
import { Input } from "~/components/ui/Input";
import { PasswordInput } from "~/components/ui/PasswordInput";

interface ClientCopySlideProps {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  email: string;
  onEmailChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (v: string) => void;
}

export function ClientCopySlide({
  enabled,
  onEnabledChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
}: ClientCopySlideProps) {
  const passwordsMatch = password === confirmPassword;
  const showMismatch = enabled && confirmPassword.length > 0 && !passwordsMatch;

  return (
    <Card>
      <h3 className="mb-1 text-center text-xl font-semibold text-gray-100">
        Keep a Copy
      </h3>
      <p className="mb-6 text-center text-sm text-gray-400">
        Optionally receive a password-protected copy of your credentials.
      </p>

      <Checkbox
        label="Send me a password-protected copy"
        checked={enabled}
        onChange={(e) => onEnabledChange(e.target.checked)}
      />

      {enabled && (
        <div className="mt-5 space-y-4">
          <Input
            label="Your Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />

          <PasswordInput
            label="Choose a PDF Password"
            placeholder="Enter a password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />

          <div>
            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
            />
            {showMismatch && (
              <p className="mt-1.5 text-sm text-red-400">
                Passwords do not match.
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
