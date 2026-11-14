import { useEffect, useState } from "react";
import MacWindow from "./MacWindow";
import axios from "axios";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Check, Copy, LoaderCircle } from "lucide-react";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';
const MONO_STACK =
  'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

const Note = ({ windowName, WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  const [markdown, setMarkdown] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("/documents/Notes.md");
        setMarkdown(response.data);
      } catch (error) {
        console.log("Error Fetching Notes:", error);
        setError(true);
      }
    };

    fetchNotes();
  }, []);

  const handleCopy = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked: nothing to confirm */
    }
  };

  const lineCount = markdown ? String(markdown).split("\n").length : 0;

  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Developer Notes"
      initialWidth={720}
      initialHeight={520}
    >
      <div
        className="flex h-full w-full flex-col text-white"
        style={{
          fontFamily: FONT_STACK,
          background:
            "radial-gradient(100% 50% at 100% 0%, rgba(10,132,255,0.11) 0%, rgba(10,132,255,0) 60%), linear-gradient(180deg, #14171d 0%, #0d1015 100%)",
        }}
      >
        {/* Toolbar */}
        <div
          className="flex shrink-0 items-center justify-between gap-3 px-4 py-2.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(30px) saturate(180%)",
            WebkitBackdropFilter: "blur(30px) saturate(180%)",
            boxShadow: "inset 0 -0.5px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
              style={{
                background: "linear-gradient(180deg, #ffd25a 0%, #f59e0b 100%)",
                boxShadow:
                  "inset 0 0.5px 0 rgba(255,255,255,0.55), 0 0 0 0.5px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              <img src="/doc-icons/note.svg" alt="" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-tight tracking-[-0.01em]">profile.js</p>
              <p className="mt-0.5 text-[11.5px] leading-tight text-white/45">Developer overview · Read only</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!markdown}
            className="inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white/[0.07] px-3.5 text-[12px] font-medium text-white/80 ring-1 ring-inset ring-white/[0.1] transition-colors hover:bg-white/[0.13] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff] disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white/[0.07]"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-[#6fdca0]" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Editor */}
        <div className="min-h-0 flex-1 overflow-auto p-4 [scrollbar-color:rgba(255,255,255,0.18)_transparent] [scrollbar-width:thin] sm:p-5">
          {markdown ? (
            <div
              className="mx-auto max-w-4xl overflow-hidden rounded-[16px]"
              style={{
                background: "rgba(0,0,0,0.28)",
                boxShadow:
                  "inset 0 0.5px 0 rgba(255,255,255,0.12), 0 0 0 0.5px rgba(255,255,255,0.1), 0 10px 28px rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-2"
                style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 -0.5px 0 rgba(255,255,255,0.08)" }}
              >
                <span className="text-[12px] font-medium text-white/70" style={{ fontFamily: MONO_STACK }}>
                  profile.js
                </span>
                <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[11px] text-white/50">JavaScript</span>
              </div>
              <SyntaxHighlighter
                language="javascript"
                style={atomOneDark}
                customStyle={{
                  background: "transparent",
                  margin: 0,
                  padding: "1rem 0.75rem",
                  fontSize: "12.5px",
                  lineHeight: "1.65",
                  fontFamily: MONO_STACK,
                }}
                codeTagProps={{ style: { fontFamily: MONO_STACK } }}
                lineNumberStyle={{ color: "rgba(255,255,255,0.25)", minWidth: "3.25em" }}
                showLineNumbers
              >
                {markdown}
              </SyntaxHighlighter>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center px-6 text-center text-[13px] text-white/50" role="status">
              Notes could not be loaded. Close and reopen this window to try again.
            </div>
          ) : (
            <div className="flex h-full items-center justify-center gap-2 text-[13px] text-white/50" role="status">
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading notes…
            </div>
          )}
        </div>

        {/* Status bar */}
        {markdown && (
          <div
            className="flex shrink-0 items-center justify-between px-4 py-1.5 text-[11px] text-white/40"
            style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.08)" }}
          >
            <span className="tabular-nums">{lineCount} lines</span>
            <span>UTF-8 · JavaScript</span>
          </div>
        )}
      </div>
    </MacWindow>
  );
};

export default Note;