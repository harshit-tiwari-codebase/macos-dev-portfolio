import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Check, CircleAlert, Copy, LoaderCircle, Send } from "lucide-react";
import MacWindow from "./MacWindow";

const CONTACT_EMAIL = "harshit20112005@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/harshit-tiwari-48830b3b4/";
const MAX_MESSAGE = 5000;

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

const notify = (title, message) =>
  window.dispatchEvent(new CustomEvent("portfolio:notification", { detail: { title, message } }));

/* A single row in a macOS "grouped inset" form: label on the left, field on the right. */
const inputClass =
  "min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/30";

const ContactWindow = ({ windowName, WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus({ type: "", text: "" });
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      if (serviceId && templateId && publicKey) {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              to_email: CONTACT_EMAIL,
              from_name: form.name,
              reply_to: form.email,
              message: form.message,
            },
          }),
        });
        if (!response.ok) throw new Error("Email service rejected the message.");
        setStatus({ type: "success", text: "Message sent. Thanks for reaching out!" });
        notify("Message sent", "Your message was delivered to Harshit.");
      } else {
        const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
        const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        setStatus({ type: "success", text: "Your email app opened with the message ready to send." });
        notify("Email draft ready", "Finish sending your message in your email app.");
      }
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus({ type: "error", text: "Could not send right now. Please try again or email directly." });
      notify("Message not sent", "Please try again or use the email link.");
    } finally {
      setSending(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      notify("Email copied", `${CONTACT_EMAIL} is on your clipboard.`);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      notify("Could not copy", "Select the address and copy it manually.");
    }
  };

  const groupClass =
    "overflow-hidden rounded-[14px] bg-white/[0.055] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.08)] ring-1 ring-inset ring-white/[0.09] divide-y divide-white/[0.08]";
  const rowClass =
    "flex items-center gap-3 px-3.5 py-[11px] transition-colors focus-within:bg-white/[0.04]";
  const labelClass = "w-[4.75rem] shrink-0 text-[13px] text-white/50";

  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Contact Harshit"
      initialWidth={680}
      initialHeight={600}
    >
      <div
        className="h-full overflow-y-auto p-5 text-white sm:p-6"
        style={{
          fontFamily: FONT_STACK,
          background:
            "radial-gradient(120% 70% at 0% 0%, rgba(10,132,255,0.14) 0%, rgba(10,132,255,0) 55%), linear-gradient(180deg, #14171d 0%, #0d1015 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <header className="mb-6">
            <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[32px]">
              {t("contactHeading")}
            </h1>
            <p className="mt-2 max-w-[46ch] text-[14px] leading-relaxed text-white/55">
              Have a project, opportunity, or question? Send a note and tell me a little about it.
            </p>
          </header>

          <div className="grid gap-5 min-[600px]:grid-cols-[minmax(0,1fr)_13.5rem]">
            {/* ───────── Form ───────── */}
            <form onSubmit={submit} className="space-y-4">
              <div className={groupClass}>
                <label className={rowClass}>
                  <span className={labelClass}>{t("yourName")}</span>
                  <input
                    required
                    maxLength={100}
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className={inputClass}
                    placeholder="Required"
                  />
                </label>
                <label className={rowClass}>
                  <span className={labelClass}>{t("yourEmail")}</span>
                  <input
                    required
                    type="email"
                    maxLength={180}
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <div className={groupClass}>
                <label className="block px-3.5 pb-2.5 pt-[11px] transition-colors focus-within:bg-white/[0.04]">
                  <span className="flex items-center justify-between">
                    <span className="text-[13px] text-white/50">{t("message")}</span>
                    <span
                      className={`text-[11px] tabular-nums transition-colors ${
                        form.message.length > MAX_MESSAGE * 0.9 ? "text-amber-300/80" : "text-white/25"
                      }`}
                    >
                      {form.message.length > 0 && `${form.message.length}/${MAX_MESSAGE}`}
                    </span>
                  </span>
                  <textarea
                    required
                    rows={5}
                    maxLength={MAX_MESSAGE}
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                    className="mt-1.5 min-h-28 w-full resize-y bg-transparent text-[13px] leading-relaxed text-white outline-none placeholder:text-white/30"
                    placeholder="What would you like to talk about?"
                  />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  aria-busy={sending}
                  className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-[13px] font-medium text-white transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff] disabled:cursor-wait disabled:opacity-60"
                  style={{
                    background: "linear-gradient(180deg, #3d9bff 0%, #0a74f0 100%)",
                    boxShadow:
                      "inset 0 0.5px 0 rgba(255,255,255,0.5), 0 0 0 0.5px rgba(0,60,140,0.6), 0 4px 12px rgba(10,116,240,0.35)",
                  }}
                >
                  {sending ? (
                    <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Send size={14} aria-hidden="true" />
                  )}
                  {sending ? "Sending…" : t("sendMessage")}
                </button>

                {status.text && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`flex min-w-0 items-start gap-1.5 text-[12px] leading-snug ${
                      status.type === "error" ? "text-[#ff8a80]" : "text-[#6fdca0]"
                    }`}
                  >
                    {status.type === "error" ? (
                      <CircleAlert size={14} className="mt-px shrink-0" aria-hidden="true" />
                    ) : (
                      <Check size={14} className="mt-px shrink-0" aria-hidden="true" />
                    )}
                    <span>{status.text}</span>
                  </p>
                )}
              </div>
            </form>

            {/* ───────── Contact card ───────── */}
            <aside
              className="flex flex-col items-center rounded-[20px] p-4 text-center"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
                backdropFilter: "blur(30px) saturate(180%)",
                WebkitBackdropFilter: "blur(30px) saturate(180%)",
                boxShadow:
                  "inset 0 0.5px 0 rgba(255,255,255,0.35), 0 0 0 0.5px rgba(255,255,255,0.12), 0 10px 28px rgba(0,0,0,0.3)",
              }}
            >
              <div
                aria-hidden="true"
                className="flex h-[72px] w-[72px] items-center justify-center rounded-full text-[26px] font-semibold tracking-tight text-white"
                style={{
                  background: "linear-gradient(160deg, #8e9bb0 0%, #4b566a 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.45), 0 0 0 0.5px rgba(0,0,0,0.3), 0 6px 14px rgba(0,0,0,0.35)",
                }}
              >
                HT
              </div>
              <h2 className="mt-3 text-[16px] font-semibold leading-tight tracking-[-0.01em]">
                Harshit Tiwari
              </h2>
              <p className="mt-0.5 text-[12px] text-white/50">Developer</p>

              <div className="mt-4 w-full divide-y divide-white/[0.09] overflow-hidden rounded-xl bg-black/20 text-left ring-1 ring-inset ring-white/[0.08]">
                <div className="px-3 py-2.5">
                  <p className="text-[11px] text-white/45">email</p>
                  <div className="mt-0.5 flex items-start justify-between gap-1.5">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="break-all text-[12.5px] leading-snug text-[#64b0ff] transition-colors hover:text-[#9ccbff]"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    <button
                      type="button"
                      onClick={copyEmail}
                      aria-label={copied ? "Email copied" : "Copy email address"}
                      className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white/45 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]"
                    >
                      {copied ? (
                        <Check size={13} className="text-[#6fdca0]" aria-hidden="true" />
                      ) : (
                        <Copy size={13} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-[11px] text-white/45">LinkedIn</p>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-flex items-center gap-1 text-[12.5px] text-[#64b0ff] transition-colors hover:text-[#9ccbff]"
                  >
                    Harshit Tiwari
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </MacWindow>
  );
};

export default ContactWindow;