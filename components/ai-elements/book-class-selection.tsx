"use client";

import { Calendar, Clock, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
      message: string;
      classes?: ClassItem[];
    };
    input?: {
      classes: ClassItem[];
    };
  };
  onConfirm?: (selectedIndices: number[]) => void;
}

export function BookClassSelectionDisplay({
  part,
  onConfirm,
}: BookClassSelectionDisplayProps) {
  const classes = part.result?.classes || part.input?.classes || [];

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const toggleSelection = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleConfirm = async () => {
    if (selectedIndices.length === 0) return;
    setHasConfirmed(true);
    onConfirm?.(selectedIndices);
  };

  // Hide selection UI if user has confirmed their selection
  if (hasConfirmed) {
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
              "flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50",
              selectedIndices.includes(index)
                ? "border-primary bg-primary/5"
                : "border-border bg-background"
            )}
          >
            <Checkbox
              id={`class-${index}`}
              checked={selectedIndices.includes(index)}
              onCheckedChange={() => toggleSelection(index)}
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
          disabled={selectedIndices.length === 0}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-6 text-base disabled:opacity-50"
        >
          Confirm Selected Classes
          {selectedIndices.length > 0 && ` (${selectedIndices.length})`}
        </Button>
      </div>
    </div>
  );
}
