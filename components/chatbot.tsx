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
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ChevronDown,
  Check,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BookClassDisplay } from "@/components/ai-elements/book-class";
import { Badge } from "./ui/badge";
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
  "Find classes that fit my schedule today",
  "Explore yoga, pilates, and meditation",
  "View all available classes this week",
  "Get personalized wellness advice",
];

interface ChatbotProps {
  preSelectedPersona?: Persona | null;
}

export default function Chatbot({ preSelectedPersona }: ChatbotProps) {
  const router = useRouter();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(preSelectedPersona || null);
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
    setSelectedPersona(persona);
    setMessages([]);
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
            <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src="/images/yoga.jpg"
                    alt="SAMA"
                    className="bg-muted border-2 object-cover rounded-full"
                  />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold">
                    SAMA Studio Assistant
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Wellness scheduling companion
                  </p>
                </div>
              </div>

              {/* Persona Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-9"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={personaData[selectedPersona].image}
                        alt={personaData[selectedPersona].name}
                      />
                      <AvatarFallback
                        className={cn(
                          personaData[selectedPersona].color,
                          "text-white text-xs"
                        )}
                      >
                        {personaData[selectedPersona].name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {personaData[selectedPersona].name}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                    Select Persona
                  </DropdownMenuLabel>
                  {(["sheila", "ritvik", "gaurav"] as Persona[]).map(
                    (persona) => (
                      <DropdownMenuItem
                        key={persona}
                        onClick={() => selectPersona(persona)}
                        className={cn(
                          "flex items-center gap-3 p-3 cursor-pointer",
                          selectedPersona === persona && "bg-accent"
                        )}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={personaData[persona].image}
                            alt={personaData[persona].name}
                          />
                          <AvatarFallback
                            className={cn(
                              personaData[persona].color,
                              "text-white"
                            )}
                          >
                            {personaData[persona].name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">
                            {personaData[persona].name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {personaData[persona].description}
                          </p>
                        </div>
                        {selectedPersona === persona && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
                {messages.map((message) => (
                  <div key={message.id} className="mb-6">
                    <Message from={message.role}>
                      <MessageContent
                        className={cn(
                          "max-w-[80%] shadow-md",
                          message.role === "user" ? "ml-auto" : ""
                        )}
                      >
                        {/* Render tool calls */}
                        {message.parts.map((part, index) => {
                          const { type } = part;
                          if (type === "text") {
                            return <Response key={index}>{part.text}</Response>;
                          }
                          if (type === "tool-bookClass") {
                            const { state } = part;
                            // Show UI for input-available (in-progress) and output-available (completed) states
                            // if (state === "input-streaming") {
                            //   return <Badge key={index}>Processing...</Badge>;
                            // }
                            if (
                              state === "output-available" ||
                              state === "input-available"
                            ) {
                              const { output, input } = part;
                              return (
                                <div key={index} className="mt-3 first:mt-0">
                                  <BookClassDisplay
                                    part={{
                                      type: part.type,
                                      result:
                                        state === "output-available"
                                          ? (output as {
                                              success: boolean;
                                              message: string;
                                            })
                                          : undefined,
                                      input: input as {
                                        className: string;
                                        date: string;
                                        time: string;
                                        instructor?: string;
                                      },
                                    }}
                                  />
                                </div>
                              );
                            }
                          }
                          return null;
                        })}
                      </MessageContent>
                      {message.role === "assistant" && (
                        <MessageAvatar
                          src="/images/yoga.jpg"
                          name="SAMA"
                          className="bg-muted border-2 object-cover rounded-full"
                        />
                      )}
                      {message.role === "user" && selectedPersona && (
                        <MessageAvatar
                          src={personaData[selectedPersona].image}
                          name={personaData[selectedPersona].name}
                          className="bg-muted border-2 object-cover rounded-full"
                        />
                      )}
                    </Message>
                  </div>
                ))}

                {/* Loading State */}
                {(status === "submitted" ||
                  (status === "streaming" &&
                    messages.length > 0 &&
                    messages[messages.length - 1].role === "assistant" &&
                    !messages[messages.length - 1].parts.some(
                      (p) => p.type === "text" && p.text.trim().length > 0
                    ))) && (
                  <div className="mb-6">
                    <Message from="assistant">
                      <MessageContent variant="flat">
                        <div className="flex gap-1.5 p-3">
                          <span
                            className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></span>
                        </div>
                      </MessageContent>
                      <MessageAvatar
                        src="/images/yoga.jpg"
                        name="SAMA"
                        className="bg-muted border-2 object-cover rounded-full"
                      />
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
