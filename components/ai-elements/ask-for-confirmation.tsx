"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Clock, User, Check } from "lucide-react";
import { useMemo, useState } from "react";

interface AskForConfirmationDisplayProps {
  part: {
    type: string;
    result?: {
      success: boolean;
      message: string;
      expectedResponse?: "yes-or-no";
    };
    input?: {
      message: string;
    };
  };
  onConfirm?: (message: string) => void;
}

export function AskForConfirmationDisplay({
  part,
  onConfirm,
}: AskForConfirmationDisplayProps) {
  const messageText = part.result?.message ?? part.input?.message ?? "";
  const classes = useMemo(() => {
    const found: Array<{ name: string; day: string; time: string; instructor: string }> = [];
    const pattern = /\*\*([^*]+)\*\*\s*\|\s*Day:\s*([^|]+)\|\s*Time:\s*([^|]+)\|\s*Instructor:\s*(.+?)(?=\n|$)/gi;
    let match;
    while ((match = pattern.exec(messageText)) !== null) {
      found.push({
        name: match[1].trim(),
        day: match[2].trim(),
        time: match[3].trim(),
        instructor: match[4].trim(),
      });
    }
    return found;
  }, [messageText]);

  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const numSelected = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-4 space-y-3 max-w-xl transition-all bg-background border-border"
      )}
    >
      <p className="text-sm text-foreground font-medium">{messageText}</p>

      {classes.length > 0 && (
        <div className="flex flex-col gap-3">
          {classes.map((c, idx) => {
            const checked = !!selected[idx];
            return (
              <button
                key={idx}
                onClick={() =>
                  setSelected((prev) => ({ ...prev, [idx]: !prev[idx] }))
                }
                className={cn(
                  "w-full text-left rounded-xl border-2 p-3 transition-all",
                  checked
                    ? "border-primary/60 bg-accent/50"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-1 h-5 w-5 rounded-md border-2 flex items-center justify-center",
                      checked
                        ? "border-primary bg-primary text-white"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {checked && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {c.name}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground flex flex-wrap gap-4">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {c.day}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {c.time}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="h-4 w-4" /> {c.instructor}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          <Button
            className="mt-1"
            disabled={numSelected === 0}
            onClick={() => {
              const chosen = classes.filter((_, i) => selected[i]);
              const summary = chosen
                .map((c) => `${c.name} on ${c.day} at ${c.time} with ${c.instructor}`)
                .join("; ");
              onConfirm?.(
                `I'd like to book: ${chosen.map((c) => c.name).join(", ")}. Details: ${summary}`
              );
            }}
          >
            Confirm Selected Classes
          </Button>
        </div>
      )}
    </div>
  );
}


