"use client";
import TypewriterText from "@/components/typewritterText";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

type Persona = "sheila" | "ritvik" | "gaurav";

const personaData = {
  sheila: {
    name: "Sheila",
    description: "Marketing Manager",
    image: "/images/sheela.png",
    color: "bg-pink-500",
  },
  ritvik: {
    name: "Ritvik",
    description: "Senior Software Engineer",
    image: "/images/ritvik.png",
    color: "bg-blue-500",
  },
  gaurav: {
    name: "Gaurav",
    description: "Founder & CEO",
    image: "/images/gourav.png",
    color: "bg-purple-500",
  },
};

export default function Home() {
  const router = useRouter();

  const handlePersonaSelect = (persona: Persona) => {
    router.push(`/chat?persona=${persona}`);
  };

  return (
    <div className="w-full min-h-screen text-[#527575] relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-px h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line */}
          <div className="w-px h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* Navigation */}
            <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-[120] px-6 sm:px-8 md:px-12 lg:px-0 pointer-events-auto">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white] z-10 pointer-events-none"></div>

              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-[#F7F5F3] text-[#527575] backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-[130] pointer-events-auto">
                <div className="flex justify-center items-center pointer-events-none">
                  <div className="flex justify-start items-center">
                    <div className="flex flex-col justify-center text-[#527575] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                      SIA
                    </div>
                  </div>
                </div>
                <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3 relative z-50 pointer-events-auto">
                  <Link
                    href="/chat"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Chat
                  </Link>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[156px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0 relative z-20">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="w-full max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-#527575 text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
                    Stronger, Calmer.
                    <br />
                    For Life.
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col sm:text-lg md:text-2xl leading-[1.4] sm:leading-[1.45] md:leading-normal lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm text-[#527575]">
                    <TypewriterText
                      texts={["Personalized wellness", "Memory intelligence"]}
                      speed={80}
                      pauseTime={3000}
                    />
                  </div>

                  {/* CTA Button */}
                  <div className="flex gap-4 mt-4">
                    <Link href="#personas">
                      <Button
                        size="lg"
                        className="text-base sm:text-lg px-8 py-6"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>

                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-[#527575]/80 sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-normal lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-[1.3rem] sm:text-[1.3em] font-medium text-[1.3em]">
                    An intentionally mindful wellness approach thoughtfully
                    crafted for contemporary, fast-paced lives and for achieving
                    improved, prolonged healthspan.
                    <br className="hidden sm:block" />
                    Welcome to SAMA – the destination where equilibrium,
                    serenity, and empowered strength beautifully unite and
                    flourish together.
                  </div>
                </div>
              </div>

              {/* Persona Selection Section */}
              <div
                id="personas"
                className="w-full flex flex-col items-center gap-6 py-12"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#527575]">
                    Who are you scheduling for today?
                  </h2>
                  <p className="text-sm md:text-base text-[#527575]/70">
                    Select a persona to get personalized recommendations
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full px-4">
                  {(["sheila", "ritvik", "gaurav"] as Persona[]).map(
                    (persona) => (
                      <button
                        key={persona}
                        onClick={() => handlePersonaSelect(persona)}
                        className="flex cursor-pointer flex-col items-center gap-4 p-6 rounded-2xl border-2 border-[rgba(55,50,47,0.12)] hover:border-[#527575] hover:bg-white/50 transition-all duration-200 w-full sm:w-56 group shadow-sm hover:shadow-md"
                      >
                        <Avatar className="h-24 w-24 ring-4 ring-background group-hover:ring-[#527575]/20 transition-all">
                          <AvatarImage
                            src={personaData[persona].image}
                            alt={personaData[persona].name}
                            className="object-cover"
                          />
                          <AvatarFallback
                            className={cn(
                              personaData[persona].color,
                              "text-white text-2xl"
                            )}
                          >
                            {personaData[persona].name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center space-y-1">
                          <h3 className="text-lg font-semibold text-[#527575]">
                            {personaData[persona].name}
                          </h3>
                          <p className="text-sm text-[#527575]/70">
                            {personaData[persona].description}
                          </p>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="w-full border-t border-[rgba(55,50,47,0.06)] bg-[#F7F5F3] py-8 mt-auto relative z-10">
            <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm text-[#527575]/80">
                    © 2025 SAMA. All rights reserved.
                  </p>
                </div>
                <div className="flex gap-6 text-sm text-[#527575]/80">
                  <Link
                    href="#"
                    className="hover:text-[#527575] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-[#527575] transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-[#527575] transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
