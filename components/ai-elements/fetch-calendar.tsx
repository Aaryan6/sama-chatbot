"use client";

import { Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FetchCalendarDisplayProps {
  part: {
    type: string;
    result?: {
      success: boolean;
      message?: string;
      events?: Array<{
        title: string;
        date: string;
        time: string;
        location?: string;
        with?: string;
      }>;
    };
    input?: {
      date: string;
    };
  };
}

const progressSteps = [
  { emoji: "📡", text: "Connecting to your calendar..." },
  { emoji: "🔎", text: "Fetching today’s events..." },
  { emoji: "✨", text: "Preparing a quick summary" },
];

export function FetchCalendarDisplay({ part }: FetchCalendarDisplayProps) {
  const isCompleted = part.result?.success;
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % progressSteps.length);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isCompleted]);

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-3 max-w-md transition-all",
        isCompleted
          ? "bg-background border-border dark:bg-emerald-950/20 dark:border-emerald-800"
          : "bg-white border-border dark:bg-blue-950/20 dark:border-blue-800"
      )}
    >
      {/* Collapsible Header - always visible */}
      <button
        type="button"
        className="w-full flex items-center justify-between gap-2 cursor-pointer"
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className="font-semibold text-base text-blue-600 flex items-center gap-2">
          <span className="relative inline-flex items-center justify-center">
            {!isCompleted && (
              <span className="absolute -inset-1 rounded-full border-2 border-blue-400/60 border-t-transparent animate-spin" />
            )}
            <Image
              src={`/images/calendar.png`}
              alt={"Google Calendar"}
              width={20}
              height={20}
              className="size-6"
            />
          </span>
          {isCompleted ? "Google Calendar" : progressSteps[currentStep].text}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Collapsed content */}
      {isOpen && (
        <div className="mt-3 space-y-3">
          {/* Date + status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground">
                Calendar for {part.input?.date}
              </h3>
              <p
                className={cn(
                  "text-sm font-medium mt-1 flex items-center gap-1.5",
                  isCompleted
                    ? "text-emerald-600 dark:text-emerald-300"
                    : "text-blue-700 dark:text-blue-300"
                )}
              >
                {!isCompleted && (
                  <Loader2 className="size-4 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
                )}
                {isCompleted && (
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                )}
                {isCompleted ? "Events fetched" : progressSteps[currentStep].text}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-current opacity-20" />

          {/* Footer message */}
          {isCompleted && part.result?.message && (
            <p className="text-xs text-foreground font-medium">
              {part.result.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


