"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "Book an appointment",
  "Find a doctor",
  "View departments",
  "Hospital services",
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  async function sendMessage(text?: string) {
    const userMessage = (text ?? message).trim();
    if (!userMessage || loading) return;

    setMessages((m) => [...m, { role: "user", content: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-5">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-xl font-bold text-slate-900">
            Pranaam Hospitals
          </h1>
          <p className="text-sm text-slate-500">AI Hospital Assistant</p>
        </div>
      </header>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 flex h-[600px] w-[380px] max-w-[calc(100%-32px)] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-700 to-teal-600 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl">🤖</div>
                  <h2 className="font-semibold">Pranaam AI</h2>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
                  <span className="h-2 w-2 rounded-full bg-green-300" />
                  Here to help you
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-xl text-white/80 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
            {messages.length === 0 && (
              <div className="py-4">
                <div className="rounded-2xl rounded-tl-none bg-white p-4 shadow-sm">
                  <h3 className="font-semibold text-slate-800">
                    Hi there! 👋
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    How can I help you today? I can help you find a doctor,
                    learn about our services, or book an appointment.
                  </p>
                </div>

                <p className="mt-5 mb-2 text-xs font-medium text-slate-400">
                  QUICK ACTIONS
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {suggestions.map((item) => (
                    <button
                      key={item}
                      onClick={() => sendMessage(item)}
                      className="rounded-xl border bg-white p-3 text-left text-sm text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      msg.role === "user"
                        ? "rounded-br-sm bg-teal-600 text-white"
                        : "rounded-bl-sm bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="w-fit rounded-2xl bg-white px-4 py-3 text-sm text-slate-400 shadow-sm">
                  Pranaam AI is thinking...
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="border-t bg-white p-3"
          >
            <div className="flex items-end rounded-2xl border bg-slate-50 p-2 focus-within:border-teal-400">
              <textarea
                ref={input}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask Pranaam AI anything..."
                rows={1}
                className="flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
              />

              <button
                disabled={!message.trim() || loading}
                className="rounded-xl bg-teal-600 px-3 py-2 text-white hover:bg-teal-700 disabled:opacity-30"
              >
                ↑
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-2xl text-white shadow-xl transition hover:scale-105 hover:bg-teal-700"
        aria-label="Open Pranaam AI"
      >
        {open ? "×" : "💬"}
      </button>
    </main>
  );
}