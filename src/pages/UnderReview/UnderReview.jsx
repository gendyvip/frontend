import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UnderReview() {
  return (
    <div className="flex min-h-screen items-center justify-center py-20 px-4">
      <Card className="w-full max-w-2xl border border-[#e5e7eb] dark:border-border bg-white/95 dark:bg-background shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-6 pt-12 pb-4">
          <div className="bg-[#f1f5f9] dark:bg-card border border-[#e2e8f0] dark:border-border rounded-full p-6 mb-2">
            <img
              src="/Pharmacist-bro.svg"
              alt="Account Under Review"
              className="w-28 h-28 object-contain"
              draggable="false"
            />
          </div>
          <Badge
            variant="outline"
            className="text-base px-5 py-2 bg-[#fef9c3] dark:bg-yellow-900/30 text-[#b45309] dark:text-yellow-200 border-[#fde68a] dark:border-yellow-800 tracking-wide uppercase font-semibold shadow-none"
          >
            Under Review
          </Badge>
          <CardTitle className="text-3xl font-extrabold text-[#1e293b] dark:text-foreground text-center tracking-tight">
            Your Account is Under Review
          </CardTitle>
          <CardDescription className="text-lg text-[#475569] dark:text-gray-300 text-center max-w-xl font-medium">
            We’re currently reviewing your account to ensure the highest
            standards of security and compliance. This process is usually
            completed within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pb-2">
          <div className="w-full max-w-lg mx-auto">
            <div className="bg-[#f8fafc] dark:bg-card border border-[#e2e8f0] dark:border-border rounded-xl px-6 py-5 text-[#334155] dark:text-gray-200 text-base font-normal leading-relaxed">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Your information is being carefully verified by our team.
                </li>
                <li>
                  You will receive an email update as soon as your account is
                  approved or if we need more details.
                </li>
                <li>
                  For your privacy, some features are temporarily restricted.
                </li>
                <li>
                  If you have urgent questions, our support team is here to
                  help.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-3 pb-10 pt-4">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-base font-semibold border-[#cbd5e1] dark:border-border text-[#1e293b] dark:text-foreground bg-white dark:bg-card hover:bg-[#f1f5f9] dark:hover:bg-muted/10 shadow-none"
            onClick={() =>
              (window.location.href = "mailto:support@dawaback.com")
            }
          >
            Contact Support
          </Button>
          <div className="text-xs text-[#64748b] dark:text-gray-400 text-center mt-1">
            Need assistance? Email us at{" "}
            <a
              href="mailto:support@dawaback.com"
              className="underline text-[#2563eb] dark:text-blue-400"
            >
              support@dawaback.com
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
