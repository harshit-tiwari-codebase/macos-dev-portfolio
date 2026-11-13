import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, LoaderCircle, Send } from "lucide-react";
import MacWindow from "./MacWindow";

const CONTACT_EMAIL = "harshit20112005@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/harshit-tiwari-48830b3b4/";

const notify = (title, message) =>
  window.dispatchEvent(new CustomEvent("portfolio:notification", { detail: { title, message } }));

const ContactWindow = ({ windowName, WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus("");
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
        setStatus("Message sent. Thanks for reaching out!");
        notify("Message sent", "Your message was delivered to Harshit.");
      } else {
        const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
        const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        setStatus("Your email app opened with the message ready to send.");
        notify("Email draft ready", "Finish sending your message in your email app.");
      }
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("Could not send right now. Please try again or email directly.");
      notify("Message not sent", "Please try again or use the email link.");
    } finally {
      setSending(false);
    }
  };

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-[#303a48] bg-[#171d26] px-3.5 py-3 text-sm text-[#edf0f5] outline-none transition placeholder:text-[#788493] focus:border-[#91a5f4] focus:ring-4 focus:ring-[#91a5f4]/10";

  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Contact Harshit"
      initialWidth={640}
      initialHeight={590}
    >
      <div className="h-full overflow-y-auto bg-[#10141a] p-4 text-[#edf0f5] sm:p-5">
        <div className="mx-auto max-w-3xl">
          <header className="mb-5 flex items-start justify-between gap-4">
            <div className="max-w-[38rem]">
              <p className="mb-2 flex items-center gap-2 text-xs font-medium text-[#a3adba]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#35a77a]" />
                Open to thoughtful conversations
              </p>
              <h1 className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-[2.1rem]">
                {t("contactHeading")}
              </h1>
              <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-[#a3adba]">
                Have a project, opportunity, or question? Send a note and tell me a little about it.
              </p>
            </div>
            <div className="mt-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#242e43] text-[#aebdff] min-[420px]:flex">
              <img src="/doc-icons/mail.svg" alt="" className="h-5 w-5" />
            </div>
          </header>

          <form
            onSubmit={submit}
            className="grid gap-4 min-[560px]:grid-cols-[minmax(0,1fr)_12rem] min-[560px]:gap-3"
          >
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#aab4c1]">
                {t("yourName")}
                <input
                  required
                  maxLength={100}
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className={fieldClass}
                  placeholder={t("yourName")}
                />
              </label>

              <label className="block text-xs font-semibold text-[#aab4c1]">
                {t("yourEmail")}
                <input
                  required
                  type="email"
                  maxLength={180}
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className={fieldClass}
                  placeholder="you@example.com"
                />
              </label>

              <label className="block text-xs font-semibold text-[#aab4c1]">
                {t("message")}
                <textarea
                  required
                  rows={4}
                  maxLength={5000}
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  className={`${fieldClass} min-h-24 resize-y`}
                  placeholder={t("message")}
                />
              </label>

              {status && (
                <p role="status" aria-live="polite" className="text-xs leading-relaxed text-[#aab4c1]">
                  {status}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d5defd] px-4 py-3 text-sm font-semibold text-[#19233a] transition-colors hover:bg-[#bdcbff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff] disabled:cursor-wait disabled:opacity-60"
              >
                {sending ? (
                  <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Send size={15} aria-hidden="true" />
                )}
                {sending ? "Sending…" : t("sendMessage")}
              </button>
              <p className="text-[11px] leading-relaxed text-[#7f8a98]">
                EmailJS sends directly when configured; otherwise, your email app opens a ready-to-send draft.
              </p>
            </div>

            <aside className="flex min-h-40 flex-col justify-between rounded-2xl border border-[#2b333d] bg-[#171d26] p-4 text-[#edf0f5] min-[560px]:min-h-[21rem] min-[560px]:p-4">
              <div>
                <p className="text-xs font-medium text-[#95a0ad]">Prefer a direct note?</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-2 inline-flex items-start gap-1 text-sm font-medium leading-relaxed text-[#c2ceff] transition-colors hover:text-white"
                >
                  <span className="break-all">{CONTACT_EMAIL}</span>
                  <ArrowUpRight size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                </a>
              </div>
              <div className="mt-6 border-t border-[#303a48] pt-4">
                <p className="text-xs leading-relaxed text-[#95a0ad]">
                  Find me elsewhere
                </p>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#c2ceff] transition-colors hover:text-white"
                >
                  LinkedIn
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </aside>
          </form>
        </div>
      </div>
    </MacWindow>
  );
};

export default ContactWindow;
