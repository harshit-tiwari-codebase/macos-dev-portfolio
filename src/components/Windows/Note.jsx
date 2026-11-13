import { useEffect, useState } from "react";
import MacWindow from "./MacWindow";
import axios from "axios";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Copy } from "lucide-react";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Note = ({ windowName, WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  const [markdown, setMarkdown] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("/documents/Notes.md");
        setMarkdown(response.data);
      } catch (error) {
        console.log("Error Fetching Notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const handleCopy = () => {
    if (markdown) {
      navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
      <div className="flex h-full w-full flex-col bg-[#10141a] text-[#e9edf3]">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#2a313c] bg-[#141922] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <img src="/doc-icons/note.svg" alt="" className="h-4 w-4 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">profile.js</p>
              <p className="text-[11px] text-[#8793a2]">Developer overview · Read only</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#343d49] bg-[#1a2029] px-3 py-2 text-xs font-medium text-[#c8d0db] transition-colors hover:bg-[#252d38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          {markdown ? (
            <div className="mx-auto max-w-4xl overflow-hidden border border-[#2b333d] bg-[#151b24]">
              <div className="flex items-center justify-between border-b border-[#2b333d] px-4 py-2">
                <span className="font-mono text-[11px] text-[#8793a2]">profile.js</span>
                <span className="text-[11px] text-[#788493]">JavaScript</span>
              </div>
              <SyntaxHighlighter
                language="javascript"
                style={atomOneDark}
                customStyle={{
                  background: "transparent",
                  margin: 0,
                  padding: "1rem 0.75rem",
                  fontSize: "0.8rem",
                  lineHeight: "1.65",
                }}
                lineNumberStyle={{ color: "#778493", minWidth: "3.25em" }}
                showLineNumbers
              >
                {markdown}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#8793a2]" role="status">
              Loading notes…
            </div>
          )}
        </div>
      </div>
    </MacWindow>
  );
};

export default Note;
