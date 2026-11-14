import { useState, useRef, useEffect } from "react";
import MacWindow from "./MacWindow";
import ReactMarkdown from "react-markdown";
import { ArrowUp, RotateCcw, Sparkles, Code, Briefcase, GraduationCap, Mail } from "lucide-react";
import { sendChatMessage } from "../../services/aiService";

const SUGGESTIONS = [
  { label: "🚀 Top Projects", prompt: "Tell me about your top projects and what technologies you used." },
  { label: "🛠️ Tech Stack", prompt: "What are your core technical skills and programming languages?" },
  { label: "🎓 Education & CGPA", prompt: "Where are you studying and what is your academic background?" },
  { label: "📬 Contact Info", prompt: "How can I contact or hire Harshit?" },
];

const SHORTCUTS = [
  { target: "projects", label: "Projects", icon: Briefcase, color: "text-amber-300" },
  { target: "resume", label: "Resume", icon: GraduationCap, color: "text-rose-300" },
  { target: "contact", label: "Contact", icon: Mail, color: "text-sky-300" },
  { target: "cli", label: "Terminal", icon: Code, color: "text-emerald-300" },
];

const INITIAL_MESSAGES = [
  {
    role: "model",
    text: `### Hey there! 👋 I'm **Harshit AI**.
I'm an intelligent assistant trained on Harshit Tiwari's background, projects, and skills.

Feel free to ask me anything about his work, or pick one of the quick prompts below!`,
  },
];

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

const MARKDOWN_CLASS = [
  "text-[13.5px] leading-[1.5]",
  "[&>p]:mb-2 [&>p:last-child]:mb-0",
  "[&>h3]:mb-1.5 [&>h3]:text-[15px] [&>h3]:font-semibold [&>h3]:tracking-[-0.01em] [&>h3]:text-white",
  "[&>ul]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&_li]:mb-0.5",
  "[&_strong]:font-semibold [&_strong]:text-white",
  "[&_code]:rounded-md [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[12px] [&_code]:text-[#9ccbff]",
  "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-black/30 [&_pre]:p-3",
  "[&_a]:text-[#64b0ff] [&_a]:underline [&_a]:underline-offset-2",
].join(" ");

export default function AiChatWindow({
  windowName = "ai",
  WindowState,
  setWindowState,
  activeWindow,
  setActiveWindow,
}) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    // Focus input on window open
    if (WindowState?.ai) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [WindowState?.ai]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage = { role: "user", text };
    const updatedHistory = [...messages, userMessage];

    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(updatedHistory);
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I ran into a temporary issue connecting to the AI service. Please try asking again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
  };

  const openAppWindow = (targetWindow) => {
    setWindowState?.((prev) => ({ ...prev, [targetWindow]: true }));
    setActiveWindow?.(targetWindow);
    window.dispatchEvent(new CustomEvent("portfolio:restore-window", { detail: targetWindow }));
  };

  const chipClass =
    "flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] text-white/75 ring-1 ring-inset ring-white/[0.1] bg-white/[0.06] transition-colors duration-150 hover:bg-white/[0.12] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Ask Harshit AI · Assistant"
      initialWidth={720}
      initialHeight={550}
      initialX={280}
      initialY={90}
    >
      <div
        className="flex h-full w-full flex-col text-white antialiased"
        style={{
          fontFamily: FONT_STACK,
          background:
            "radial-gradient(110% 60% at 0% 0%, rgba(10,132,255,0.13) 0%, rgba(10,132,255,0) 55%), linear-gradient(180deg, #14171d 0%, #0d1015 100%)",
        }}
      >
        {/* Toolbar */}
        <div
          className="flex shrink-0 items-center justify-between px-4 py-2.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(30px) saturate(180%)",
            WebkitBackdropFilter: "blur(30px) saturate(180%)",
            boxShadow: "inset 0 -0.5px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="relative flex h-9 w-9 items-center justify-center rounded-[10px]"
              style={{
                background: "linear-gradient(180deg, #4aa8ff 0%, #0a64e8 100%)",
                boxShadow:
                  "inset 0 0.5px 0 rgba(255,255,255,0.55), 0 0 0 0.5px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              <img src="/doc-icons/harshit-ai.svg" alt="" className="h-5 w-5 object-contain" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#30d158] ring-2 ring-[#14171d]" />
            </div>
            <div>
              <h2 className="text-[13px] font-semibold leading-tight tracking-[-0.01em]">Harshit AI Assistant</h2>
              <p className="mt-0.5 text-[11.5px] leading-tight text-white/45">Ask about projects, skills and experience</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            disabled={messages.length === 1 && !loading}
            title="Start a new conversation"
            className="flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-white/70 ring-1 ring-inset ring-white/[0.1] bg-white/[0.06] transition-colors hover:bg-white/[0.12] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff] disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white/[0.06] disabled:hover:text-white/70 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            New chat
          </button>
        </div>

        {/* Conversation */}
        <div
          className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4 [scrollbar-color:rgba(255,255,255,0.18)_transparent] [scrollbar-width:thin]"
          aria-live="polite"
        >
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[84%] px-3.5 py-2.5 sm:max-w-[76%] ${
                    isUser
                      ? "rounded-[20px] rounded-br-[6px] text-white"
                      : "rounded-[20px] rounded-bl-[6px] text-white/90"
                  }`}
                  style={
                    isUser
                      ? {
                          background: "linear-gradient(180deg, #3d9bff 0%, #0a7aff 100%)",
                          boxShadow:
                            "inset 0 0.5px 0 rgba(255,255,255,0.4), 0 2px 8px rgba(10,122,255,0.25)",
                        }
                      : {
                          background: "rgba(255,255,255,0.09)",
                          backdropFilter: "blur(24px) saturate(180%)",
                          WebkitBackdropFilter: "blur(24px) saturate(180%)",
                          boxShadow:
                            "inset 0 0.5px 0 rgba(255,255,255,0.18), 0 0 0 0.5px rgba(255,255,255,0.08)",
                        }
                  }
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap text-[13.5px] leading-[1.45]">{msg.text}</p>
                  ) : (
                    <div className={MARKDOWN_CLASS}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start" role="status" aria-label="Harshit AI is typing">
              <div
                className="flex items-center gap-1.5 rounded-[20px] rounded-bl-[6px] px-4 py-3.5"
                style={{
                  background: "rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.18), 0 0 0 0.5px rgba(255,255,255,0.08)",
                }}
              >
                {[0, 180, 360].map((delay) => (
                  <span
                    key={delay}
                    className="h-[7px] w-[7px] animate-pulse rounded-full bg-white/50"
                    style={{ animationDelay: `${delay}ms`, animationDuration: "1.1s" }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Shortcuts + prompts */}
        <div className="shrink-0 space-y-2 px-4 pb-2 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SUGGESTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSend(item.prompt)}
                disabled={loading}
                className={chipClass}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="mr-0.5 shrink-0 text-[12px] text-white/35">Open</span>
            {SHORTCUTS.map(({ target, label, icon: Icon, color }) => (
              <button key={target} type="button" onClick={() => openAppWindow(target)} className={chipClass}>
                <Icon className={`h-3.5 w-3.5 ${color}`} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 px-4 pb-3 pt-1.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 rounded-full bg-white/[0.07] py-1.5 pl-4 pr-1.5 ring-1 ring-inset ring-white/[0.12] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.1)] transition-shadow focus-within:ring-2 focus-within:ring-[#0a84ff]/70"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-[#64b0ff]" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Harshit"
              aria-label="Message"
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/35"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              title="Send message"
              aria-label="Send message"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-[filter,transform,opacity] duration-150 hover:brightness-110 active:scale-95 disabled:cursor-default disabled:opacity-30 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
              style={{
                background: "linear-gradient(180deg, #3d9bff 0%, #0a74f0 100%)",
                boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.5), 0 0 0 0.5px rgba(0,60,140,0.6)",
              }}
            >
              <ArrowUp className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
            </button>
          </form>
          <p className="mt-1.5 text-center text-[11px] text-white/30">
            Answers are AI-generated and may contain mistakes.
          </p>
        </div>
      </div>
    </MacWindow>
  );
}