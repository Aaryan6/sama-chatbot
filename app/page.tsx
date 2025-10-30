'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import TypewriterText from '@/components/typewritterText'
import Chatbot from '@/components/chatbot'

export default function Home() {
 

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
                  <div className="pl-3 sm:pl-4 md:pl-5 lg:pl-5 hidden sm:flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                    <div className="flex justify-start items-center cursor-pointer pointer-events-none">
                      <div className="flex flex-col justify-center text-[#527575]/80 text-xs md:text-[13px] font-medium leading-[14px] font-sans">
                        SAMA
                      </div>
                    </div>
                    <div className="flex justify-start items-center">
                        <div className="flex flex-col justify-center text-[#527575]/80 text-xs md:text-[13px] font-medium leading-[14px] font-sans">
                        About
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3 relative z-50 pointer-events-auto">
                  <Button
                  
                    className={`px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] overflow-hidden rounded-full flex justify-center items-center cursor-pointer shadow-[0px_1px_2px_rgba(55,50,47,0.12)] transition-colors relative z-[140] pointer-events-auto `}
          
                  >
                    Log in
                  </Button>
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
                      texts={[
                        "Personalized wellness",
                        "Memory intelligence",
                      ]}
                      speed={80}
                      pauseTime={3000}
                    />
                  </div>

                  <Link href="/chat">
                    <Button>
                      Let's Start
                    </Button>
                  </Link>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-[#527575]/80 sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-normal lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-[1.3rem] sm:text-[1.3em] font-medium text-[1.3em]">
                    An intentionally mindful wellness approach thoughtfully crafted for contemporary, fast-paced lives and for achieving improved, prolonged healthspan.
                    <br className="hidden sm:block" />
                    Welcome to SAMA – the destination where equilibrium, serenity, and empowered strength beautifully unite and flourish together.
                  </div>
                </div>
              </div>

             {/* <Chatbot /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}