"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const RED = "#9B1B30";

const departments = [
  ["Gynecology & Obstetrics", "Women's health & maternity care"],
  ["Pediatrics", "Healthcare for children"],
  ["General Medicine", "Diagnosis & medical care"],
  ["Orthopedics", "Bones, joints & mobility"],
  ["Surgery", "Surgical care & procedures"],
  ["ENT", "Ear, nose & throat care"],
];

const services = [
  ["Emergency & Casualty", "Emergency medical care"],
  ["Laboratory", "Diagnostic laboratory services"],
  ["Radiology & X-Ray", "Imaging & diagnostics"],
  ["Physiotherapy", "Recovery & rehabilitation"],
  ["Indoor Treatment", "Inpatient hospital care"],
  ["Ambulance", "Emergency transport"],
];

const questions = [
  "Help me find a doctor",
  "I want to book a hospital visit",
  "What departments does Pranaam have?",
  "What services are available?",
  "What are the OPD timings?",
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("pranaam-chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (messages.length)
      localStorage.setItem("pranaam-chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (text = message) => {
    const value = text.trim();
    if (!value || loading) return;

    setMessages((m) => [...m, { role: "user", content: value }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const ask = (text: string) => {
    setOpen(true);
    setTimeout(() => sendMessage(text), 100);
  };

  return (
    <main className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="border-t-4 border-[#333] border-b bg-white">
        <div className="mx-auto flex h-[94px] max-w-7xl items-center justify-between px-6">
          <Logo />

          <nav className="hidden items-center gap-8 text-sm text-gray-700 md:flex">
            {["Home", "About", "Services", "Locations", "Health Packages", "Doctors"].map(
              (x) => <span key={x}>{x}</span>
            )}
            <button
              className="rounded-md px-5 py-2.5 font-semibold text-white"
              style={{ backgroundColor: RED }}
            >
              Book Now
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-[#e9dfc4]">
        <div className="mx-auto grid min-h-[530px] max-w-7xl items-center px-6 lg:grid-cols-2">
          <div className="py-20">
            <p
              className="text-sm font-semibold uppercase tracking-[.18em]"
              style={{ color: RED }}
            >
              Pranaam Hospitals
            </p>

            <h1 className="mt-4 max-w-xl text-5xl font-bold leading-tight text-gray-900">
              Committed to Excellence in Healthcare
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-gray-600">
              Explore Pranaam Hospitals, find doctors, discover healthcare
              services and get assistance through Pranaam AI.
            </p>

            <button
              onClick={() => setOpen(true)}
              className="mt-8 rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm"
              style={{ backgroundColor: RED }}
            >
              Talk to Pranaam AI
            </button>
          </div>
        </div>
      </section>

      {/* CHATBOT */}
      {open && (
        <div className="fixed bottom-6 right-5 z-50 flex h-[720px] w-[420px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_20px_70px_rgba(0,0,0,.2)] ring-1 ring-black/10">

          {/* CHAT HEADER */}
          <header className="flex items-center gap-3 border-b bg-white px-4 py-3">
            <Logo chat />

            <div>
              <h2 className="text-sm font-bold" style={{ color: RED }}>
                Pranaam AI
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Here to help
              </p>
            </div>
          </header>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto bg-[#faf8f8]">
            {!messages.length ? (
              <div className="p-5">

                <div className="rounded-[22px] bg-white p-5 shadow-sm">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white"
                    style={{ backgroundColor: RED }}
                  >
                    ✦
                  </div>

                  <h3 className="mt-4 text-[21px] font-bold text-gray-900">
                    Hello! 👋
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Welcome to Pranaam AI. I can help you find doctors,
                    explore our departments and services, answer hospital
                    questions and help you get started with an appointment.
                  </p>
                </div>

                <Section title="Departments" label="Explore Pranaam">
                  <div className="grid grid-cols-2 gap-2.5">
                    {departments.map((item) => (
                      <Card
                        key={item[0]}
                        item={item}
                        onClick={() =>
                          ask(`Tell me about ${item[0]} at Pranaam Hospitals`)
                        }
                      />
                    ))}
                  </div>
                </Section>

                <Section title="Services & facilities" label="Patient care">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {services.map((item) => (
                      <Card
                        key={item[0]}
                        item={item}
                        small
                        onClick={() =>
                          ask(`Tell me about ${item[0]} at Pranaam Hospitals`)
                        }
                      />
                    ))}
                  </div>
                </Section>

                <Section title="Ask Pranaam AI">
                  <div className="space-y-2">
                    {questions.map((q) => (
                      <button
                        key={q}
                        onClick={() => ask(q)}
                        className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white px-3.5 py-3 text-left text-xs text-gray-600 hover:border-[#9B1B30]/30 hover:text-[#9B1B30]"
                      >
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-semibold"
                          style={{ backgroundColor: `${RED}12`, color: RED }}
                        >
                          ?
                        </span>
                        <span className="flex-1">{q}</span>
                        <span className="text-gray-300">›</span>
                      </button>
                    ))}
                  </div>
                </Section>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        msg.role === "user"
                          ? "rounded-br-sm text-white"
                          : "rounded-bl-sm bg-white text-gray-700 shadow-sm"
                      }`}
                      style={
                        msg.role === "user"
                          ? { backgroundColor: RED }
                          : undefined
                      }
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs text-gray-400 shadow-sm">
                    <span
                      className="h-2 w-2 animate-pulse rounded-full"
                      style={{ backgroundColor: RED }}
                    />
                    Pranaam AI is thinking...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* INPUT */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="border-t bg-white p-3"
          >
            <div className="flex items-end rounded-2xl border border-gray-300 bg-white p-2 focus-within:border-[#9B1B30]/50">

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
                placeholder="Ask Pranaam AI..."
                rows={1}
                className="flex-1 resize-none bg-white px-2 py-2 text-sm text-gray-900 caret-[#9B1B30] outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg text-white disabled:opacity-30"
                style={{ backgroundColor: RED }}
              >
                ↑
              </button>
            </div>

            <p className="mt-2 text-center text-[9px] text-gray-400">
              Pranaam AI may make mistakes. Please verify important information.
            </p>
          </form>

          {/* CLEARLY VISIBLE CLOSE BUTTON */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close Pranaam AI"
            className="absolute bottom-[105px] right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-gray-600 shadow-lg ring-1 ring-gray-200 hover:bg-gray-100 hover:text-black"
          >
            ×
          </button>
        </div>
      )}

      {/* FLOATING BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Pranaam AI"
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-[0_8px_30px_rgba(155,27,48,.35)] transition hover:scale-105"
          style={{ backgroundColor: RED }}
        >
          <svg
            width="29"
            height="29"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2v-5.2A7.5 7.5 0 1 1 20 11.5Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
          </svg>

          <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400" />
        </button>
      )}
    </main>
  );
}

function Logo({ chat = false }: { chat?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center rounded border-[1.5px] border-[#222] bg-white ${
        chat ? "h-[58px] w-[126px] px-2.5 py-1.5" : "h-[84px] w-[164px] px-4 py-2"
      }`}
    >
      <img
        src={chat ? "/logo.png" : "/logo.png"}
        alt="Pranaam Hospitals - Built on Trust"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function Section({
  title,
  label,
  children,
}: {
  title: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="mb-3">
        {label && (
          <p
            className="text-[10px] font-bold uppercase tracking-[.18em]"
            style={{ color: RED }}
          >
            {label}
          </p>
        )}
        <h3 className="mt-1 text-sm font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Card({
  item,
  small,
  onClick,
}: {
  item: string[];
  small?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        small
          ? "min-w-[145px] rounded-2xl border border-gray-100 bg-white p-3 text-left hover:border-[#9B1B30]/30 hover:shadow-sm"
          : "rounded-2xl border border-gray-100 bg-white p-3.5 text-left hover:-translate-y-0.5 hover:border-[#9B1B30]/30 hover:shadow-md"
      }
    >
      <span
        className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl font-bold"
        style={{ backgroundColor: `${RED}12`, color: RED }}
      >
        +
      </span>
      <p className="text-xs font-semibold text-gray-800">{item[0]}</p>
      <p className="mt-1 text-[10px] leading-4 text-gray-400">{item[1]}</p>
    </button>
  );
}