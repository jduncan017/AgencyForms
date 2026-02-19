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
    <Card className="min-h-[400px] md:p-16 lg:p-20">
      <div className="space-y-5">
        <h3 className="text-xl font-semibold text-gray-100">
          Would you like a copy?
        </h3>

        <p className="text-base leading-relaxed text-gray-400">
          We&apos;ll send you a password-protected PDF of your login credentials
          for your records. Remember your password — you&apos;ll need it to open
          the file.
        </p>

        <Checkbox
          label="Yes, send me a copy"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
        />

        {enabled && (
          <div className="space-y-4 pt-1">
            <Input
              label="Your Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
            />

            <div>
              <PasswordInput
                label="Choose a PDF Password"
                placeholder="Enter a password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
              />
              <p className="mt-1.5 text-sm text-gray-500">
                You&apos;ll use this to access the PDF with your login
                credentials.
              </p>
            </div>

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
      </div>
    </Card>
  );
}
