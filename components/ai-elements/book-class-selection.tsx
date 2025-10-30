"use client";

import { Calendar, Clock, User, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ClassItem {
  className: string;
  date: string;
  time: string;
  instructor?: string;
}

interface BookClassSelectionDisplayProps {
  part: {
    type: string;
    result?: {
      success: boolean;
      mode: "selection" | "confirm";
      message: string;
      classes?: ClassItem[];
      bookedClasses?: ClassItem[];
    };
    input?: {
      classes: ClassItem[];
      mode?: "selection" | "confirm";
      selectedIndices?: number[];
    };
  };
  onConfirm?: (selectedIndices: number[]) => void;
}

export function BookClassSelectionDisplay({
  part,
  onConfirm,
}: BookClassSelectionDisplayProps) {
  const mode = part.result?.mode || part.input?.mode || "selection";
  const isCompleted = mode === "confirm" && part.result?.success;
  const classes = part.result?.classes || part.input?.classes || [];
  const bookedClasses = part.result?.bookedClasses || [];

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  // Derive submitting state - if completed, we're not submitting anymore
  const actuallySubmitting = isSubmitting && !isCompleted;

  const toggleSelection = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleConfirm = async () => {
    if (selectedIndices.length === 0) return;
    setIsSubmitting(true);
    setHasConfirmed(true);
    onConfirm?.(selectedIndices);
  };

  // Show confirmation/success state
  if (isCompleted && bookedClasses.length > 0) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border-2 bg-background border-border dark:bg-emerald-950/20 dark:border-emerald-800 p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="size-5" />
            <h3 className="font-semibold text-base">
              {part.result?.message || "Classes Booked Successfully!"}
            </h3>
          </div>

          <div className="border-t border-current opacity-20" />

          <div className="space-y-2">
            {bookedClasses.map((classItem, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
              >
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-sm text-foreground">
                    {classItem.className}
                  </h4>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{classItem.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{classItem.time}</span>
                    </div>
                    {classItem.instructor && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{classItem.instructor}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Hide selection UI if user has confirmed their selection
  // This prevents showing the loading state when the confirmation message appears
  if (hasConfirmed && mode === "selection") {
    return null;
  }

  // Don't show selection UI if we're in submitting state AND classes are empty
  // This happens when the new booking confirmation message appears
  if (actuallySubmitting && classes.length === 0) {
    return null;
  }

  // Show selection state
  return (
    <div className="rounded-xl border-2 bg-background border-border p-4 space-y-4 max-w-2xl">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {part.result?.message || "Select the classes you want to book:"}
        </p>
      </div>

      {/* Class List with Checkboxes */}
      <div className="space-y-2">
        {classes.map((classItem, index) => (
          <label
            key={index}
            htmlFor={`class-${index}`}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border-2 transition-all",
              selectedIndices.includes(index)
                ? "border-primary bg-primary/5"
                : "border-border bg-background",
              actuallySubmitting
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:border-primary/50"
            )}
          >
            <Checkbox
              id={`class-${index}`}
              checked={selectedIndices.includes(index)}
              onCheckedChange={() => toggleSelection(index)}
              disabled={actuallySubmitting}
              className="mt-1 border-2 border-primary"
            />
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-sm text-foreground">
                {classItem.className}
              </h4>
              <div className="flex text-xs flex-wrap gap-3 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{classItem.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{classItem.time}</span>
                </div>
                {classItem.instructor && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{classItem.instructor}</span>
                  </div>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Confirm Button */}
      <div className="pt-2">
        <Button
          onClick={handleConfirm}
          disabled={selectedIndices.length === 0 || actuallySubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-6 text-base disabled:opacity-50"
        >
          {actuallySubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            <>
              Confirm Selected Classes
              {selectedIndices.length > 0 && ` (${selectedIndices.length})`}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
