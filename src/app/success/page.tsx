import { FormWrapper } from "~/components/FormWrapper";
import { Card } from "~/components/ui/Card";

export default function SuccessPage() {
  return (
    <FormWrapper title="Thank You">
      <Card className="text-center">
        <div className="space-y-3 py-4">
          <div className="mx-auto flex h-14 w-14 animate-scale-in items-center justify-center rounded-full bg-green-900/30">
            <svg
              className="h-7 w-7 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-100">
            Credentials Submitted
          </h2>
          <p className="text-base text-gray-400">
            Your credentials have been securely encrypted and delivered. You can
            safely close this page.
          </p>
        </div>
      </Card>
    </FormWrapper>
  );
}
