"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
import { Send, ArrowLeft } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageAvatar,
} from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";
import { BookClassDisplay } from "@/components/ai-elements/book-class";
import { BookClassSelectionDisplay } from "@/components/ai-elements/book-class-selection";
import { BookingSuccessDisplay } from "@/components/ai-elements/booking-success";
import { FetchCalendarDisplay } from "@/components/ai-elements/fetch-calendar";
//
import { useRouter } from "next/navigation";

type Persona = "sheila" | "ritvik" | "gaurav";

const personaData = {
  sheila: {
    name: "Sheila",
    description: "Marketing Manager, 24 weeks pregnant",
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

const suggestions = [
  "I want to add class on wednesday",
  "Find classes that fit my schedule",
  "Check my next week classes",
];

interface ChatbotProps {
  preSelectedPersona?: Persona | null;
}

export default function Chatbot({ preSelectedPersona }: ChatbotProps) {
  const router = useRouter();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(
    preSelectedPersona || null
  );
  const [input, setInput] = useState("");

  const personaNames = {
    sheila: "Sheila",
    ritvik: "Ritvik",
    gaurav: "Gaurav",
  };

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const selectPersona = (persona: Persona) => {
    setMessages([]);
    setSelectedPersona(persona);
    // Update URL search params
    router.push(`/chat?persona=${persona}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (selectedPersona && status === "ready") {
      sendMessage(
        { text: suggestion },
        {
          body: {
            persona: selectedPersona,
          },
        }
      );
    }
  };

  return (
    <div className="w-full mx-auto shadow-sm max-w-4xl h-full rounded-2xl overflow-hidden flex flex-col bg-background">
      {/* Header with Persona Selection */}
      {!selectedPersona ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar>
              <AvatarImage src="/images/yoga.jpg" alt="SAMA" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-semibold text-foreground">
                Hi there,
              </h1>
              <p className="text-xl text-muted-foreground">
                Who are you scheduling for today?
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            {(["sheila", "ritvik", "gaurav"] as Persona[]).map((persona) => (
              <button
                key={persona}
                onClick={() => selectPersona(persona)}
                className="flex cursor-pointer flex-col items-center gap-4 p-6 rounded-2xl border-2 border-border hover:border-primary hover:bg-accent/50 transition-all duration-200 w-56 group"
              >
                <Avatar className="h-24 w-24 ring-4 ring-background group-hover:ring-primary/20 transition-all">
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
                  <h3 className="text-lg font-semibold text-foreground">
                    {personaData[persona].name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {personaData[persona].description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Header with Persona Switcher */}
          <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
            <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Back Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/")}
                  className="h-9 w-9"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage
                    src="/images/yoga.jpg"
                    alt="SAMA"
                    className="bg-muted border-2 object-cover rounded-full"
                  />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <h3 className="text-sm font-semibold">
                    SAMA Studio Assistant
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Wellness scheduling companion
                  </p>
                </div>
              </div>

              {/* Persona Tabs */}
              <div className="ml-2 sm:ml-0 overflow-x-auto max-w-full">
                <Tabs
                  value={selectedPersona}
                  onValueChange={(value) => selectPersona(value as Persona)}
                >
                  <TabsList className="flex-nowrap gap-1 sm:gap-2 w-max">
                    {(["sheila", "ritvik", "gaurav"] as Persona[]).map(
                      (persona) => (
                        <TabsTrigger
                          key={persona}
                          value={persona}
                          className="px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm"
                        >
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarImage
                              src={personaData[persona].image}
                              alt={personaData[persona].name}
                            />
                            <AvatarFallback
                              className={cn(
                                personaData[persona].color,
                                "text-white text-xs"
                              )}
                            >
                              {personaData[persona].name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {personaData[persona].name}
                        </TabsTrigger>
                      )
                    )}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 overflow-hidden">
            <Conversation className="h-full">
              <ConversationContent className="px-4 py-6 max-w-3xl mx-auto">
                {/* Welcome Message */}
                {messages.length === 0 && selectedPersona && (
                  <div className="flex flex-col items-center space-y-8 py-12">
                    <div className="flex flex-col items-start space-y-3 w-full max-w-2xl">
                      <div className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl px-6 py-4 inline-flex items-center gap-2">
                        <h2 className="text-2xl font-semibold text-foreground">
                          Welcome, {personaNames[selectedPersona]}!
                        </h2>
                        <span className="text-2xl">👋</span>
                      </div>
                      <p className="text-xl text-muted-foreground px-2">
                        How can I help you today?
                      </p>
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((message, messageIndex) => (
                  <div key={message.id} className="mb-6">
                    <Message from={message.role} className="items-start w-full">
                      <div className="flex flex-col gap-2 w-full">
                        {message.parts.map((part, index) => {
                          const { type } = part;
                          if (type === "tool-fetchCalendar") {
                            const { state } = part;
                            if (
                              state === "output-available" ||
                              state === "input-available"
                            ) {
                              const { output, input } = part;
                              return (
                                <div key={index} className="">
                                  <FetchCalendarDisplay
                                    part={{
                                      type: part.type,
                                      result:
                                        state === "output-available"
                                          ? (output as {
                                              success: boolean;
                                              message?: string;
                                              events?: Array<{
                                                title: string;
                                                date: string;
                                                time: string;
                                                location?: string;
                                                with?: string;
                                              }>;
                                            })
                                          : undefined,
                                      input: input as {
                                        date: string;
                                      },
                                    }}
                                  />
                                </div>
                              );
                            }
                          }
                          return null;
                        })}
                        {/* Combine all text parts into a single message card */}
                        {(() => {
                          const textParts = message.parts.filter(
                            (p) => p.type === "text"
                          );
                          if (textParts.length === 0) return null;

                          const combinedText = textParts
                            .map((p) => p.text)
                            .join("\n\n");

                          return (
                            <MessageContent
                              className={cn(
                                "max-w-[80%] shadow-md",
                                message.role === "user" ? "ml-auto" : ""
                              )}
                            >
                              <Response>{combinedText}</Response>
                            </MessageContent>
                          );
                        })()}
                        {/* Show loading indicator if streaming with no content */}
                        {message.role === "assistant" &&
                          status === "streaming" &&
                          messageIndex === messages.length - 1 &&
                          !message.parts.some(
                            (p) => p.type === "text" && p.text.trim().length > 0
                          ) &&
                          message.parts.some((p) =>
                            p.type.startsWith("tool-")
                          ) && (
                            <MessageContent className="w-fit shadow-md">
                              <Response>Thinking...</Response>
                            </MessageContent>
                          )}
                        {/* Render tools with text that comes after them */}
                        <div className="max-w-[80%] w-full space-y-2">
                          {message.parts.map((part, index) => {
                            const { type } = part;

                            if (type === "tool-confirmBooking") {
                              const { state } = part;
                              // Only show when output is available AND not currently streaming
                              const isLastMessage =
                                messageIndex === messages.length - 1;
                              const isStreaming = status === "streaming";
                              const shouldShow =
                                state === "output-available" &&
                                (!isLastMessage || !isStreaming);

                              if (shouldShow) {
                                const { output, input } = part;
                                const typedInput = input as {
                                  bookedClasses: Array<{
                                    className: string;
                                    date: string;
                                    time: string;
                                    instructor?: string;
                                  }>;
                                };
                                const typedOutput = output as {
                                  success: boolean;
                                  message: string;
                                  bookedClasses?: Array<{
                                    className: string;
                                    date: string;
                                    time: string;
                                    instructor?: string;
                                  }>;
                                };

                                return (
                                  <div key={index}>
                                    <BookingSuccessDisplay
                                      part={{
                                        type: part.type,
                                        result: typedOutput,
                                        input: typedInput,
                                      }}
                                    />
                                  </div>
                                );
                              }
                            }

                            if (type === "tool-showClassOptions") {
                              const { state } = part;
                              // Only show when output is available AND not currently streaming
                              const isLastMessage =
                                messageIndex === messages.length - 1;
                              const isStreaming = status === "streaming";
                              const shouldShow =
                                state === "output-available" &&
                                (!isLastMessage || !isStreaming);

                              if (shouldShow) {
                                const { output, input } = part;
                                const typedInput = input as {
                                  classes: Array<{
                                    className: string;
                                    date: string;
                                    time: string;
                                    instructor?: string;
                                  }>;
                                };
                                const typedOutput = output as {
                                  success: boolean;
                                  message: string;
                                  classes?: Array<{
                                    className: string;
                                    date: string;
                                    time: string;
                                    instructor?: string;
                                  }>;
                                };

                                return (
                                  <div key={index}>
                                    <BookClassSelectionDisplay
                                      part={{
                                        type: part.type,
                                        result: typedOutput,
                                        input: typedInput,
                                      }}
                                      onConfirm={(selectedIndices) => {
                                        if (
                                          selectedPersona &&
                                          typedInput?.classes
                                        ) {
                                          const selectedClasses =
                                            selectedIndices.map(
                                              (idx) => typedInput.classes[idx]
                                            );
                                          const classDetails = selectedClasses
                                            .map(
                                              (c) =>
                                                `${c.className} on ${c.date} at ${c.time}`
                                            )
                                            .join(", ");
                                          // Send a confirmation message with full details
                                          sendMessage(
                                            {
                                              text: `Yes, please book these classes: ${classDetails}`,
                                            },
                                            {
                                              body: {
                                                persona: selectedPersona,
                                              },
                                            }
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                );
                              }
                            }
                            return null;
                          })}
                        </div>
                      </div>
                      {message.role === "assistant" && (
                        <div className="relative mt-2">
                          {/* Spinning border when streaming - only show if text is streaming, not just tool calls */}
                          {status === "streaming" &&
                            messageIndex === messages.length - 1 &&
                            message.parts.some((p) => p.type === "text" && p.text.trim().length > 0) && (
                              <div className="absolute -inset-1 rounded-full animate-spin">
                                <div className="h-full w-full rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500"></div>
                              </div>
                            )}
                          <MessageAvatar
                            src="/images/yoga.jpg"
                            name="SAMA"
                            className="bg-muted border-2 object-cover rounded-full relative z-10"
                          />
                        </div>
                      )}
                      {message.role === "user" && selectedPersona && (
                        <MessageAvatar
                          src={personaData[selectedPersona].image}
                          name={personaData[selectedPersona].name}
                          className="bg-muted border-2 object-cover rounded-full mt-2"
                        />
                      )}
                    </Message>
                  </div>
                ))}

                {/* Loading State - Show as separate message when NO tool calls exist yet */}
                {status === "streaming" &&
                  messages.length > 0 &&
                  messages[messages.length - 1].role === "assistant" &&
                  !messages[messages.length - 1].parts.some(
                    (p) => p.type === "text" && p.text.trim().length > 0
                  ) &&
                  !messages[messages.length - 1].parts.some((p) =>
                    p.type.startsWith("tool-")
                  ) && (
                    <div className="mb-6">
                      <Message from="assistant">
                        <MessageContent>Thinking...</MessageContent>
                        <div className="relative mt-2">
                          {/* Spinning border when streaming */}
                          <div className="absolute -inset-1 rounded-full animate-spin">
                            <div className="h-full w-full rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500"></div>
                          </div>
                          <MessageAvatar
                            src="/images/yoga.jpg"
                            name="SAMA"
                            className="bg-muted border-2 object-cover rounded-full relative z-10"
                          />
                        </div>
                      </Message>
                    </div>
                  )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          {/* Suggestion Pills */}
          <Suggestions
            className={cn(
              "mt-auto mx-auto w-full max-w-3xl pb-2 flex-col justify-end items-end",
              status === "streaming" || (status === "submitted" && "hidden"),
              messages.length > 0 && "flex-row justify-start"
            )}
          >
            {suggestions.map((suggestion, index) => (
              <Suggestion
                key={index}
                suggestion={suggestion}
                onClick={handleSuggestionClick}
              />
            ))}
          </Suggestions>

          {/* Input Area */}
          <div className="border-t bg-background px-4 py-4">
            <div className="max-w-3xl mx-auto">
              <PromptInput
                value={input}
                onValueChange={setInput}
                isLoading={status !== "ready"}
                onSubmit={() => {
                  if (input.trim() && selectedPersona) {
                    sendMessage(
                      { text: input },
                      {
                        body: {
                          persona: selectedPersona,
                        },
                      }
                    );
                    setInput("");
                  }
                }}
                className="w-full shadow-lg"
              >
                <PromptInputTextarea
                  placeholder="Write your prompt..."
                  disabled={!selectedPersona || status !== "ready"}
                  className="min-h-[52px] text-black"
                />
                <PromptInputActions className="justify-end">
                  <PromptInputAction
                    side="right"
                    tooltip="Send message (Enter)"
                  >
                    <Button
                      onClick={() => {
                        if (input.trim() && selectedPersona) {
                          sendMessage(
                            { text: input },
                            {
                              body: {
                                persona: selectedPersona,
                              },
                            }
                          );
                          setInput("");
                        }
                      }}
                      disabled={
                        !selectedPersona || status !== "ready" || !input.trim()
                      }
                      size="icon"
                      className="size-9 rounded-full"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </PromptInputAction>
                </PromptInputActions>
              </PromptInput>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
