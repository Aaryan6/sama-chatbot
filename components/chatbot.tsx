"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";

type Persona = "sheila" | "ritvik" | "gaurav";

export default function Chatbot() {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const selectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
  };

  const personaNames = {
    sheila: "Sheila",
    ritvik: "Ritvik",
    gaurav: "Gaurav",
  };

  const personaInitials = {
    sheila: "S",
    ritvik: "R",
    gaurav: "G",
  };

  const personaColors = {
    sheila: "bg-pink-500",
    ritvik: "bg-blue-500",
    gaurav: "bg-purple-500",
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
        <ScrollArea className="h-full">
          <div ref={chatContainerRef} className="p-6 space-y-4">
            {messages.length === 0 && !selectedPersona && (
              <div className="text-center py-10 text-muted-foreground">
                <h2 className="text-xl font-semibold mb-3">
                  Welcome to SAMA Studio
                </h2>
                <p className="text-sm leading-relaxed">
                  Select a persona above to start scheduling your wellness
                  classes.
                  <br />
                  I&apos;ll help you find the perfect class times based on your
                  schedule and preferences.
                </p>
              </div>
            )}

            {messages.length === 0 && selectedPersona && (
              <div className="flex gap-3 items-start">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    🧘
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      SAMA Assistant
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      AI
                    </Badge>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-sm">
                    Hello! I&apos;m your SAMA Studio assistant for{" "}
                    {personaNames[selectedPersona]}. I have access to your
                    schedule, preferences, and our class timetable. How can I
                    help you find the perfect class?
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 items-start ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar>
                  <AvatarFallback
                    className={
                      message.role === "user" && selectedPersona
                        ? `${personaColors[selectedPersona]} text-white`
                        : "bg-primary text-primary-foreground"
                    }
                  >
                    {message.role === "user"
                      ? selectedPersona
                        ? personaInitials[selectedPersona]
                        : "U"
                      : "🧘"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div
                    className={`flex items-center gap-2 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-sm font-semibold">
                      {message.role === "user"
                        ? selectedPersona
                          ? personaNames[selectedPersona]
                          : "You"
                        : "SAMA Assistant"}
                    </span>
                    {message.role === "assistant" && (
                      <Badge variant="secondary" className="text-xs">
                        AI
                      </Badge>
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return <span key={index}>{part.text}</span>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            ))}

            {(status === "submitted" ||
              (status === "streaming" &&
                messages.length > 0 &&
                messages[messages.length - 1].role === "assistant" &&
                !messages[messages.length - 1].parts.some(
                  (p) => p.type === "text" && p.text.trim().length > 0
                ))) && (
              <div className="flex gap-3 items-start">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    🧘
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      SAMA Assistant
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      AI
                    </Badge>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
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
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
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
          className="flex w-full gap-2"
        >
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedPersona
                ? `Ask about class scheduling...`
                : "Select a persona first..."
            }
            disabled={!selectedPersona || status !== "ready"}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!selectedPersona || status !== "ready" || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
