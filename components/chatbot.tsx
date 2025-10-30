"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
import { Send } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageAvatar,
} from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";

type Persona = "sheila" | "ritvik" | "gaurav";

export default function Chatbot() {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [input, setInput] = useState("");

  const personaNames = {
    sheila: "Sheila",
    ritvik: "Ritvik",
    gaurav: "Gaurav",
  };

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    messages: [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: selectedPersona
              ? `Hello! I'm your SAMA Studio assistant for ${personaNames[selectedPersona]}. I have access to your schedule, preferences, and our class timetable. How can I help you find the perfect class?`
              : "Hello! I'm your SAMA Studio assistant. I have access to your schedule, preferences, and our class timetable. How can I help you find the perfect class?",
          },
        ],
      },
    ],
  });

  const selectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
  };

  const personaColors = {
    sheila: "bg-pink-500",
    ritvik: "bg-blue-500",
    gaurav: "bg-purple-500",
  };

  const getMessageText = (message: UIMessage) => {
    return message.parts
      .filter((part) => part.type === "text")
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("");
  };

  return (
    <Card className="w-full max-w-4xl h-[90vh] max-h-[800px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl">SAMA Studio Assistant</CardTitle>
        <CardDescription>
          Your personal wellness scheduling companion
        </CardDescription>

        <div className="flex gap-2 justify-center flex-wrap pt-4">
          {(["sheila", "ritvik", "gaurav"] as Persona[]).map((persona) => (
            <Button
              key={persona}
              onClick={() => selectPersona(persona)}
              variant={selectedPersona === persona ? "default" : "outline"}
              size="sm"
            >
              {personaNames[persona]}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.length === 0 && !selectedPersona && (
              <ConversationEmptyState
                title="Welcome to SAMA Studio"
                description="Select a persona above to start scheduling your wellness classes. I'll help you find the perfect class times based on your schedule and preferences."
                icon={<span className="text-4xl">🧘</span>}
              />
            )}
            {/* 
            {messages.length === 0 && selectedPersona && (
              <Message from="assistant">
                <MessageAvatar
                  src="/assistant-avatar.png"
                  name="SAMA"
                  className="bg-primary text-primary-foreground"
                />
                <MessageContent variant="flat">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">
                      SAMA Assistant
                    </span>
                    <Badge variant="secondary" className="text-xs h-4 px-1.5">
                      AI
                    </Badge>
                  </div>
                  <Response>
                    Hello! I&apos;m your SAMA Studio assistant for{" "}
                    {personaNames[selectedPersona]}. I have access to your
                    schedule, preferences, and our class timetable. How can I
                    help you find the perfect class?
                  </Response>
                </MessageContent>
              </Message>
            )} */}

            {messages.map((message: UIMessage) => (
              <Message key={message.id} from={message.role}>
                {/* <MessageAvatar
                  src={
                    message.role === "user"
                      ? "/user-avatar.png"
                      : "/assistant-avatar.png"
                  }
                  name={
                    message.role === "user"
                      ? selectedPersona
                        ? personaNames[selectedPersona]
                        : "You"
                      : "SAMA"
                  }
                  className={
                    message.role === "user" && selectedPersona
                      ? `${personaColors[selectedPersona]} text-white`
                      : "bg-primary text-primary-foreground"
                  }
                /> */}
                <MessageContent
                  variant={message.role === "user" ? "contained" : "flat"}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">
                      {message.role === "user"
                        ? selectedPersona
                          ? personaNames[selectedPersona]
                          : "You"
                        : "SAMA Assistant"}
                    </span>
                    {message.role === "assistant" && (
                      <Badge variant="secondary" className="text-xs h-4 px-1.5">
                        AI
                      </Badge>
                    )}
                  </div>
                  <Response>{getMessageText(message)}</Response>
                </MessageContent>
              </Message>
            ))}

            {(status === "submitted" ||
              (status === "streaming" &&
                messages.length > 0 &&
                messages[messages.length - 1].role === "assistant" &&
                !messages[messages.length - 1].parts.some(
                  (p) => p.type === "text" && p.text.trim().length > 0
                ))) && (
              <Message from="assistant">
                <MessageAvatar
                  src="/assistant-avatar.png"
                  name="SAMA"
                  className="bg-primary text-primary-foreground"
                />
                <MessageContent variant="flat">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">
                      SAMA Assistant
                    </span>
                    <Badge variant="secondary" className="text-xs h-4 px-1.5">
                      AI
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </CardContent>

      <CardFooter className="border-t p-4">
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
          className="w-full"
        >
          <PromptInputTextarea
            placeholder={
              selectedPersona
                ? "Ask about class scheduling..."
                : "Select a persona first..."
            }
            disabled={!selectedPersona || status !== "ready"}
          />
          <PromptInputActions>
            <PromptInputAction tooltip="Send message (Enter)">
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
                className="size-8"
              >
                <Send className="h-4 w-4" />
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </CardFooter>
    </Card>
  );
}
