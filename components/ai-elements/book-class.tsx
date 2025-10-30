"use client";

import { Calendar, Clock, User, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BookClassDisplayProps {
  part: {
    type: string;
    result?: {
      success: boolean;
      message: string;
    };
    input?: {
      className: string;
      date: string;
      time: string;
      instructor?: string;
    };
  };
}

const progressSteps = [
  { emoji: "📅", text: "Checking your calendar..." },
  { emoji: "🔍", text: "Looking for a slot..." },
  { emoji: "✨", text: "Adding a slot" },
];

export function BookClassDisplay({ part }: BookClassDisplayProps) {
  const isCompleted = part.result?.success;
  const [currentStep, setCurrentStep] = useState(0);

  // Cycle through progress steps one at a time
  useEffect(() => {
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % progressSteps.length);
      }, 2000); // Change step every 1.2 seconds
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
            {part.input?.className}
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
            {isCompleted && "Booking Confirmed"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-current opacity-20" />

      {/* Progress Steps - Show one step at a time with spinner */}
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

      {/* Details - Show only when completed */}
      {isCompleted && (
        <div className="flex gap-2">
          <div className="flex items-center gap-3 text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs font-medium">{part.input?.date}</span>
          </div>

          <div className="flex items-center gap-3 text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs font-medium">{part.input?.time}</span>
          </div>

          {part.input?.instructor && (
            <div className="flex items-center gap-3 text-foreground">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs font-medium">
                Instructor: {part.input?.instructor}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Result Message */}
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
