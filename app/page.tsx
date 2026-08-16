"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(text?: string) {
    const userMessage = (text ?? message).trim();

    if (!userMessage || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-xl font-semibold text-gray-900">
            Pranaam Hospitals
          </h1>
          <p className="text-sm text-gray-500">
            AI Hospital Assistant
          </p>
        </div>
      </header>

      {/* Chat */}
      <section className="flex-1">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl flex-col px-6 py-8">

          {/* Welcome */}
          {messages.length === 0 && (
            <>
              <div className="max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900">
                  👋 Hello!
                </h2>

                <p className="mt-3 text-gray-600">
                  I&apos;m the Pranaam Hospitals AI Assistant. I can help
                  you find doctors, book appointments, and answer questions
                  about the hospital.
                </p>
              </div>

              {/* Suggestions */}
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  "I want to book an appointment",
                  "Find a doctor",
                  "What departments do you have?",
                  "What services do you offer?",
                ].map((question) => (
                  <button
                    key={question}
                    onClick={() => sendMessage(question)}
                    className="rounded-full border bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Messages */}
          <div className="mt-6 flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-2xl rounded-2xl px-5 py-3 ${
                    msg.role === "user"
                      ? "bg-black text-white"
                      : "border bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border bg-white px-5 py-3 text-gray-500 shadow-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="mt-auto pt-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-sm"
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything about Pranaam Hospitals..."
                className="flex-1 bg-transparent px-3 py-2 text-gray-900 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>

            <p className="mt-2 text-center text-xs text-gray-400">
              Pranaam AI Assistant
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}