"use client";

import { Suspense } from "react";
import Chatbot from "@/components/chatbot";
import { useSearchParams } from "next/navigation";

function ChatContent() {
  const searchParams = useSearchParams();
  const persona = searchParams.get("persona") as "sheila" | "ritvik" | "gaurav" | null;

  return (
    <div className="w-full h-screen flex-col text-[#527575] relative bg-[#F7F5F3] overflow-x-hidden flex justify-start items-center p-2">
      {/* Left vertical line */}
      <div className="w-px h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

      {/* Right vertical line */}
      <div className="w-px h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

      <Chatbot preSelectedPersona={persona} />
    </div>
  );
}

export default function Chat() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex-col text-[#527575] relative bg-[#F7F5F3] overflow-x-hidden flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#527575]"></div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
