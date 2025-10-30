"use client";

import { Calendar, Clock, User, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassItem {
  className: string;
  date: string;
  time: string;
  instructor?: string;
}

interface BookingSuccessDisplayProps {
  part: {
    type: string;
    result?: {
      success: boolean;
      message: string;
      bookedClasses?: ClassItem[];
    };
    input?: {
      bookedClasses?: ClassItem[];
    };
  };
}

export function BookingSuccessDisplay({ part }: BookingSuccessDisplayProps) {
  const bookedClasses =
    part.result?.bookedClasses || part.input?.bookedClasses || [];
  const message =
    part.result?.message ||
    `Successfully booked ${bookedClasses.length} ${
      bookedClasses.length === 1 ? "class" : "classes"
    }`;

  return (
    <div className="space-y-3">
      <div className="rounded-xl border-2 bg-background border-border dark:bg-emerald-950/20 dark:border-emerald-800 p-4 space-y-3">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="size-5" />
          <h3 className="font-semibold text-base">{message}</h3>
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
