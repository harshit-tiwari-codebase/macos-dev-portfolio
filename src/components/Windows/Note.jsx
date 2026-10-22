import React, { useEffect, useState } from "react";
import MacWindow from "./MacWindow";
import axios from "axios";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierDuneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

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
      title="Notes.js — Quick Overview"
      initialWidth={680}
      initialHeight={480}
    >
      <div className="w-full h-full flex flex-col bg-[#0d1117] text-white">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-white/5 border-b border-white/10 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span className="text-[11px] sm:text-xs">Notes.js (Read-only)</span>
          </div>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-gray-200 transition cursor-pointer"
          >
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        <div className="flex-1 overflow-auto text-xs sm:text-sm p-1 sm:p-2">
          {markdown ? (
            <SyntaxHighlighter
              language="javascript"
              style={atelierDuneDark}
              customStyle={{
                background: "transparent",
                margin: 0,
                padding: "0.75rem",
                fontSize: "0.8rem",
                lineHeight: "1.45",
              }}
              showLineNumbers
            >
              {markdown}
            </SyntaxHighlighter>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              Loading note...
            </div>
          )}
        </div>
      </div>
    </MacWindow>
  );
};

export default Note;
