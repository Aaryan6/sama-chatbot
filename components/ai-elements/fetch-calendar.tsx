"use client";

import { Loader2, CheckCircle2 } from "lucide-react";
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
        "rounded-xl border-2 p-4 space-y-3 max-w-md transition-all",
        isCompleted
          ? "bg-background border-border dark:bg-emerald-950/20 dark:border-emerald-800"
          : "bg-white border-border dark:bg-blue-950/20 dark:border-blue-800"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
            <Image
              src={`/images/calendar.png`}
              alt={"calendar"}
              width={20}
              height={20}
              className="size-6"
            />
            Calendar for {part.input?.date}
          </h3>
          <p
            className={cn(
              "text-sm font-medium mt-1 flex items-center gap-1",
              isCompleted
                ? "text-emerald-600 dark:text-emerald-300"
                : "text-blue-700 dark:text-blue-300"
            )}
          >
            {isCompleted && (
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            )}
            {isCompleted ? "Events fetched" : progressSteps[currentStep].text}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-current opacity-20" />

      {/* Progress */}
      {!isCompleted && (
        <div className="py-2">
          <div className="flex items-center gap-3 animate-in fade-in duration-300">
            <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
            <span className="text-sm font-medium text-foreground">
              {progressSteps[currentStep].text}
            </span>
          </div>
        </div>
      )}

      {/* Footer message */}
      {isCompleted && part.result?.message && (
        <>
          <div className="border-t border-current opacity-20" />
          <p className="text-xs text-foreground font-medium">
            {part.result.message}
          </p>
        </>
      )}
    </div>
  );
}


